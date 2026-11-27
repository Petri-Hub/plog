---
title: 'What Kubernetes taught me about failing on purpose'
description: 'Probes, budgets and restarts: designing services that expect to die.'
date: '2026-09-30'
tags: ['kubernetes', 'reliability']
highlighted: true
alternates:
  - 'en-us/what-kubernetes-taught-me-about-failing-on-purpose'
  - 'pt-br/what-kubernetes-taught-me-about-failing-on-purpose'
---

Kubernetes kills your pods. It does it when a node drains, when you deploy, when a probe fails and sometimes when you didn't ask for anything at all. For a long time I treated that as a problem to work around. It turned out to be the most useful thing the platform ever taught me: a service should expect to die, and die well.

## Three probes, three questions

Kubernetes asks your container three different questions, and mixing them up is how most of my outages started:

| Probe       | The question it asks                       | What happens when it fails              |
| ----------- | ------------------------------------------ | --------------------------------------- |
| `startup`   | Has the app finished starting?             | It keeps waiting, then restarts the app |
| `readiness` | Should it receive traffic right now?       | The pod leaves the Service's endpoints  |
| `liveness`  | Is it stuck in a way only a restart fixes? | The container restarts                  |

### Liveness is not a health check

My first liveness probe called an endpoint that also checked the database. One day the database had a ten-second hiccup, every pod failed its liveness probe at once, and Kubernetes restarted the whole service exactly when it needed to be patient.

A liveness probe should only fail when restarting **this container** would help. A slow database is a readiness problem: stop sending traffic, wait, and come back.

```yaml title="deployment.yaml"
containers:
  - name: api
    image: registry.lab.petri.zip/api:1.8.2
    startupProbe:
      httpGet: { path: /q/health/started, port: 8080 }
      periodSeconds: 2
      failureThreshold: 30
    readinessProbe:
      httpGet: { path: /q/health/ready, port: 8080 }
      periodSeconds: 5
    livenessProbe:
      httpGet: { path: /q/health/live, port: 8080 }
      periodSeconds: 10
      failureThreshold: 3
```

## Dying well

When a pod is deleted, two things start at the same time, and that "same time" is the whole problem:

1. Kubernetes starts removing the pod from the Service's endpoints, and every node has to hear about it.
2. The container gets its `preStop` hook, then `SIGTERM`.
3. After `terminationGracePeriodSeconds`, anything still running gets `SIGKILL`.

Because the first two race, a request can still arrive after the app started shutting down. A short pause in `preStop` gives the endpoints time to catch up. The built-in `sleep` action, on by default since Kubernetes 1.30, does it without a shell in the image:

```yaml title="deployment.yaml"
lifecycle:
  preStop:
    sleep:
      seconds: 5
terminationGracePeriodSeconds: 30
```

## Budgets for the planned ones

A `PodDisruptionBudget` tells Kubernetes how many pods must stay up during _voluntary_ disruptions, such as draining a node for an upgrade:

```yaml title="pdb.yaml"
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api
```

It protects you from your own maintenance. It does nothing when a node catches fire.

## Breaking it on purpose

None of this is real until you watch it work. In my homelab I run a load test and delete a random pod every twenty seconds:

```sh title="terminal"
$ while true; do kubectl delete "$(kubectl get pods -l app=api -o name | shuf -n 1)" --wait=false; sleep 20; done
```

If the error rate moves, something above is wrong, and it is much better to find out on a Tuesday afternoon than during a deploy on Friday.

> A service that has never been killed on purpose has only been lucky.

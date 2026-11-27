---
title: 'O que o Kubernetes me ensinou sobre falhar de propósito'
description: 'Probes, budgets e restarts: projetando serviços que esperam morrer.'
date: '2026-09-30'
tags: ['kubernetes', 'reliability']
highlighted: true
alternates:
  - 'en-us/what-kubernetes-taught-me-about-failing-on-purpose'
  - 'pt-br/what-kubernetes-taught-me-about-failing-on-purpose'
---

O Kubernetes mata os seus pods. Ele faz isso quando um nó é drenado, quando você faz deploy, quando uma probe falha e às vezes quando você não pediu nada. Por muito tempo eu tratei isso como um problema a contornar. No fim, foi a coisa mais útil que a plataforma me ensinou: um serviço deve esperar morrer, e morrer bem.

## Três probes, três perguntas

O Kubernetes faz três perguntas diferentes ao seu container, e confundir uma com a outra foi como começou a maioria das minhas quedas:

| Probe       | A pergunta que ela faz                            | O que acontece quando falha              |
| ----------- | ------------------------------------------------- | ---------------------------------------- |
| `startup`   | A aplicação terminou de subir?                    | Ele continua esperando e depois reinicia |
| `readiness` | Ela deve receber tráfego agora?                   | O pod sai dos endpoints do Service       |
| `liveness`  | Ela travou de um jeito que só um restart resolve? | O container reinicia                     |

### Liveness não é health check

Minha primeira liveness probe chamava um endpoint que também verificava o banco de dados. Um dia o banco teve um soluço de dez segundos, todos os pods falharam na liveness ao mesmo tempo, e o Kubernetes reiniciou o serviço inteiro justamente quando ele precisava ter paciência.

Uma liveness probe só deve falhar quando reiniciar **este container** ajudaria. Um banco lento é problema de readiness: pare de mandar tráfego, espere e volte.

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

## Morrendo bem

Quando um pod é apagado, duas coisas começam ao mesmo tempo, e esse "ao mesmo tempo" é o problema todo:

1. O Kubernetes começa a tirar o pod dos endpoints do Service, e todos os nós precisam ficar sabendo.
2. O container recebe o hook `preStop` e depois o `SIGTERM`.
3. Depois de `terminationGracePeriodSeconds`, o que ainda estiver rodando recebe `SIGKILL`.

Como os dois primeiros correm em paralelo, uma requisição ainda pode chegar depois que a aplicação começou a desligar. Uma pausa curta no `preStop` dá tempo para os endpoints se atualizarem. A ação `sleep` nativa, ligada por padrão desde o Kubernetes 1.30, faz isso sem precisar de um shell na imagem:

```yaml title="deployment.yaml"
lifecycle:
  preStop:
    sleep:
      seconds: 5
terminationGracePeriodSeconds: 30
```

## Budgets para as interrupções planejadas

Um `PodDisruptionBudget` diz ao Kubernetes quantos pods precisam continuar no ar durante interrupções _voluntárias_, como drenar um nó para uma atualização:

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

Ele protege você da sua própria manutenção. Não faz nada quando um nó pega fogo.

## Quebrando de propósito

Nada disso é real até você ver funcionando. No meu homelab eu rodo um teste de carga e apago um pod aleatório a cada vinte segundos:

```sh title="terminal"
$ while true; do kubectl delete "$(kubectl get pods -l app=api -o name | shuf -n 1)" --wait=false; sleep 20; done
```

Se a taxa de erro mexer, algo acima está errado, e é muito melhor descobrir numa terça à tarde do que num deploy de sexta.

> Um serviço que nunca foi derrubado de propósito só teve sorte.

---
title: 'Quarkus native images: fast startup, slow builds'
description: 'Measuring the trade-off instead of arguing about it.'
date: '2025-12-12'
tags: ['java', 'quarkus']
highlighted: false
alternates:
  - 'en-us/quarkus-native-images-fast-startup-slow-builds'
  - 'pt-br/quarkus-native-images-fast-startup-slow-builds'
---

Every discussion about native images I have seen ends in two camps: people who saw a service start in thirty milliseconds, and people who waited four minutes for it to build. Both are right. So I took one small Quarkus service from my homelab and measured it both ways.

## Building it

Quarkus builds a native executable with GraalVM's `native-image`. Building inside a container means you don't need GraalVM installed on your machine:

```sh title="terminal"
$ ./mvnw package -Dnative -Dquarkus.native.container-build=true
$ ls -lh target/*-runner
-rwxr-xr-x 1 petri petri 61M Dec 12 21:40 target/notes-api-1.0.0-runner
```

The build runs a _closed-world analysis_: it follows every path your code can take and leaves out everything it can't reach. That is why the result is small and fast, and also why the build is slow.

## The numbers

Same service, same machine, same request, measured five times each:

| Measurement           | JVM mode | Native     |
| --------------------- | -------- | ---------- |
| Build time            | 18 s     | 3 min 40 s |
| Time to first request | 1.2 s    | 0.03 s     |
| Memory at idle (RSS)  | 180 MB   | 45 MB      |
| Container image       | 410 MB   | 95 MB      |
| Requests per second   | 9 800    | 7 900      |

Startup and memory are where native wins by far. Peak throughput is where it loses: the JVM's just-in-time compiler optimizes for the code that actually runs, and an ahead-of-time build has to guess.

## The part that bites

The closed world doesn't know about code that is only reached through reflection, such as a class Jackson builds from JSON. In JVM mode it just works. In native mode the class is missing, and you find out at runtime:

```java title="LegacyEvent.java"
@RegisterForReflection
public record LegacyEvent(String type, Instant at) {}
```

Quarkus registers most of these for you, such as REST endpoints and their types. The ones it can't see, like classes deserialized by a library you call by hand, need the annotation.

---

My rule after this:

- **Native** for things that scale to zero, start often or live in small machines.
- **JVM** for long-running services with steady traffic, where peak throughput matters more than startup.
- Always run the integration tests against the native build, because that is where reflection surprises show up.

---
title: 'Imagens nativas no Quarkus: startup rápido, build lento'
description: 'Medindo o trade-off em vez de discutir sobre ele.'
date: '2025-12-12'
tags: ['java', 'quarkus']
highlighted: false
alternates:
  - 'en-us/quarkus-native-images-fast-startup-slow-builds'
  - 'pt-br/quarkus-native-images-fast-startup-slow-builds'
---

Toda discussão sobre imagens nativas que eu vi termina em dois lados: quem viu um serviço subir em trinta milissegundos e quem esperou quatro minutos pelo build. Os dois têm razão. Então peguei um serviço pequeno em Quarkus do meu homelab e medi dos dois jeitos.

## Fazendo o build

O Quarkus gera um executável nativo com o `native-image` do GraalVM. Fazer o build dentro de um container dispensa ter o GraalVM instalado na máquina:

```sh title="terminal"
$ ./mvnw package -Dnative -Dquarkus.native.container-build=true
$ ls -lh target/*-runner
-rwxr-xr-x 1 petri petri 61M Dec 12 21:40 target/notes-api-1.0.0-runner
```

O build faz uma _análise de mundo fechado_: segue todo caminho que o seu código pode tomar e deixa de fora tudo o que não alcança. É por isso que o resultado é pequeno e rápido, e também por isso que o build é lento.

## Os números

Mesmo serviço, mesma máquina, mesma requisição, medido cinco vezes cada:

| Medida                    | Modo JVM | Nativo     |
| ------------------------- | -------- | ---------- |
| Tempo de build            | 18 s     | 3 min 40 s |
| Tempo até a 1ª requisição | 1,2 s    | 0,03 s     |
| Memória parada (RSS)      | 180 MB   | 45 MB      |
| Imagem do container       | 410 MB   | 95 MB      |
| Requisições por segundo   | 9 800    | 7 900      |

Startup e memória são onde o nativo ganha de longe. Throughput de pico é onde ele perde: o compilador just-in-time da JVM otimiza o código que de fato roda, e um build antecipado precisa adivinhar.

## A parte que morde

O mundo fechado não conhece código que só é alcançado por reflexão, como uma classe que o Jackson monta a partir de JSON. No modo JVM, simplesmente funciona. No modo nativo a classe some, e você descobre em tempo de execução:

```java title="LegacyEvent.java"
@RegisterForReflection
public record LegacyEvent(String type, Instant at) {}
```

O Quarkus registra a maioria desses casos para você, como endpoints REST e seus tipos. Os que ele não enxerga, como classes desserializadas por uma biblioteca que você chama na mão, precisam da anotação.

---

Minha regra depois disso:

- **Nativo** para o que escala até zero, sobe com frequência ou vive em máquinas pequenas.
- **JVM** para serviços de longa duração com tráfego constante, onde o throughput de pico importa mais que o startup.
- Sempre rodar os testes de integração contra o build nativo, porque é lá que as surpresas de reflexão aparecem.

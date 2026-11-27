---
title: 'Chaves de idempotência, ou como cobrar um cartão uma vez só'
description: 'Tentar de novo é fácil. Tentar de novo com segurança é a parte difícil.'
date: '2026-11-19'
tags: ['backend', 'apis']
highlighted: false
alternates:
  - 'en-us/idempotency-keys-charging-a-card-once'
  - 'pt-br/idempotency-keys-charging-a-card-once'
---

Uma requisição de pagamento estoura o tempo limite. A cobrança falhou, ou só a resposta se perdeu no caminho de volta? O cliente não tem como saber, e as duas saídas óbvias estão erradas: desistir perde a venda, e tentar de novo às cegas pode cobrar o cliente duas vezes.

Chaves de idempotência tornam a nova tentativa segura. A ideia cabe em uma frase: _a mesma intenção, enviada quantas vezes for, tem o efeito de ter sido enviada uma vez._

## Uma chave por intenção

O cliente gera uma chave aleatória para cada intenção, como um checkout, e manda a mesma chave em todas as tentativas dessa intenção:

```http title="request.http"
POST /payments HTTP/1.1
Content-Type: application/json
Idempotency-Key: 3f6c1b52-8d0e-4a7b-9a51-2f4c9b1e7d10

{ "orderId": "ord_4821", "amountCents": 4990, "currency": "BRL" }
```

A chave pertence ao cliente, nunca ao servidor. Se o servidor gerasse a chave, cada nova tentativa chegaria como uma requisição nova.

## O que o servidor guarda

O servidor mantém uma linha por chave: um hash da requisição, em que ponto do processo ela está e a resposta que foi enviada.

```sql title="V12__idempotency_keys.sql"
CREATE TABLE idempotency_keys (
  key          UUID PRIMARY KEY,
  request_hash TEXT        NOT NULL,
  status       TEXT        NOT NULL,
  response     JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Inserir primeiro, cobrar depois

A ordem importa. A linha entra **antes** da cobrança, e a chave primária decide quem chegou primeiro, mesmo quando duas tentativas chegam no mesmo milissegundo:

```java title="PaymentService.java"
public PaymentResponse charge(UUID key, PaymentRequest request) {
    String hash = hash(request);
    boolean isFirst = keys.insertIfAbsent(key, hash, Status.PROCESSING);

    if (!isFirst) {
        return replay(key, hash);
    }

    PaymentResponse response = gateway.charge(request);
    keys.complete(key, response);
    return response;
}
```

## Respondendo a uma nova tentativa

O `replay` olha a linha guardada e responde de uma de quatro formas:

| Situação                                | Resposta                                        |
| --------------------------------------- | ----------------------------------------------- |
| Mesma chave, mesmo corpo, concluída     | A resposta guardada, exatamente como era        |
| Mesma chave, mesmo corpo, ainda rodando | `409 Conflict`, para o cliente esperar um pouco |
| Mesma chave, corpo diferente            | `422 Unprocessable Entity`                      |
| Uma chave que o servidor nunca viu      | Processar como uma requisição nova              |

## Letras miúdas

- Guarde as chaves pelo menos enquanto os clientes continuarem tentando. Vinte e quatro horas é uma escolha comum.
- Faça o hash do corpo, para ninguém reaproveitar uma chave em outro pagamento.
- Guarde a resposta mesmo quando ela for um erro. Um cartão recusado deve continuar recusado em todas as tentativas.

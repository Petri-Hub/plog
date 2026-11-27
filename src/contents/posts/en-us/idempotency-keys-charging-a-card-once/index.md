---
title: 'Idempotency keys, or how to charge a card only once'
description: 'Retries are easy. Retrying safely is the hard part.'
date: '2026-11-19'
tags: ['backend', 'apis']
highlighted: false
alternates:
  - 'en-us/idempotency-keys-charging-a-card-once'
  - 'pt-br/idempotency-keys-charging-a-card-once'
---

A payment request times out. Did the charge fail, or did only the answer get lost on its way back? The client can't tell, and both obvious choices are wrong: giving up loses a sale, and retrying blindly can charge the customer twice.

Idempotency keys make the retry safe. The idea fits in one sentence: _the same intent, sent any number of times, has the effect of being sent once._

## One key per intent

The client generates a random key for each intent, such as one checkout, and sends the same key with every retry of that intent:

```http title="request.http"
POST /payments HTTP/1.1
Content-Type: application/json
Idempotency-Key: 3f6c1b52-8d0e-4a7b-9a51-2f4c9b1e7d10

{ "orderId": "ord_4821", "amountCents": 4990, "currency": "BRL" }
```

The key belongs to the client, never to the server. If the server generated it, every retry would arrive as a brand new request.

## What the server stores

The server keeps one row per key: a hash of the request, where it is in the process, and the response it sent.

```sql title="V12__idempotency_keys.sql"
CREATE TABLE idempotency_keys (
  key          UUID PRIMARY KEY,
  request_hash TEXT        NOT NULL,
  status       TEXT        NOT NULL,
  response     JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Insert first, then charge

The order matters. The row goes in **before** the charge, and the primary key decides who got there first, even when two retries arrive in the same millisecond:

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

## Answering a retry

`replay` looks at the stored row and answers one of four ways:

| Situation                          | Answer                                       |
| ---------------------------------- | -------------------------------------------- |
| Same key, same body, finished      | The stored response, exactly as it was       |
| Same key, same body, still running | `409 Conflict`, so the client waits a little |
| Same key, different body           | `422 Unprocessable Entity`                   |
| A key the server has never seen    | Process it as a new request                  |

## Small print

- Keep keys at least as long as clients keep retrying. Twenty-four hours is a common choice.
- Hash the body, so nobody can reuse a key for a different payment.
- Store the response even when it is an error. A declined card should stay declined on every retry.

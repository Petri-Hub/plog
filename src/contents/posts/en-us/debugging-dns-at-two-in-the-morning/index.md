---
title: 'Debugging DNS at two in the morning'
description: 'It was DNS. It is always DNS. Here is how I proved it this time.'
date: '2026-08-14'
tags: ['networks', 'homelab']
highlighted: true
alternates:
  - 'en-us/debugging-dns-at-two-in-the-morning'
  - 'pt-br/debugging-dns-at-two-in-the-morning'
---

At 2 a.m. my homelab dashboard stopped loading. The server was up, `ping` to its IP worked, and the browser still said the site could not be reached. Everyone knows how this story ends, but I wanted to _prove_ it instead of guessing.

## What a lookup actually does

When you type a name, your machine doesn't search the internet. It asks one resolver, and the resolver walks the tree for you:

1. The **stub resolver** on your machine asks the recursive resolver it was configured with.
2. The recursive resolver asks a **root server** who is responsible for `.zip`.
3. The **TLD server** for `.zip` points to the servers that know `petri.zip`.
4. The **authoritative server** finally answers with the record.

Every step can cache the answer, and every cache has its own idea of how long that answer stays true.

## Reproducing it

The first rule of a 2 a.m. bug is to stop clicking around and reproduce it from a terminal. I asked my own machine and then a public resolver for the same name:

```sh title="terminal"
$ dig grafana.lab.petri.zip +short
$ dig grafana.lab.petri.zip @1.1.1.1 +short
192.168.1.40
```

My machine returned nothing, while the public resolver had the right answer. So the record existed. My laptop just refused to believe it.

### The culprit

An hour earlier I had opened the dashboard _before_ creating its record. The local resolver asked, got `NXDOMAIN`, and cached that "no". That is a **negative cache** entry, and how long a resolver keeps a "no" comes from the last field of the zone's SOA record, as [RFC 2308](https://www.rfc-editor.org/rfc/rfc2308) describes:

```sh title="terminal"
$ dig petri.zip SOA +short
ns1.petri.zip. admin.petri.zip. 2026081401 7200 3600 1209600 10800
```

That last number, `10800`, is three hours of my laptop confidently telling me the site didn't exist.

## The fix

Flushing the local cache made the dashboard load at once:

```sh title="terminal"
$ sudo resolvectl flush-caches
$ curl -sI https://grafana.lab.petri.zip | head -1
HTTP/2 200
```

Then I lowered that last SOA field to five minutes, so the next record I create in the wrong order only lies to me briefly.

> It's not DNS. There's no way it's DNS. It was DNS.
> <cite>every homelab, eventually</cite>

---

What I'm keeping from this night:

- Reproduce with `dig` against two resolvers before touching anything else.
- Read the SOA record. The negative TTL is part of the contract.
- Create the record **before** the first request, not after.

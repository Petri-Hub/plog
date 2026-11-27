---
title: 'Notes on the OSI model that finally stuck'
description: 'Seven layers, and the two or three that matter when something breaks.'
date: '2024-03-15'
tags: ['networks', 'study']
highlighted: false
alternates:
  - 'en-us/notes-on-the-osi-model-that-finally-stuck'
  - 'pt-br/notes-on-the-osi-model-that-finally-stuck'
---

I memorized the seven layers of the OSI model three times for three different exams, and forgot them three times. What finally made them stick was ignoring the definitions and attaching each layer to something I actually check when a network breaks.

## The seven layers, as I use them

| Layer | Name         | An example               | What I check                       |
| ----- | ------------ | ------------------------ | ---------------------------------- |
| 7     | Application  | HTTP, DNS, SSH           | The status code and the logs       |
| 6     | Presentation | TLS, character encodings | Certificates and expired chains    |
| 5     | Session      | Keeping a login alive    | Rarely anything on its own         |
| 4     | Transport    | TCP and UDP ports        | Is the port open and listening?    |
| 3     | Network      | IP addresses, routing    | Can I `ping` it? Is there a route? |
| 2     | Data link    | Ethernet, MAC addresses  | Is it on the right VLAN?           |
| 1     | Physical     | Cables, Wi-Fi signal     | Is the light on the port blinking? |

Real protocols don't respect these borders. TLS is drawn in different layers depending on who draws it, and the TCP/IP model, which is what the internet actually runs on, folds the top three into one. The OSI model is a map, not the territory.

## The layers that matter at 2 a.m.

When something stops working, I go from the bottom up and stop at the first layer that fails:

- **Layer 3:** does the machine answer `ping`, and does `ip route` know how to reach it?
- **Layer 4:** is something listening? `ss -tlnp` on the server answers in one line.
- **Layer 7:** does the application answer, and what does it say?

Most of my problems turned out to be at layer 7, with one famous exception that is always DNS.

> You don't need to remember the layers. You need to remember to check them in order.

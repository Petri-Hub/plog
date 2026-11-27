---
title: 'Reading the TCP handshake, one packet at a time'
description: 'SYN, SYN-ACK, ACK, with a packet capture open next to each step.'
date: '2024-10-05'
tags: ['networks']
highlighted: false
alternates:
  - 'en-us/reading-the-tcp-handshake-one-packet-at-a-time'
  - 'pt-br/reading-the-tcp-handshake-one-packet-at-a-time'
---

Every networking course draws the three-way handshake as three arrows on a whiteboard. I understood the arrows. I didn't understand the handshake until I captured one and read every field.

## Capturing it

On the server, I asked `tcpdump` for the packets between my laptop and port 443, without resolving names or ports:

```sh title="terminal"
$ sudo tcpdump -i eth0 -nn 'tcp port 443 and host 192.168.1.10'
```

Then I opened the page once from the laptop. These are the first three lines:

```text title="tcpdump"
14:02:11.120394 IP 192.168.1.10.51544 > 192.168.1.40.443: Flags [S], seq 1907437712, win 64240, options [mss 1460,sackOK,TS val 1 ecr 0,nop,wscale 7], length 0
14:02:11.120871 IP 192.168.1.40.443 > 192.168.1.10.51544: Flags [S.], seq 2851902843, ack 1907437713, win 65160, options [mss 1460,sackOK,TS val 2 ecr 1,nop,wscale 7], length 0
14:02:11.120902 IP 192.168.1.10.51544 > 192.168.1.40.443: Flags [.], ack 2851902844, win 502, length 0
```

## Reading it, line by line

1. **SYN** (`[S]`): the laptop picks a random starting number, `1907437712`, and says: _I want to talk, and I will count my bytes from here._
2. **SYN-ACK** (`[S.]`): the server acknowledges with `ack 1907437713`, the laptop's number plus one, and picks its own random start, `2851902843`.
3. **ACK** (`[.]`): the laptop acknowledges the server's number plus one. Both sides now know where the other one is counting from.

The "plus one" is the part the whiteboard never showed me. A SYN carries no data, but it still uses up one sequence number, so the next byte is numbered one higher.

### Why the numbers are random

If every connection started counting at zero, anyone who could guess a connection's numbers could slip a packet into it. Random starting numbers make that guess much harder, which is why the two sides never start at the same place.

### The options matter too

Both SYNs carry `mss 1460`, the largest segment each side wants to receive, and `wscale 7`, which lets the window grow past 64 KB. That explains the odd `win 502` on the last line: with a scale of 7, it really means `502 × 128 = 64256` bytes.

---

Next time a connection hangs before any data moves, I know where to look: if the SYN leaves and no SYN-ACK comes back, the problem is in the path or a firewall, not in the application.

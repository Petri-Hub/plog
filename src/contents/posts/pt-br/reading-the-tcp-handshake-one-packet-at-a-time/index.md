---
title: 'Lendo o handshake TCP, um pacote por vez'
description: 'SYN, SYN-ACK, ACK, com uma captura de pacotes aberta ao lado de cada passo.'
date: '2024-10-05'
tags: ['networks']
highlighted: false
alternates:
  - 'en-us/reading-the-tcp-handshake-one-packet-at-a-time'
  - 'pt-br/reading-the-tcp-handshake-one-packet-at-a-time'
---

Todo curso de redes desenha o three-way handshake como três setas num quadro branco. Eu entendia as setas. Só entendi o handshake quando capturei um e li cada campo.

## Capturando

No servidor, pedi ao `tcpdump` os pacotes entre o meu notebook e a porta 443, sem resolver nomes nem portas:

```sh title="terminal"
$ sudo tcpdump -i eth0 -nn 'tcp port 443 and host 192.168.1.10'
```

Depois abri a página uma vez pelo notebook. Estas são as três primeiras linhas:

```text title="tcpdump"
14:02:11.120394 IP 192.168.1.10.51544 > 192.168.1.40.443: Flags [S], seq 1907437712, win 64240, options [mss 1460,sackOK,TS val 1 ecr 0,nop,wscale 7], length 0
14:02:11.120871 IP 192.168.1.40.443 > 192.168.1.10.51544: Flags [S.], seq 2851902843, ack 1907437713, win 65160, options [mss 1460,sackOK,TS val 2 ecr 1,nop,wscale 7], length 0
14:02:11.120902 IP 192.168.1.10.51544 > 192.168.1.40.443: Flags [.], ack 2851902844, win 502, length 0
```

## Lendo, linha por linha

1. **SYN** (`[S]`): o notebook escolhe um número inicial aleatório, `1907437712`, e diz: _quero conversar, e vou contar os meus bytes a partir daqui._
2. **SYN-ACK** (`[S.]`): o servidor confirma com `ack 1907437713`, o número do notebook mais um, e escolhe o seu próprio início aleatório, `2851902843`.
3. **ACK** (`[.]`): o notebook confirma o número do servidor mais um. Agora os dois lados sabem de onde o outro está contando.

O "mais um" é a parte que o quadro branco nunca me mostrou. Um SYN não carrega dados, mas ainda gasta um número de sequência, então o próximo byte é numerado um acima.

### Por que os números são aleatórios

Se toda conexão começasse a contar do zero, qualquer um que adivinhasse os números de uma conexão poderia enfiar um pacote nela. Números iniciais aleatórios tornam esse palpite muito mais difícil, e é por isso que os dois lados nunca começam no mesmo lugar.

### As opções também importam

Os dois SYNs carregam `mss 1460`, o maior segmento que cada lado quer receber, e `wscale 7`, que deixa a janela crescer além de 64 KB. Isso explica o estranho `win 502` na última linha: com escala 7, ele na verdade significa `502 × 128 = 64256` bytes.

---

Da próxima vez que uma conexão travar antes de qualquer dado passar, sei onde olhar: se o SYN sai e nenhum SYN-ACK volta, o problema está no caminho ou num firewall, não na aplicação.

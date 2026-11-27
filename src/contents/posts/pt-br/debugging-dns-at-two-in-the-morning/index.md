---
title: 'Depurando DNS às duas da manhã'
description: 'Era DNS. É sempre DNS. Desta vez, foi assim que eu provei.'
date: '2026-08-14'
tags: ['networks', 'homelab']
highlighted: true
alternates:
  - 'en-us/debugging-dns-at-two-in-the-morning'
  - 'pt-br/debugging-dns-at-two-in-the-morning'
---

Às 2 da manhã o painel do meu homelab parou de carregar. O servidor estava no ar, o `ping` para o IP funcionava, e mesmo assim o navegador dizia que o site não podia ser acessado. Todo mundo sabe como essa história termina, mas eu queria _provar_ em vez de chutar.

## O que uma consulta faz de verdade

Quando você digita um nome, sua máquina não sai procurando na internet. Ela pergunta a um resolvedor, e o resolvedor percorre a árvore por você:

1. O **stub resolver** da sua máquina pergunta ao resolvedor recursivo configurado.
2. O resolvedor recursivo pergunta a um **servidor raiz** quem responde por `.zip`.
3. O **servidor do TLD** `.zip` aponta para os servidores que conhecem `petri.zip`.
4. O **servidor autoritativo** finalmente responde com o registro.

Cada etapa pode guardar a resposta em cache, e cada cache tem a sua própria ideia de quanto tempo essa resposta continua valendo.

## Reproduzindo

A primeira regra de um bug às 2 da manhã é parar de clicar e reproduzir pelo terminal. Perguntei o mesmo nome à minha máquina e a um resolvedor público:

```sh title="terminal"
$ dig grafana.lab.petri.zip +short
$ dig grafana.lab.petri.zip @1.1.1.1 +short
192.168.1.40
```

Minha máquina não devolveu nada, e o resolvedor público tinha a resposta certa. Ou seja, o registro existia. Meu notebook é que se recusava a acreditar nele.

### O culpado

Uma hora antes eu tinha aberto o painel _antes_ de criar o registro. O resolvedor local perguntou, recebeu `NXDOMAIN` e guardou esse "não". Isso é uma entrada de **cache negativo**, e o tempo que um resolvedor guarda um "não" vem do último campo do registro SOA da zona, como descreve a [RFC 2308](https://www.rfc-editor.org/rfc/rfc2308):

```sh title="terminal"
$ dig petri.zip SOA +short
ns1.petri.zip. admin.petri.zip. 2026081401 7200 3600 1209600 10800
```

Esse último número, `10800`, são três horas do meu notebook garantindo que o site não existia.

## A correção

Limpar o cache local fez o painel carregar na hora:

```sh title="terminal"
$ sudo resolvectl flush-caches
$ curl -sI https://grafana.lab.petri.zip | head -1
HTTP/2 200
```

Depois baixei esse último campo do SOA para cinco minutos, para que o próximo registro criado na ordem errada só minta para mim por pouco tempo.

> Não é DNS. Não tem como ser DNS. Era DNS.
> <cite>todo homelab, um dia</cite>

---

O que eu levo dessa madrugada:

- Reproduzir com `dig` em dois resolvedores antes de mexer em qualquer coisa.
- Ler o registro SOA. O TTL negativo faz parte do contrato.
- Criar o registro **antes** da primeira requisição, não depois.

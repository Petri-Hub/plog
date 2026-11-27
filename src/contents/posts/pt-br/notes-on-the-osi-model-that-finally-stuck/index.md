---
title: 'Anotações sobre o modelo OSI que finalmente ficaram'
description: 'Sete camadas, e as duas ou três que importam quando algo quebra.'
date: '2024-03-15'
tags: ['networks', 'study']
highlighted: false
alternates:
  - 'en-us/notes-on-the-osi-model-that-finally-stuck'
  - 'pt-br/notes-on-the-osi-model-that-finally-stuck'
---

Decorei as sete camadas do modelo OSI três vezes, para três provas diferentes, e esqueci as três vezes. O que finalmente fez elas ficarem foi ignorar as definições e ligar cada camada a algo que eu de fato verifico quando uma rede quebra.

## As sete camadas, do jeito que eu uso

| Camada | Nome         | Um exemplo                     | O que eu verifico                |
| ------ | ------------ | ------------------------------ | -------------------------------- |
| 7      | Aplicação    | HTTP, DNS, SSH                 | O status code e os logs          |
| 6      | Apresentação | TLS, codificação de caracteres | Certificados e cadeias expiradas |
| 5      | Sessão       | Manter um login ativo          | Raramente alguma coisa sozinha   |
| 4      | Transporte   | Portas TCP e UDP               | A porta está aberta e escutando? |
| 3      | Rede         | Endereços IP, roteamento       | Responde ao `ping`? Existe rota? |
| 2      | Enlace       | Ethernet, endereços MAC        | Está na VLAN certa?              |
| 1      | Física       | Cabos, sinal do Wi-Fi          | A luz da porta está piscando?    |

Os protocolos reais não respeitam essas fronteiras. O TLS aparece em camadas diferentes dependendo de quem desenha, e o modelo TCP/IP, que é o que a internet de fato usa, junta as três de cima numa só. O modelo OSI é um mapa, não o território.

## As camadas que importam às 2 da manhã

Quando algo para de funcionar, eu vou de baixo para cima e paro na primeira camada que falha:

- **Camada 3:** a máquina responde ao `ping`, e o `ip route` sabe como chegar nela?
- **Camada 4:** tem algo escutando? O `ss -tlnp` no servidor responde numa linha.
- **Camada 7:** a aplicação responde, e o que ela diz?

A maioria dos meus problemas acabou sendo na camada 7, com uma exceção famosa que é sempre DNS.

> Você não precisa lembrar das camadas. Precisa lembrar de verificá-las em ordem.

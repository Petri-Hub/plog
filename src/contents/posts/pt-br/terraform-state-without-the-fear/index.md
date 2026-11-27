---
title: 'State do Terraform sem medo'
description: 'Backends remotos, locks e o dia em que importei um recurso na mão.'
date: '2025-08-20'
tags: ['terraform', 'infrastructure']
highlighted: false
alternates:
  - 'en-us/terraform-state-without-the-fear'
  - 'pt-br/terraform-state-without-the-fear'
---

No meu primeiro ano com Terraform, o arquivo de state era a coisa em que eu não mexia. Ele ficava ao lado do código, eu comitei sem querer uma vez, e toda mensagem que falava dele me deixava nervoso. Aí entendi o que ele é de verdade, e a maior parte do medo foi embora.

## Para que serve o state

Os seus arquivos `.tf` descrevem o que você **quer**. O state registra o que o Terraform **criou**: qual recurso real, com qual ID, pertence a qual bloco do seu código. Sem ele, o Terraform não teria como saber que `aws_s3_bucket.logs` é o bucket chamado `petri-lab-logs`, e não um novo que ele deveria criar.

É também por isso que perder o state assusta. Os recursos continuam lá, mas o Terraform esquece que são dele.

## Guarde num lugar compartilhado

Um `terraform.tfstate` local funciona até uma segunda pessoa, ou um job de CI, rodar `apply`. Um backend remoto mantém uma cópia só, e o lock garante que apenas uma execução a altere por vez. Desde o Terraform 1.10, o backend S3 consegue fazer lock com um arquivo ao lado do state, sem uma tabela separada no DynamoDB:

```hcl title="backend.tf"
terraform {
  backend "s3" {
    bucket       = "petri-terraform-state"
    key          = "lab/network.tfstate"
    region       = "sa-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
```

Ative o versionamento nesse bucket. É o botão de desfazer mais barato que você vai comprar.

## O dia em que importei um recurso na mão

Uma zona de DNS tinha sido criada pelo console anos atrás, e eu queria que o Terraform passasse a gerenciá-la sem recriar nada. Um bloco `import`, junto com `-generate-config-out`, escreve a configuração para você:

```hcl title="imports.tf"
import {
  to = aws_route53_zone.main
  id = "Z0123456789ABCDEFGHIJ"
}
```

```sh title="terminal"
$ terraform plan -generate-config-out=generated.tf
Plan: 1 to import, 0 to add, 0 to change, 0 to destroy.
```

Leia o arquivo gerado antes de confiar nele. O meu tinha alguns atributos que eu nunca definiria, e movi o resultado para o módulo certo na mão.

## Renomeando sem destruir

Mover um recurso para dentro de um módulo antes significava `terraform state mv`. Um bloco `moved` registra a mudança no código, para que todo mundo que rodar `plan` receba também:

```hcl title="moved.tf"
moved {
  from = aws_instance.web
  to   = module.web.aws_instance.this
}
```

> O plan é o contrato. Se ele diz _destroy_ e você não queria isso, pare ali.

Minhas regras hoje:

1. Todo state vive num bucket versionado, com lock ligado.
2. Ninguém edita um arquivo de state na mão. Blocos `import` e `moved` passam por revisão como qualquer outra mudança.
3. Leio duas vezes todo plan que diz _destroy_, em voz alta se for tarde.

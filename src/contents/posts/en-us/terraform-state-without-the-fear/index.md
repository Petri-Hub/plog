---
title: 'Terraform state without the fear'
description: 'Remote backends, locking and the day I imported a resource by hand.'
date: '2025-08-20'
tags: ['terraform', 'infrastructure']
highlighted: false
alternates:
  - 'en-us/terraform-state-without-the-fear'
  - 'pt-br/terraform-state-without-the-fear'
---

For my first year with Terraform, the state file was the thing I didn't touch. It sat next to my code, I committed it by accident once, and every message that mentioned it made me nervous. Then I learned what it actually is, and most of the fear went away.

## What the state is for

Your `.tf` files describe what you **want**. The state records what Terraform **made**: which real resource, with which ID, belongs to which block in your code. Without it, Terraform would have no way to know that `aws_s3_bucket.logs` is the bucket called `petri-lab-logs` and not a new one it should create.

That is also why losing the state is scary. The resources are still there, but Terraform forgets they are its own.

## Put it somewhere shared

A local `terraform.tfstate` works until a second person, or a CI job, runs `apply`. A remote backend keeps one copy, and locking makes sure only one run changes it at a time. Since Terraform 1.10, the S3 backend can lock with a file next to the state, without a separate DynamoDB table:

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

Turn on versioning in that bucket. It is the cheapest undo button you will ever buy.

## The day I imported a resource by hand

A DNS zone had been created in the console years ago, and I wanted Terraform to manage it without recreating it. An `import` block, together with `-generate-config-out`, writes the configuration for you:

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

Read the generated file before you trust it. Mine had a few attributes I would never set myself, and I moved the result into the right module by hand.

## Renaming without destroying

Moving a resource into a module used to mean `terraform state mv`. A `moved` block records the rename in code, so everyone who runs `plan` gets it too:

```hcl title="moved.tf"
moved {
  from = aws_instance.web
  to   = module.web.aws_instance.this
}
```

> The plan is the contract. If it says _destroy_ and you didn't mean it, stop there.

My rules now:

1. Every state lives in a versioned bucket with locking on.
2. Nobody edits a state file by hand. `import` and `moved` blocks go through review like any other change.
3. I read every plan that says _destroy_ twice, out loud if it's late.

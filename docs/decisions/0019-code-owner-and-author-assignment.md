# 0019. Petri owns the code, and pull requests are assigned to their author

- **Status:** Accepted
- **Date:** 2026-11-26

## Context

Every change arrives as a pull request that Petri approves (`AGENTS.md`), but none of the first 20 pull requests had an assignee, so GitHub's "assigned to me" filters showed nothing. GitHub also had no record that Petri owns the code: a pull request opened by a bot or another person would not ask him for a review.

## Decision

- `.github/CODEOWNERS` makes Petri the owner of every file, so GitHub requests his review on pull requests opened by anyone else.
- `.github/workflows/assignee.yml` runs [`toshimaru/auto-author-assign`](https://github.com/toshimaru/auto-author-assign) when a pull request is opened or reopened, and assigns it to its author.
- The pull requests opened before this decision were assigned by hand.

## Consequences

- GitHub never asks the author of a pull request to review it, so code ownership adds no review request to the pull requests Petri opens himself. Requiring a code owner's review in the `production` ruleset would block those pull requests, because no one can approve their own.
- The workflow uses `pull_request_target`, so it runs from `production` with a token that can edit pull requests. It never checks out the pull request's code, which is what keeps that token safe from changes in the pull request.
- Because it runs from `production`, the workflow starts assigning only after this decision is merged.

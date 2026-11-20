---
title: "Slimming down RSpec specs"
slug: slimming-down-rspec-specs
date: 2026-12-03
author: "Nicolas Rouanne"
cover: "conventions-en.png"
excerpt: "Parallelizing RSpec cut the wait, not the work. Five spec conventions make the same suite run 45% faster, and one measurement showed where the real cost was: the factory."
---

At one of our clients, [parallelizing RSpec](/en/blog/parallelizing-rspec-on-github-actions) took a PR's CI from 10 minutes to less than 5. But the suite still does the same work, just spread over 6 processes. For it to do less, the specs have to do less.

One PR set five conventions:

- an expensive setup shared by a single `:aggregate_failures` example;
- only create the records under test;
- factories without cascades of records;
- `build_stubbed` when the spec never reads the database;
- remove examples that prove nothing more than their neighbour.

![Suite duration on the same machine: main's specs, the PR's, then main's](conventions-en.png "The two main passes frame the measurement: 1% apart.")

## Too big to review

The PR touched 641 files. We had agents audit it, in passes, until nothing was left:

![Confirmed problems per audit pass](audit-en.png "Each fix is checked by breaking the code: the spec must turn red.")

Human review still found tests that were green for the wrong reason: a `build_stubbed` user has no roles, so an access denial always passed. And one measurement showed that `build_stubbed` wasn't the real gain:

![Time to create an admin user, by method](factory-en.png "The factory gave every user an account, even admins, who have none in production.")

## One rule at a time

So we apply the conventions one rule at a time: one PR per rule, reviewed in a few minutes. A rule that can be checked automatically becomes a RuboCop rule; the others go into the agents' knowledge, in plain sentences. And test users are created as in production.

The parallelization won't have to change: on the slimmed-down suite, the same bench also picked 3 jobs of 2 processes.

> [!NOTE]
> `ubuntu-latest` runners land on different CPUs, and the same suite can take from 477 to 730 s. So versions of the suite are compared on a single machine, one after the other. We also track in PostHog the sum of each spec file's duration, which goes up when we add specs, not when we add jobs (see [Tracking a team's tech OKRs in PostHog](/en/blog/tracking-a-team-s-tech-okrs-in-posthog-straight-from-github-actions)).

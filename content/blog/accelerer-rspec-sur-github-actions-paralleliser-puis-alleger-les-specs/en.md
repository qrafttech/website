---
title: "Speeding up RSpec on GitHub Actions: parallelize, then slim down the specs"
slug: speeding-up-rspec-on-github-actions-parallelize-then-slim-down-the-specs
author: "Nicolas Rouanne"
excerpt: "The RSpec suite of one of our products took 11 minutes per PR. Split across 3 jobs of 2 processes, it takes 4, for 2 more billed minutes. And the spec conventions in progress cut it by another 45%."
---

In [Running only the changed project's tests](/en/blog/running-only-the-changed-project-s-tests-without-losing-required-checks), we stopped running RSpec on PRs that don't touch the Rails API. But three quarters of PRs do touch it, and for them nothing changed: RSpec ran in a single job, and the required check finished after about 11 minutes.

We did two things. Splitting the suite across several runners is merged. Writing specs that cost less is in progress.

## Measuring on a single machine

`ubuntu-latest` runners don't always land on the same CPU: during our measurements, GitHub handed us 7 different models. The same suite can take 477 s on one run and 730 s on the next. Comparing two CI runs doesn't tell you much.

To compare two versions of the suite, we run them in the same job, one after the other, with the database reset between passes, and we run the reference at the start and at the end. If the two reference passes are close, the machine didn't change during the measurement. To compare CI configurations, we do 10 runs of each, and only compare runs that landed on the same CPU.

## Parallelizing: 3 jobs of 2 processes

We use [`parallel_tests`](https://github.com/grosser/parallel_tests). It splits the suite into groups of files and runs one process per group. Each process gets its own test database, through `TEST_ENV_NUMBER` in `database.yml`, and its own Redis database:

```yaml
test:
  url: <%= ENV.fetch('TEST_DATABASE_URL') %><%= ENV['TEST_ENV_NUMBER'] %>
```

A standard GitHub runner has 2 vCPUs, so we run 2 processes per job. The suite is cut into 6 groups, and each job of the matrix takes 2:

```yaml
strategy:
  fail-fast: false
  matrix:
    groups: ["1,2", "3,4", "5,6"]
steps:
  # ...
  - name: Prepare database
    run: |
      bin/rails db:schema:load
      psql "$POSTGRES_URL" -c "CREATE DATABASE app_test2 TEMPLATE app_test"

  - name: Run RSpec
    run: |
      bundle exec parallel_rspec -n 6 --only-group ${{ matrix.groups }} \
        --group-by ${{ inputs.runtime-log-run && 'runtime' || 'filesize' }} \
        --test-options '--format progress --format ParallelTests::RSpec::RuntimeLogger --out tmp/parallel_runtime_rspec.log' \
        spec
```

The second database is cloned from the first with `TEMPLATE`, so the schema is only loaded once.

### Balanced groups, split the same way everywhere

For the 6 groups to take about the same time, `parallel_tests` needs the duration of each file. Every run on `main` publishes that log as an artifact, and PRs split the suite with the log of the last green run on `main`. Without a log (first run, expired artifact), the split goes by file size.

The 3 jobs must read the same log: if two jobs split differently, some files run nowhere, others run twice, and CI stays green. In the first version, each job looked up the log itself, and they could diverge: the lookup read the last 100 artifacts across all branches, and a PR publishing its own between the start of two jobs shifted the list.

The lookup now happens once, in the `changes` job that already runs before the tests to find which projects changed. It passes the run id to the 3 jobs, which all download that run:

```yaml
- name: Find main's RSpec runtime log
  id: runtime-log
  env:
    GH_TOKEN: ${{ github.token }}
  run: |
    echo "run=$(gh api "repos/$GITHUB_REPOSITORY/actions/artifacts?name=rspec-runtime-log&per_page=100" \
      -q '[.artifacts[] | select(.workflow_run.head_branch == "main" and (.expired | not))] | max_by(.created_at) | .workflow_run.id // empty')" >> "$GITHUB_OUTPUT"
```

Only `main` publishes its log. On the test side, an `actions/download-artifact` step with `run-id` fetches that exact run.

### The required check stays the same

The `main` ruleset requires an `RSpec Tests` check. We kept it: it's a small job that waits for the 3 matrix jobs, fails if one of them failed, merges the coverage of the 6 processes and, on `main`, publishes the runtime log. The ruleset didn't change.

### How many jobs?

More jobs means a shorter wait, but it isn't free. GitHub bills each job rounded up to the minute, and each job pays its setup (Ruby, gems, Python, test database), about 50 s here. We measured 8 configurations, 10 runs each, on the `main` suite:

| Config | Slowest job (median) | Billed minutes |
|---|---:|---:|
| 1 job | 651 s | 11 |
| 2 jobs × 2 processes | 321 s | 11.5 |
| **3 jobs × 2 processes** | **226 s** | **13** |
| 4 jobs × 1 process | 232 s | 16 |
| 4 jobs × 2 processes | 198 s | 14.5 |
| 5 jobs × 2 processes | 173 s | 15 |
| 6 jobs × 2 processes | 150 s | 18 |
| 8 jobs × 2 processes | 138 s | 19 |

We set ourselves a rule: add a job as long as each extra billed minute saves at least 20 s of waiting. Going from 2 × 2 to 3 × 2 saves 95 s for 1.5 more minutes. Going to 4 × 2 only saves 28 s for 1.5 more minutes, so we stop at 3 × 2.

Two things stand out in the table. One process per job is a bad deal: 4 × 1 is slower and more expensive than 3 × 2, because each runner's second vCPU sits idle. And beyond 3 jobs, rounding to the minute comes down to a few seconds: on a real 5 × 2 run, some jobs finished just past the 3-minute mark, and the run was billed 18 minutes instead of the bench's 15.

### What it gives

Over the first 10 runs since the merge, the slowest RSpec job finished between 213 and 274 s. The required check now finishes around 4 minutes 30 instead of 11, for 2 more billed minutes per run, about ten dollars a month at our pace.

Two flaky tests already existed on `main`, and `parallel_tests` made them more frequent. One generated a random password that sometimes contained the user's first name, which validation rejects. The other expected an external id to change, but the factory copied that id from the account id: when the account came out with the id the test picked, nothing changed. With one database per process, ids stay low, and it happens more often. Both are fixed.

## Slimming down the specs

Parallelizing cuts the wait, not the work: the sum of each file's duration doesn't move. For that, the specs have to do less. One PR wrote conventions and applied them to the whole suite:

- an expensive setup is shared by a single `:aggregate_failures` example, instead of being replayed by each one-line `it`;
- a spec only creates the records it tests;
- factories no longer create cascades of records by default;
- `build_stubbed` instead of `create` when the spec never reads the database;
- examples that prove nothing more than their neighbour are removed (a 200 status next to an assertion on the response body, for instance).

Measured on a single machine, the suite goes from 489 s to 268 s: −45%, with 1% between the two reference passes.

### Too big to review

The PR touched 641 files, +8,062 / −7,411 lines. To check that no proof had been lost, agents audited it in successive passes. Each finding had to name a change to the code that leaves the spec green, three other agents tried to refute it, and each fix was checked by breaking the code and watching the spec turn red. 10, then 9, then 5 confirmed problems, then 0.

Human review still found things: a `build_stubbed` user has no roles, so a policy that denies access stayed green for the wrong reason; and 41 contexts checked that a record "is not found" against an empty table, 40 of which already existed on `main`. And one measurement changed how we read one of the rules. Over 200 creations, `build_stubbed(:admin_user)` takes 1.9 ms, `create(:admin_user)` without an account 7 ms, and `create(:admin_user)` 15.5 ms. The 115 users switched to `build_stubbed` save less than a second on the whole suite. What cost time was the factory: it gave an account to every user, admins included, while in production an admin has none.

So we closed the PR without merging it, and we're taking it another way:

- one PR per rule, starting with the simplest, so each one can be reviewed in a few minutes;
- when a rule can be checked automatically, it becomes a RuboCop rule; otherwise it goes into the agents' knowledge, written simply;
- test users are created as in production: clients with an account, admins without.

Nothing is merged on that side yet. The 3 × 2 split won't have to change: on the slimmed-down suite, the same bench also picked 3 × 2 (150 s).

## Tracking the suite's duration

We already send CI durations to PostHog (see [Tracking a team's tech OKRs in PostHog](/en/blog/tracking-a-team-s-tech-okrs-in-posthog-straight-from-github-actions)). With parallel jobs, the check's duration no longer tells you whether the suite is growing. So on every green run on `main`, we also send the sum of each spec file's duration: it goes up when we add specs, not when we add jobs. Along with it, the gap between the fastest and the slowest job, to see if the split degrades, and the billed minutes per check.

---
title: "Slimming down RSpec specs"
slug: slimming-down-rspec-specs
date: 2026-12-03
author: "Nicolas Rouanne"
cover: "conventions-en.png"
excerpt: "Parallelizing RSpec cut the wait, not the work. Four spec conventions, measured one by one, make the same suite run 45% faster. The most profitable one is in the factories: one record too many is paid for in every example that uses it."
---

At one of our clients, [parallelizing RSpec](/en/blog/parallelizing-rspec-on-github-actions) took a PR's CI from 10 minutes to less than 5. But the suite still does the same work, just spread over 6 processes. For it to do less, the specs have to do less.

We applied four conventions. Each one was first measured alone, on a single machine: the original suite, then the suite with the convention, one after the other. Together, the suite goes from 489 to 268 s:

![Suite duration on the same machine, before and with the conventions](conventions-en.png "From 489 to 268 s, on the same machine.")

## One example per expensive setup

Every `it` replays the `before` and `let` blocks above it. When that setup imports a file, clones a survey or generates data, seven one-line `it`s make seven imports:

```ruby
describe 'after running' do
  before { result }

  it { expect(result.success).to be true }
  it { expect(created_survey).to have_attributes(name: 'Imported Survey', status: 'complete') }
  it { expect(created_survey.owner).to eq(owner) }
  it { expect(blob).to have_received(:purge_later) }
  # … and three more
end
```

We group them into a single example, named after what it proves:

```ruby
it 'creates the survey and purges the upload', :aggregate_failures do
  expect(result.success).to be true
  expect(created_survey).to have_attributes(name: 'Imported Survey', status: 'complete')
  expect(created_survey.owner).to eq(owner)
  expect(blob).to have_received(:purge_later)
end
```

With [`:aggregate_failures`](https://rspec.info/blog/2015/06/rspec-3-3-has-been-released/), the example doesn't stop at the first failing `expect`: it runs them all and reports every failure, as the seven examples did.

Applied to 28 files, this takes the suite from 7,650 to 7,231 examples, and from 666 to 558 s (−16%). The gain is concentrated in the specs that clone or generate data: 22 s for a single file.

## `build_stubbed` when the spec never reads the database

A policy that decides based on the user's type doesn't need records in the database. `build_stubbed` builds the object with an id, without an `INSERT`:

```ruby
let(:account) { build_stubbed(:account) }
let(:chart_template) { build_stubbed(:chart_template, master_report: build_stubbed(:master_report, account:)) }
let(:user) { build_stubbed(:admin_user) }

it { expect(described_class.new(user, chart_template).update?).to be false }
```

The gain is small. [FactoryDoctor](https://test-prof.evilmartians.io/guide/profilers/factory_doctor) put everything the suite created in the database without ever reading it at 29.8 s; switching 19 files to `build_stubbed` saves around 1%.

## Factories without cascades

This is where the measurement said the most. Here's what a `create(:survey)` created:

```ruby
factory :survey do
  account                            # an account, with its mailing_account
  association :owner, factory: :user # a user…
end

factory :user do
  transient do
    accounts { [build(:account)] }   # …with another account, and another mailing_account
    account_role_key { 'client_edit' }
  end

  after(:create) do |user, evaluator|
    evaluator.accounts.each do |account|
      account.save!
      role = Role.find_by(key: evaluator.account_role_key) || begin
        Rbac::SyncCatalog.call       # reloads the whole role catalog
        Role.find_by!(key: evaluator.account_role_key)
      end
      user.user_roles.create!(role:, roleable: account)
    end
  end
end
```

Each example runs in a transaction that is rolled back at the end, roles included. So the role never existed at the start of an example: every example that created a survey reloaded the whole role catalog, for the account of an owner the specs almost never read.

A factory default is paid for in every spec that uses the factory, and in every factory that associates it. Here, 5,540 `mailing_account`s were created, for 18 read.

The fix: the owner no longer has an account, `mailing_account` becomes a trait you ask for, and child records reuse their parent's survey instead of creating another one.

```ruby
factory :survey do
  account
  owner { association :user, accounts: [] }
end

factory :account do
  trait :with_mailing_account do
    mailing_account
  end
end
```

Alone, this convention takes the suite from 699 to 574 s (−18%): 38,134 records created instead of 44,135, and the `survey` factory goes from 148 to 40 s over the whole suite. But most of that came from the reloaded catalog, which we also fixed separately, in one line: `config.before(:suite) { Rbac::SyncCatalog.call }`, −27% on its own. Once the catalog is loaded only once, the cascades' own share is estimated at about 3%.

The same default remained on staff users: the factory gave every user an account, even admins, who have none in production (their access comes from their type). That account cost more than everything `build_stubbed` saved:

![Time to create an admin user, by method](factory-en.png "The account the factory added more than doubles the creation time.")

Staff user factories no longer have an account by default; a spec that needs one passes it.

## Only create the records under test

Some specs created much more data than they checked.

For example, an import consumes credits: 1 credit per block of 1,000 respondents, rounded up. To check that rounding, you have to go past a block, so the spec imported 1,500 respondents and checked that it cost 2 credits. But what we test is the rounding, not the volume. For the duration of the spec, we bring the block down to 2 respondents with `stub_const`: 3 respondents give the same rounding to 2 credits.

```ruby
# before
let(:respondent_count) { 1500 }
let(:questions) { [build_parsed_question(cell_values: Array.new(1500, 'a'))] }

# after: 2 respondents per credit, same rounding, 3 rows instead of 1,500
let(:respondent_count) { 3 }
let(:questions) { [build_parsed_question(cell_values: %w[a a a])] }
before { stub_const('Credits::Recalculate::Quantitative::RESPONDENTS_PER_BUCKET', 2) }
```

Same idea elsewhere: a report created 20 respondents per profile, when 4 are enough to check what it computes.

Across the 4 files involved, this saves about 42 s, 25 s of it for the report and 10 s for the import. It's the smallest gain of the four. It's even smaller than the gap between two measurements of the same code (50 to 100 s): you only see it by measuring file by file.

## One rule at a time

We now apply these conventions one rule at a time: one PR per rule, reviewed in a few minutes. A rule that can be checked automatically becomes a RuboCop rule; the others go into the agents' knowledge, in plain sentences.

The parallelization won't have to change: on the slimmed-down suite, the same bench also picked 3 jobs of 2 processes.

> [!NOTE]
> `ubuntu-latest` runners land on different CPUs, and the same suite can take from 477 to 730 s. So versions of the suite are compared on a single machine, one after the other. We also track in PostHog the sum of each spec file's duration, which goes up when we add specs, not when we add jobs (see [Tracking a team's tech OKRs in PostHog](/en/blog/tracking-a-team-s-tech-okrs-in-posthog-straight-from-github-actions)).

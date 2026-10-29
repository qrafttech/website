---
title: "With AI, humans stay responsible for what they produce"
slug: with-ai-humans-stay-responsible-for-what-they-produce
date: 2026-11-16
author: "Nicolas Rouanne"
---

At the end of October, at one of the companies we work with, a member of the leadership team posted this message to the whole company. They had just launched an "AI first" plan, and in the managers' meeting, several people had noticed that on some topics, quality had dropped.

![Slack message (in French) from a member of the leadership team, names hidden](message.jpg "“when producing with AI, we remain 100% responsible for the quality of what we produce”")

The example is telling: the average length of steering committee notes had been multiplied by 4 in 3 months. And the conclusion is unambiguous: "it's up to the person who produces to exercise their critical thinking, not the recipients". I shared it with the Qraft team, because it concerns all of us, me included.

The same day, I ran into the same question on the tech side, in another form: not a text that was too long, but decisions made by an agent.

## A night of agents on the CI

On the same product, the API test suite (RSpec, 7,650 examples) had gone from 94 seconds at the end of May to about 12 minutes. Someone on the team let Claude Code work on it overnight: one pilot PR per idea, and in each PR a bench that compares the PR to `main` in the same run. In the morning, there were 11 PRs and a table of 16 ideas, with a verdict for each: ✅, 🟡 or ❌.

![GitHub: 11 pilot PRs opened overnight, author hidden](prs.jpg "The 11 pilot PRs, one per idea")

![Tokens per sub-agent (in French), author hidden](tokens.jpg "About 6 hours, 540k output tokens, 111M read from cache")

It was a working note, a starting point, and the work is solid. It showed that the suite's run time varied by up to 50% depending on the runner's CPU model, and it found the biggest cause of the slowdown: a factory callback that re-synced the permissions catalog in every example. One line in `before(:suite)`, and RSpec drops by 25 to 35%.

That left the verdicts, and that's where the responsibility comes back to the team. Three leads came back 🟡: avoiding cascading factories, creating only the records under test, `build_stubbed` instead of `create`. "~1%", "under the noise". On that day's measurement, that's right. But these three change how tests are written, and every new test benefits: we decided to dig into them anyway. My impression is that Claude sometimes stops at the beginning of an idea, and judges it on that beginning.

![Slack thread (in French), names hidden](thread.jpg "“each idea has to be checked separately, even if Claude judged it not interesting for now”")

In the thread, we agreed to check each idea separately, including the ones Claude set aside. On the overnight session itself, though, we don't see it the same way. On my side, reviewing and fixing that much work seems longer than supervising it as it goes. On the other, the parallelization benchmarks alone took 5 of the 6 hours, machine time nobody would have spent watching.

Next: merge the two big wins, then re-measure the three 🟡 leads on top of them, one by one.

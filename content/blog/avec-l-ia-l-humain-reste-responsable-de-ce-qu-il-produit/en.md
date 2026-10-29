---
title: "With AI, humans stay responsible for what they produce"
slug: with-ai-humans-stay-responsible-for-what-they-produce
date: 2026-11-16
author: "Nicolas Rouanne"
---

At the end of October, at one of the companies we work with, a member of the leadership team posted this message to the whole company.

![Slack message (in French) from a member of the leadership team, names hidden](message.jpg "“when producing with AI, we remain 100% responsible for the quality of what we produce”")

The company had just launched an "AI first" plan, and on some topics, quality had dropped, enough for it to come up in the managers' meeting. One figure sums it up: the average length of steering committee notes had been multiplied by 4 in 3 months.

I shared it with the Qraft team the next morning, because I think it concerns all of us, with my own take:

> On my side, there's no way I'm spending more time reading AI-generated things that are 10,000-word slop when the author could have made it simpler / shorter / more relevant. Writing is easy, reading is hard, the work has to be done on the author's side.

## When I code

It's the same with code. A good part of what I ship today is written by Claude Code. But it's my code: my name is on the PR, and if it breaks, I'm the one who answers for it. So my review follows roughly the same order every time.

The direction first. Before reading the details, I look at the structure: routes, resources, contracts, names. If the architecture has to change, the bugs don't matter yet: fixing code that's about to be restructured means doing the review twice.

Then I challenge. Short questions, one at a time: "what's the builder?", "why both?". And one I ask on almost every PR: what could we have removed? An abstraction "just in case", an interface nobody uses yet, a field that duplicates data we already have: that's what slips through most easily when nobody reads.

Then I give directions. I don't fix it line by line: I say where to go, for example "this route belongs under the real resource, not in a separate endpoint", and Claude redoes it. Bugs come only after that, once the shape is right.

This article was written with Claude too. I turned down two versions before this one, and it's my name at the top.

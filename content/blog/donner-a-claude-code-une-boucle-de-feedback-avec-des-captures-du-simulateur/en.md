---
title: "Giving Claude Code a feedback loop with simulator screenshots"
slug: giving-claude-code-a-feedback-loop-with-simulator-screenshots
date: 2026-01-27
author: "Nicolas Rouanne"
---

When Claude Code runs commands, it sees text output. But when working on a mobile app, text isn't enough - you need to see the screen.

The idea: use `xcrun simctl io booted screenshot` to capture the simulator, then let Claude read the image. Now it has a feedback loop.

## Setup

```bash
# Boot simulator
xcrun simctl boot "iPhone 17 Pro" && open -a Simulator

# Take screenshot
xcrun simctl io booted screenshot /tmp/screen.png
```

Claude can read image files, so it can see what's on screen and adjust accordingly.

## What works

- Claude sees the current UI state
- It can identify elements ("I see a login form with phone and password fields")
- It can verify if an action worked by comparing before/after screenshots

## What doesn't work yet

- No easy way to tap or type in the simulator from CLI
- `xcrun simctl` lacks touch input commands
- Would need Appium or similar for actual interaction

## Practical use

For now it's useful for:

- Verifying UI state after running commands
- Debugging layout issues
- Generating documentation screenshots

Not a replacement for E2E testing, but a simple way to give Claude eyes on the app.

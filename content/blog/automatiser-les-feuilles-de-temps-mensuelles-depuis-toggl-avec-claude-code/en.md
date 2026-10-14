---
title: "Automating monthly timesheets from Toggl with Claude Code"
slug: automating-monthly-timesheets-from-toggl-with-claude-code
date: 2026-03-04
author: "Nicolas Rouanne"
---

I wanted to generate a monthly timesheet from Toggl — one that shows, per day, how many half-days I worked for each client. Simple enough on the surface. The tricky part turned out to be the rounding.

## The goal

The output I wanted: a table where each row is a workday, each column is a client, and each cell is a value in multiples of 0.5 days. A work day is 5h30m. So 4h on one client and 2h on another should produce something like `0.5 + 0.5 = 1.0 day`, not `1.0 + 0.5 = 1.5 days`.

The data comes from the Toggl API. Claude Code handles the fetching, mapping project IDs to clients, and running the calculation script.

## First attempt: per-client carry-forward

The naive approach — rounding each client's hours independently to the nearest 0.5 — loses data. A client with 1h10m tracked rounds to 0 on that day, and you never get that time back.

The fix I tried first was a carry-forward per client: instead of rounding each day independently, round the _cumulative total_ for each client. The leftover fraction rolls into the next day.

```python
def round_half(x):
    return math.floor(x * 2 + 0.5) / 2

for day in all_days:
    for client in all_clients:
        client_running[c] += raw_today[c]
        new_total = round_half(client_running[c])
        day_alloc[c] = new_total - client_assigned[c]
        client_assigned[c] = new_total
```

This works well for monthly totals. But it has a subtle bug when multiple clients share a day.

## The problem: daily totals inflate

On February 5th, I tracked 7h42m across three clients: Episto (4h34m), SAMM (2h21m), and Qraft (44m). That's 1.40 real workdays.

With per-client carry-forward, each client had accumulated debt from previous days, and all three got a rounding bump on the same day:

| **Client** | **Raw today** | **Rounded** |
| --- | --- | --- |
| Episto | 0.83d | 1.0 |
| SAMM | 0.43d | 0.5 |
| Qraft | 0.13d | 0.5 |
| **Total** | **1.40d** | **2.0** ❌ |

7h42m showing as 2 workdays is wrong. The per-client carry-forwards are independent — they don't know about each other.

## The fix: two-level carry-forward

The solution is to run two carry-forwards in parallel.

**1. Day-level carry-forward** — determines how many 0.5-slots the day earns in total, based on real hours worked:

```python
day_running += total_day_secs / DAY_SECS
day_value    = round_half(day_running) - day_assigned  # e.g. 1.5 for 7h42
slots        = int(day_value * 2)                       # e.g. 3 slots
```

**2. Client debt tracking** — decides which clients get the slots. Clients with the most uncompensated hours (raw accumulated minus hours already credited) have priority:

```python
client_running[c] += raw_today[c]  # never rounded

for _ in range(slots):
    best = max(active_clients, key=lambda c: client_running[c] - client_assigned[c])
    day_alloc[best] += 0.5
    client_assigned[best] += 0.5
```

For February 5th with 3 slots:

| **Client** | **Debt** | **Gets** |
| --- | --- | --- |
| Episto | highest → slot 1 + slot 2 | **1.0** |
| SAMM | 2nd → slot 3 | **0.5** |
| Qraft | lowest | **0.0** |
| **Total** |  | **1.5** ✅ |

## What works

Day totals are now bounded by the actual hours worked. A 7h42m day produces at most 1.5 days. Monthly totals converge correctly — the debt tracking ensures no hours are permanently lost, they just shift to the next day where that client has the highest outstanding balance.

## The tradeoff

The two carry-forwards can't both be perfect simultaneously. If three clients share a day but the day only earns 1.0 day of slots, one client gets nothing that day even if they have meaningful debt. Their hours roll to the next day they appear.

In practice over a full month, the per-client error stays within ±0.5 days. That's acceptable for billing purposes — it's the same precision you'd get from manual half-day estimates.

## Practical takeaway

The script is a standalone Python file invoked by a Claude Code skill:

```bash
python3 ~/dev/claude/scripts/toggl_calendar.py 2026-01
python3 ~/dev/claude/scripts/toggl_calendar.py 2026-01 2026-02
```

The skill also handles classifying untagged entries, capping overnight timers, and bulk-updating projects via the Toggl API — all things I'd previously do manually in the Toggl web UI.

The rounding algorithm itself is about 20 lines. The interesting part was realizing that rounding is a 2D problem when you have multiple clients per day, not a 1D one.

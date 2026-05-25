# Mobile Rules Card Layout

**Date:** 2026-05-25

## Problem

The rules table in `ProfilesComponent` has four columns: checkbox, name, time, and
actions (two–three icon buttons). On mobile portrait (<576 px) these columns are too
wide to fit without squishing, causing horizontal overflow. Reducing cell padding to
1 px (already done) is not sufficient.

## Solution

Add a **card-per-rule** rendering mode that is shown only on xs screens (<576 px).
The existing table remains unchanged and is shown on sm+ screens. Both modes read
from the same `profile.rules` array and call the same component methods — no new
component or data duplication.

Bootstrap display utilities control which mode is active:
- Table wrapper: `d-none d-sm-table`
- Card list wrapper: `d-sm-none`

## Card Layout

Each rule renders as a card with three rows:

```
┌────────────────────────────────────┐
│  ☐  Rule name                      │
│     06:00–07:00  60min  co 3 dni   │
│                          [▶]  [✎]  │
└────────────────────────────────────┘
```

- **Row 1:** `mat-checkbox` (isActive) + rule name
- **Row 2:** time range (`toTime(startTime)–toTime(endTime)`), duration
  (`calculateTimeDiff(rule) min`), and interval (`co N dni`) if `dayInterval >= 2`
- **Row 3:** right-aligned play/stop icon button + edit icon button (same handlers as
  the table: `setManualOn`, `setManualOff`, `openEditRuleModal`)

Cards are separated by a subtle border/divider. Bootstrap utilities handle padding and
flex alignment.

## Files Changed

| File | Change |
|---|---|
| `profiles.component.html` | Add `d-none d-sm-table` to table wrapper; add `d-sm-none` card list block |
| `profiles.component.scss` | Add `.rule-card` style (border, padding, spacing between cards) |

## Out of Scope

- The "Dodaj regułę" button and the profile header row are not affected.
- No changes to component TypeScript, stores, or API.
- Tablet and desktop layout is unchanged.

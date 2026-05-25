# CLAUDE.md

## Commands

```bash
npm run build
```

## Architecture

**State:** `SprinklersStore` and `ProfilesStore` (both `providedIn: 'root'`) hold state in a `BehaviorSubject`. Components subscribe to `items$` and call store methods rather than `ApiService` directly.

**Routes:** `/` → `ProfilesComponent` (profiles + rules), `/settings` → `SettingsComponent` (sprinkler hardware config).

**Time:** Backend uses seconds since midnight (integers). `src/app/shared/time-helper.ts` converts between that and `HH:MM` strings used in forms.

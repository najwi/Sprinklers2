# CLAUDE.md

## Commands

```bash
npm run build
```

## Architecture

**State:** `SprinklersStore` and `ProfilesStore` (both `providedIn: 'root'`) hold state in a `BehaviorSubject`. Components subscribe to `items$` and call store methods rather than `ApiService` directly.

**Routes:** `/` → `ProfilesComponent` (profiles + rules), `/settings` → `SettingsComponent` (sprinkler hardware config).

**Time:** Backend uses seconds since midnight (integers). `src/app/shared/time-helper.ts` converts between that and `HH:MM` strings used in forms.

**Adding a Rule field:** Touch `profiles.dto.ts` (interface), `rule-modal.component.ts` (FormField enum + fb.control + save()), `rule-modal.component.html` (input), `profiles.component.html` (list display × 2: desktop table + mobile card), and `api_mock/server.js` (mock seed data).

**Dev mock:** Start mock with `node ../api_mock/server.js`, then `ng serve --proxy-config ../api_mock/proxy.conf.json`. Mock runs on port 3000.

**Reactive forms — disabled controls:** Read via `this.form.get(field)!.value` directly (not `this.form.value`, which omits disabled controls).

# SPIKE Neuro-symbolic AI Workshop Site

Single-page site for the SPIKE research group workshop. Built with [Astro](https://astro.build) + Tailwind CSS and deployed on Netlify.

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Updating content

All workshop content lives in a single file:

**`src/data/workshop.json`**

### Change the date, location, or intro text

Edit the top-level fields:

```json
{
  "title": "Neuro-symbolic AI Workshop",
  "subtitle": "SPIKE Research Group — Imperial College London",
  "date": "Friday 13th March 2026",
  "location": "Location TBC",
  "intro": "A one-day workshop bringing together..."
}
```

### Update the schedule

Each entry in the `schedule` array has:

| Field       | Required | Description                                    |
|-------------|----------|------------------------------------------------|
| `time`      | yes      | Display time, e.g. `"09:30"`                   |
| `title`     | yes      | Event name                                     |
| `type`      | yes      | `"break"`, `"talk"`, or `"session"`            |
| `speaker`   | no       | Speaker name (use `"TBC"` as placeholder)      |
| `slides`    | no       | URL to slides PDF, or `null` if not yet available |
| `recording` | no       | URL to recording, or `null` if not yet available  |

Example — adding a new talk:

```json
{ "time": "09:45", "title": "My Talk Title", "speaker": "Dr. Jane Smith", "type": "talk", "slides": null, "recording": null }
```

The schedule uses colour-coded vertical bars to distinguish event types: red for talks, blue for sessions, and sand for breaks.

### Update speakers

The `speakers` array controls the Speakers section with profile photos:

| Field   | Required | Description                                      |
|---------|----------|--------------------------------------------------|
| `name`  | yes      | Full name, e.g. `"Prof. Alessandra Russo"`       |
| `role`  | yes      | Position, e.g. `"Principal Investigator"`        |
| `photo` | yes      | Path to photo in `public/speakers/`, e.g. `"/speakers/arusso.jpg"` |

Example — adding a new speaker:

```json
{ "name": "Dr. Jane Smith", "role": "Post-Doctoral Researcher", "photo": "/speakers/jsmith.jpg" }
```

Place the speaker's photo (square crop works best) in `public/speakers/`. Photos are displayed as circular cutouts with a subtle grayscale effect that lifts on hover.

TBC speakers in the schedule (those with `"speaker": "TBC"`) are counted and shown as "+N speakers to be confirmed".

### Update logos

Replace the files in `public/`:

- `public/spike-logo.svg` — SPIKE logo (used in nav + footer)
- `public/imperial-logo.svg` — Imperial College logo (footer)

## Deployment

Pushes to `main` auto-deploy via Netlify. The `netlify.toml` is already configured.

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
| `abstract`  | no       | Talk abstract text, or `null` if not yet available |
| `slides`    | no       | URL to slides PDF, or `null` if not yet available |
| `recording` | no       | URL to recording, or `null` if not yet available  |

Example — adding a new talk:

```json
{ "time": "09:45", "title": "My Talk Title", "speaker": "Dr. Jane Smith", "type": "talk", "abstract": "A brief description of the talk.", "slides": null, "recording": null }
```

The schedule uses colour-coded vertical bars to distinguish event types: red for talks, blue for sessions, and sand for breaks. Talks with an abstract, slides, or recording are expandable — click the row to reveal details.

### Update speakers

The `speakers` array controls the Speakers section with profile photos:

| Field   | Required | Description                                      |
|---------|----------|--------------------------------------------------|
| `name`  | yes      | Full name, e.g. `"Prof. Alessandra Russo"`       |
| `role`  | yes      | Position, e.g. `"Principal Investigator"`        |
| `photo` | yes      | Path to photo in `public/speakers/`, e.g. `"/speakers/arusso.jpg"` |
| `url`   | no       | URL to personal page, or `null` if not available |
| `talk`  | no       | Talk title from the schedule, or `null` if TBC   |

Example — adding a new speaker:

```json
{ "name": "Dr. Jane Smith", "role": "Post-Doctoral Researcher", "photo": "/speakers/jsmith.jpg", "url": "https://example.com", "talk": "My Talk Title" }
```

Place the speaker's photo (square crop works best) in `public/speakers/`. Photos are displayed as circular cutouts with a subtle grayscale effect that lifts on hover. Speaker names with a `url` link out to their personal page. Confirmed speaker names in the schedule link down to the speakers section.

### Update logos

Replace the files in `public/`:

- `public/spike-logo.svg` — SPIKE logo (used in nav + footer)
- `public/imperial-logo.svg` — Imperial College logo (footer)

## Deployment

Pushes to `main` auto-deploy via Netlify. The `netlify.toml` is already configured.

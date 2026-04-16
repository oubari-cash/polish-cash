# Polish-Cash Setup

This guide wires the polish-cash dashboard to a GitHub repo so merged fixes
appear on the feed automatically.

## 1. Deploy the app

Deploy anywhere Node 18+ runs. The app uses SQLite (`polish-cash.db` in the
repo root). If your host has ephemeral storage (most serverless platforms,
Fly/Render free tiers, container rebuilds), mount a persistent volume at the
app root or switch to a hosted SQLite/Postgres before putting this in front
of real traffic.

```bash
npm install
npm run db:push    # apply the drizzle schema
npm run build
npm start
```

## 2. Environment variables

Set these in your hosting platform:

| Name | Required | Purpose |
| --- | --- | --- |
| `GITHUB_WEBHOOK_SECRET` | yes | Random string; identical value pasted into GitHub when you create the webhook. |
| `GITHUB_TOKEN` | yes | Fine-grained PAT or GitHub App token. Scopes: `contents: read`, `pull_requests: read` on the target repo. Used to list PR files and fetch private-repo raw images. |
| `LINEAR_API_KEY` | optional | Enables team/title enrichment from a `DQA-123` ticket reference in the PR body. If unset, the dashboard still works, just without enrichment. |
| `POLISH_CASH_LABEL` | optional | Overrides the label the webhook filters on. Defaults to `polish-cash`. |

## 3. Create the GitHub webhook

In the target repo, go to **Settings -> Webhooks -> Add webhook**:

- Payload URL: `https://<your-host>/api/webhooks/github`
- Content type: `application/json`
- Secret: same value as `GITHUB_WEBHOOK_SECRET`
- Which events: **Let me select individual events** -> check **Pull requests** only
- Active: yes

GitHub will send a test `ping` on creation. The dashboard only reacts to
`pull_request` events with `action: closed` + `merged: true`, so the ping is
a no-op (200 with `skipped: "not a pull_request event"`).

## 4. The `polish-cash` label

BuilderBot has repo write access and will auto-create the label on its first
PR. You don't need to pre-create it. If you want a specific color/description,
edit it once after the first PR lands (**Issues -> Labels**).

## 5. BuilderBot PR contract

For a merged PR to surface on the dashboard, it must:

1. Have the `polish-cash` label applied before merge. (Applied late? See
   section 6.)
2. Contain the user's screenshot as the **first** image in the PR body.
   Either markdown `![](url)` or an HTML `<img src="...">` works.
3. Reference a Linear ticket ID like `DQA-123` anywhere in the body (optional
   but required for team/title enrichment).
4. Include a changed snapshot-test PNG. The webhook auto-picks the "after"
   image from the PR diff. Supported paths:
   - FBSnapshotTestCase: `.../ReferenceImages*/**.png`
   - swift-snapshot-testing: `.../__Snapshots__/**.png`
   - Paparazzi: `.../src/test/snapshots/**.png`
   - Fallback: any PNG under a path segment containing `snapshot`
5. Optionally, use a branch named `fix/ComponentName-...` to auto-fill the
   component column.

If (4) is missing, the row still lands on the dashboard but the "after" image
will be empty. If (1) is missing, the PR is silently skipped.

## 6. Known limitations / next steps

- **Late labeling**: the webhook fires on merge. If the `polish-cash` label
  is applied after merge, the PR is skipped. If this becomes a problem, add a
  handler for `action: labeled` on already-merged PRs.
- **Multiple snapshots per PR**: if a PR changes several snapshot PNGs, the
  webhook picks the first by alphabetical filename. To override, we can add
  support for a `canonical-snapshot: path/to/foo.png` trailer in the PR body.
- **Re-delivery de-dup**: GitHub can re-deliver webhooks. There's no unique
  index on `pr` in [lib/schema.ts](lib/schema.ts) yet, so replays insert
  duplicate rows. Add one before going to production.

## 7. Local testing

1. `npm run dev` starts the app on `localhost:3000`.
2. Expose it with a tunnel:
   ```bash
   ngrok http 3000
   # or: npx smee-client --url https://smee.io/xyz --target http://localhost:3000/api/webhooks/github
   ```
3. Point a webhook (in a test repo or via GitHub's **Redeliver** button on an
   existing `pull_request` event) at the tunnel URL.
4. Merge a test PR with the `polish-cash` label, a screenshot in the body,
   and a snapshot PNG change. Confirm a row appears on the dashboard.

Unit tests cover the pure parsing logic:

```bash
npm run test:ci
```

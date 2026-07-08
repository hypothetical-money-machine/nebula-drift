# Nebula Drift

A mobile-first browser arcade game: drift through a neon nebula, collect plasma shards, dodge rogue rocks, and ride the scoring multiplier.

## Play locally

```bash
npm run check
npm start
# open http://localhost:8080
```

## Controls

- Phone/tablet: drag anywhere to steer, tap **Boost** to burn through tight gaps.
- Desktop: mouse/touch drag to steer, `Space` to boost, `P` to pause.

## Deploy

The app listens on `PORT` or `8080` and exposes `/healthz` + `/readyz` for Kubernetes probes.

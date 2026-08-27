# TradeX a stoc exchange platform

Full-stack Zerodha-style demo project with:

- Public landing site: `http://localhost:3000`
- Kite-style dashboard: `http://localhost:3001`
- Express API: `http://localhost:3002`

## Run

```bash
npm start
```

This starts backend, frontend, and dashboard together.

## Build

```bash
npm run build
```

## Notes

- Backend uses `backend/.env` for `MONGO_URL`.
- Test MongoDB with `npm --prefix backend run check:db`.
- If MongoDB is unavailable, the API falls back to starter in-memory holdings, positions, and orders so the app still runs.
- Dashboard routes use hash URLs, for example `http://localhost:3001/#/orders`.

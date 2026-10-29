# End-to-end tests

Playwright smoke suite that loads every route of the pages module and fails on
HTTP errors, missing content, or runtime errors raised by the application.

The suite runs against the production build served by the Docker image, so it
also covers the Caddy SPA fallback and the `/api/*` proxy.

## Run

```bash
npm run test:e2e
```

The script builds the image, starts the container on `8081:8080` (so a local
instance can keep `8080`), waits for the app, installs the Playwright
dependencies on first run, and then executes the tests.

Pass extra Playwright arguments after `--`:

```bash
npm run test:e2e -- --grep farmer
```

## Environment

| Variable             | Default                | Description                                        |
| -------------------- | ---------------------- | -------------------------------------------------- |
| `E2E_PORT`           | `8081`                 | Public port of the container.                      |
| `E2E_BASE_URL`       | `http://127.0.0.1:$PORT` | Tested URL, for an already running instance.      |
| `E2E_SKIP_BUILD`     | `0`                    | Set to `1` to reuse the existing image.            |
| `E2E_KEEP_CONTAINER` | `0`                    | Set to `1` to keep the container after the run.    |
| `E2E_READY_TIMEOUT`  | `90`                   | Seconds to wait for the container to answer.       |
| `PLAYWRIGHT_CHANNEL` | `chrome`               | Browser channel (`chrome`, `chromium`, `msedge`).  |

Tests use the system Chrome by default. To use the bundled browser, run
`npx --prefix e2e playwright install chromium` and set
`PLAYWRIGHT_CHANNEL=chromium`.

## Layout

- `tests/smoke.spec.ts` — the 16 route checks (14 static routes plus the
  `/farmer/:id` and `/reward/:id` pages, whose ids are resolved through the API).
- `playwright.config.ts` — base URL, single worker (the suite shares one
  container), timeouts.

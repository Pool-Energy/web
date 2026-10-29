import { expect, test, type Page } from '@playwright/test';

type RouteCase = {
  name: string;
  path: string;
  selector: string;
  charts?: boolean;
};

/**
 * Every route of the pages module, with a selector that proves the page
 * actually rendered its own content (not only the shared layout).
 */
const STATIC_ROUTES: RouteCase[] = [
  { name: 'home', path: '/', selector: '.crm-widget' },
  { name: 'farmers', path: '/farmers', selector: 'table tbody tr' },
  { name: 'blocks', path: '/blocks', selector: '[ngbAccordion]', charts: true },
  { name: 'rewards', path: '/rewards', selector: '.pagination', charts: true },
  { name: 'chia', path: '/chia', selector: '.breadcrumb' },
  { name: 'pool-status', path: '/pool/status', selector: '.crm-widget' },
  { name: 'pool-stats', path: '/pool/stats', selector: 'h4:has-text("Pool Space")', charts: true },
  { name: 'pool-logs', path: '/pool/logs', selector: 'ng-terminal' },
  { name: 'partials', path: '/partials', selector: 'h4:has-text("Live activity")', charts: true },
  { name: 'info-faq', path: '/info/faq', selector: '.card' },
  { name: 'info-fee', path: '/info/fee', selector: '.card' },
  { name: 'info-team', path: '/info/team', selector: '#member-img' },
  { name: 'join', path: '/join', selector: '.crm-widget' },
  { name: 'login', path: '/login', selector: '.card' },
];

let farmerPath: string | null = null;
let rewardPath: string | null = null;

/**
 * Resource loading failures (remote avatars, third-party assets) are out of
 * scope: keep the check focused on runtime errors raised by the application.
 */
function collectErrors(page: Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (text.startsWith('Failed to load resource')) return;
    consoleErrors.push(text);
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  return { consoleErrors, pageErrors };
}

async function expectRendered(page: Page, route: RouteCase) {
  const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
  expect(response?.status(), `HTTP status for ${route.path}`).toBe(200);
  await expect(page).toHaveTitle(/Pool\.Energy/);
  await expect(page.locator('app-root .page-content')).toBeVisible();
  await expect(page.locator(route.selector).first(), `${route.selector} on ${route.path}`).toBeVisible();

  if (route.charts) {
    await expect(page.locator('.apexcharts-canvas svg').first(), `chart on ${route.path}`).toBeVisible();
  }
}

function expectNoRuntimeError(errors: ReturnType<typeof collectErrors>) {
  expect(errors.pageErrors, 'uncaught page errors').toEqual([]);
  expect(errors.consoleErrors, 'console errors').toEqual([]);
}

test.beforeAll(async ({ request }) => {
  try {
    const launcherResponse = await request.get('/api/v1.0/launcher/?limit=1');
    if (launcherResponse.ok()) {
      const body = await launcherResponse.json();
      const launcherId = body?.results?.[0]?.launcher_id;
      if (typeof launcherId === 'string' && launcherId.length > 0) {
        farmerPath = `/farmer/${launcherId}`;
      }
    }
  } catch (error) {
    console.warn(`Could not resolve a farmer id: ${(error as Error).message}`);
  }

  try {
    const payoutResponse = await request.get('/api/v1.0/payout/?limit=1');
    if (payoutResponse.ok()) {
      const body = await payoutResponse.json();
      const payoutId = body?.results?.[0]?.id;
      if (payoutId !== undefined && payoutId !== null) {
        rewardPath = `/reward/${payoutId}`;
      }
    }
  } catch (error) {
    console.warn(`Could not resolve a payout id: ${(error as Error).message}`);
  }
});

for (const route of STATIC_ROUTES) {
  test(`${route.name} (${route.path}) renders`, async ({ page }) => {
    const errors = collectErrors(page);
    await expectRendered(page, route);
    expectNoRuntimeError(errors);
  });
}

test('farmer details (/farmer/:id) renders', async ({ page }) => {
  if (!farmerPath) {
    test.skip(true, 'the launcher API did not return a farmer id');
    return;
  }

  const errors = collectErrors(page);
  await expectRendered(page, { name: 'farmer', path: farmerPath, selector: '[role="tablist"]', charts: true });
  expectNoRuntimeError(errors);
});

test('reward details (/reward/:id) renders', async ({ page }) => {
  if (!rewardPath) {
    test.skip(true, 'the payout API did not return a reward id');
    return;
  }

  const errors = collectErrors(page);
  await expectRendered(page, { name: 'reward', path: rewardPath, selector: 'table tbody tr', charts: true });
  expectNoRuntimeError(errors);
});

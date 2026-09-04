import { test, expect } from '@playwright/test';

test('documentation routes and internal navigation are reachable', async ({ page, request }) => {
  for (const route of ['', 'guides/getting-started/', 'guides/circuits/', 'guides/timing-diagrams/', 'reference/migration/']) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toBeVisible();
  }
  const links = await page.locator('a[href]').evaluateAll((anchors) => [...new Set(anchors.map((a) => (a as HTMLAnchorElement).href))]);
  for (const href of links.filter((href) => href.startsWith('http://127.0.0.1:4321/'))) {
    expect((await request.get(href)).ok(), href).toBe(true);
  }
});

test('WaveDrom images render without browser JavaScript, including multiple diagrams', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}guides/timing-diagrams/`);
  const images = page.locator('.wavedrom img');
  await expect(images).toHaveCount(3);
  for (const img of await images.all()) {
    await expect(img).toBeVisible();
    expect(await img.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  await context.close();
});

test('nested CircuitJS iframe loads the original circuit and runs simulation', async ({ page }) => {
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('response', (response) => {
    if (response.url().includes('/circuitjs/') && response.status() >= 400) failures.push(response.url());
  });
  await page.goto('guides/circuits/');
  const iframe = page.locator('iframe.circuit-frame');
  await iframe.scrollIntoViewIfNeeded();
  const frame = page.frameLocator('iframe.circuit-frame');
  await expect(frame.locator('canvas').first()).toBeVisible({ timeout: 30_000 });
  // The simulator's public JS interface exposes loaded elements and elapsed time.
  await expect.poll(async () => iframe.evaluate((el) => {
    const api = (el as HTMLIFrameElement).contentWindow as Window & { CircuitJS1?: { getTime(): number; getElements(): unknown[] } };
    return (api.CircuitJS1?.getElements().length ?? 0) > 0 && (api.CircuitJS1?.getTime() ?? 0) > 0;
  }), { timeout: 30_000 }).toBe(true);
  const exported = await iframe.evaluate((el) => {
    const api = (el as HTMLIFrameElement).contentWindow as Window & { CircuitJS1: { exportCircuit(): string } };
    return api.CircuitJS1.exportCircuit();
  });
  expect(exported).toContain('r 176 80 384 80 0 10');
  await frame.getByRole('button', { name: /run.*stop/i }).click();
  expect(await iframe.evaluate((el) => {
    const api = (el as HTMLIFrameElement).contentWindow as Window & { CircuitJS1: { isRunning(): boolean } };
    return api.CircuitJS1.isRunning();
  })).toBe(false);
  await expect(page.getByText('Unable to render circuit: invalid CircuitJS data format', { exact: true })).toBeVisible();
  await expect(page.getByText('无法生成电路图：无效的 CircuitJS 数据格式', { exact: true })).toBeVisible();
  await expect(iframe).toHaveCount(1);
  expect(failures).toEqual([]);
});

test('search finds migrated documentation and theme selection works', async ({ page }) => {
  await page.goto('');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  const input = page.getByRole('textbox', { name: 'Search', exact: true });
  await input.fill('simulation');
  await expect(page.locator('.pagefind-ui__result-link').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('combobox', { name: 'Select theme', exact: true }).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('combobox', { name: 'Select theme', exact: true }).selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('mobile navigation and diagrams fit the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('guides/timing-diagrams/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('link', { name: 'Circuit simulation', exact: true }).first().click();
  await expect(page.locator('main h1')).toHaveText('Circuit simulation');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

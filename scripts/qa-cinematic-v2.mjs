import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const baseUrl = 'http://127.0.0.1:4173/preview-cinematic-v2.html';
const viewports = [
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'desktop-1920x1080', width: 1920, height: 1080 },
  { name: 'tablet-1024x768', width: 1024, height: 768 },
  { name: 'mobile-430x932', width: 430, height: 932 },
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'mobile-320x700', width: 320, height: 700 }
];
const frames = [0, 0.20, 0.45, 0.68, 0.85, 0.97, 1];
const expectedVersion = '0.3.1';

await mkdir('artifacts/cinematic-v2', { recursive: true });

const server = spawn('python3', ['-m', 'http.server', '4173', '--bind', '127.0.0.1'], {
  stdio: 'ignore'
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
await sleep(900);

const browser = await chromium.launch({ headless: true });
const failures = [];

async function probeCriticalAssets(page) {
  await page.goto(`${baseUrl}?frame=0`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('[data-cin2]', { timeout: 5000 });

  return page.evaluate(async () => {
    const preloadLinks = Array.from(document.querySelectorAll('link[rel="preload"][as="image"]'));
    return Promise.all(preloadLinks.map((link) => new Promise((resolve) => {
      const image = new Image();
      const timer = setTimeout(() => resolve({ href: link.href, ok: false, reason: 'timeout' }), 10000);
      image.onload = () => {
        clearTimeout(timer);
        resolve({ href: link.href, ok: true });
      };
      image.onerror = () => {
        clearTimeout(timer);
        resolve({ href: link.href, ok: false, reason: 'error' });
      };
      image.src = link.href;
    })));
  });
}

try {
  // Probe photographic/product assets once. Repeating a third-party network probe for
  // every deterministic frame makes CI slow and can turn a transient CDN issue into
  // dozens of duplicate failures. Chromium's shared cache then serves the matrix.
  const probePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const criticalAssets = await probeCriticalAssets(probePage);
  const failedCriticalAssets = criticalAssets.filter((asset) => !asset.ok);
  if (failedCriticalAssets.length) {
    failures.push(`critical image preload failed: ${failedCriticalAssets.map((asset) => `${asset.reason}:${asset.href}`).join(', ')}`);
  }
  await probePage.close();

  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1
    });

    const runtimeErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
    });

    for (const frame of frames) {
      await page.goto(`${baseUrl}?frame=${frame}`, {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });
      await page.waitForSelector('[data-cin2]', { timeout: 5000 });
      await page.waitForFunction(() => {
        const product = document.querySelector('[data-product]');
        return !product || product.complete;
      }, { timeout: 5000 });
      await page.waitForTimeout(100);

      const result = await page.evaluate(({ frame }) => {
        const root = document.querySelector('[data-cin2]');
        const sticky = document.querySelector('.cin2-sticky');
        const product = document.querySelector('[data-product-wrap]');
        const table = document.querySelector('[data-table]');
        const finalCopy = document.querySelector('[data-final-copy]');
        const overflow = document.documentElement.scrollWidth - window.innerWidth;
        const productRect = product?.getBoundingClientRect();
        const tableRect = table?.getBoundingClientRect();
        const copyRect = finalCopy?.getBoundingClientRect();

        const visibleEnough = (rect) => !rect || (
          rect.right >= -2 && rect.left <= window.innerWidth + 2 &&
          rect.bottom >= -2 && rect.top <= window.innerHeight + 2
        );

        return {
          debugFrame: root?.dataset.debugFrame ?? null,
          version: root?.dataset.version ?? null,
          stickyHeight: sticky?.getBoundingClientRect().height ?? 0,
          viewportHeight: window.innerHeight,
          overflow,
          productInViewport: visibleEnough(productRect),
          tableInViewport: visibleEnough(tableRect),
          copyInViewport: visibleEnough(copyRect),
          productOpacity: product ? Number(getComputedStyle(product).opacity) : -1,
          tableOpacity: table ? Number(getComputedStyle(table).opacity) : -1,
          copyOpacity: finalCopy ? Number(getComputedStyle(finalCopy).opacity) : -1,
          fakeTableSurfaceVisible: (() => {
            const surface = document.querySelector('.cin2-table-surface');
            return surface ? getComputedStyle(surface).display !== 'none' : false;
          })(),
          frame
        };
      }, { frame });

      if (result.version !== expectedVersion) {
        failures.push(`${viewport.name} frame ${frame}: preview version ${result.version} != ${expectedVersion}`);
      }
      if (result.fakeTableSurfaceVisible) {
        failures.push(`${viewport.name} frame ${frame}: CSS-drawn tabletop is still visible in Phase 3B`);
      }
      if (Math.abs(result.overflow) > 1) {
        failures.push(`${viewport.name} frame ${frame}: horizontal overflow ${result.overflow}px`);
      }
      if (Math.abs(result.stickyHeight - result.viewportHeight) > 2) {
        failures.push(`${viewport.name} frame ${frame}: sticky ${result.stickyHeight}px != viewport ${result.viewportHeight}px`);
      }
      if (!result.productInViewport) failures.push(`${viewport.name} frame ${frame}: product outside viewport`);
      if (frame >= 0.82 && !result.tableInViewport) failures.push(`${viewport.name} frame ${frame}: table anchor outside viewport late in sequence`);
      if (frame >= 0.95 && !result.copyInViewport) failures.push(`${viewport.name} frame ${frame}: final copy outside viewport`);
      if (result.debugFrame !== Number(frame).toFixed(3)) {
        failures.push(`${viewport.name} frame ${frame}: deterministic frame mode not applied`);
      }

      await page.screenshot({
        path: `artifacts/cinematic-v2/${viewport.name}-frame-${String(frame).replace('.', '_')}.png`,
        fullPage: false
      });
    }

    if (runtimeErrors.length) {
      failures.push(`${viewport.name}: ${runtimeErrors.join(' | ')}`);
    }

    await page.close();
  }
} finally {
  await browser.close();
  server.kill('SIGTERM');
}

if (failures.length) {
  console.error('\nCinematic v2 QA failures:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log(`Cinematic v2 QA passed: ${viewports.length} viewports × ${frames.length} deterministic frames.`);

/**
 * Headless runner for runTests.html (CI only — no app package.json).
 *
 * Expects a static server at BASE_URL (default http://127.0.0.1:4173).
 * Opens ?impl=js and ?impl=wasm; fails if window.__DIM_TEST__.failed > 0.
 * On js, also requires DimTest.cover.summary() to report 100% of instrumented
 * library lines (zero uncovered).
 *
 * Optional DIM_LIB — absolute lib URL with trailing slash, e.g.
 *   http://127.0.0.1:8765/lib/
 * forwarded as ?dimLib= (needed until Pages ships DimParse-in-cover).
 *
 * Playwright is resolved from node_modules, or from NODE_PATH (CI installs
 * into a throwaway directory so this repo stays package.json-free).
 */
import { createRequire } from "node:module";
import { join } from "node:path";

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch (err) {
    const nodePath = process.env.NODE_PATH;
    if (!nodePath) throw err;
    const require = createRequire(join(nodePath, "playwright/package.json"));
    return require("playwright");
  }
}

const { chromium } = await loadPlaywright();

const BASE = process.env.BASE_URL || "http://127.0.0.1:4173";
const TIMEOUT_MS = Number(process.env.DIM_TEST_TIMEOUT_MS || 180000);
const DIM_LIB = (process.env.DIM_LIB || "").trim();

function buildUrl(impl) {
  const u = new URL(`${BASE}/runTests.html`);
  u.searchParams.set("impl", impl);
  if (DIM_LIB) u.searchParams.set("dimLib", DIM_LIB);
  return u.toString();
}

function assertFullCoverage(cover, impl) {
  if (!cover || !cover.files) {
    throw new Error(`${impl}: DimTest.cover.summary() missing`);
  }
  console.log(
    `[${impl}] coverage ${cover.pct}% · ${cover.hit} / ${cover.total}`,
  );
  const gaps = cover.files.filter((f) => f.uncovered && f.uncovered.length);
  if (gaps.length || cover.pct !== 100 || cover.hit !== cover.total) {
    for (const f of gaps) {
      console.error(
        `  UNCOVERED ${f.path} ${f.hit}/${f.total}: ${f.uncovered.join(",")}`,
      );
    }
    throw new Error(
      `${impl}: library coverage not 100% (${cover.hit}/${cover.total})`,
    );
  }
}

async function runImpl(browser, impl) {
  const url = buildUrl(impl);
  const page = await browser.newPage();
  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error(`[console.${impl}]`, msg.text());
    }
  });

  console.log(`Opening ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: TIMEOUT_MS });

  const summary = await page
    .waitForFunction(
      () => {
        const s = window.__DIM_TEST__;
        return s && s.done ? s : null;
      },
      undefined,
      { timeout: TIMEOUT_MS },
    )
    .then((h) => h.jsonValue());

  const cover =
    impl === "js"
      ? await page.evaluate(() =>
          window.DimTest && DimTest.cover
            ? DimTest.cover.summary({ bucket: "unit" })
            : null,
        )
      : null;

  const coverE2e =
    impl === "js"
      ? await page.evaluate(() =>
          window.DimTest && DimTest.cover
            ? DimTest.cover.summary({ bucket: "e2e" })
            : null,
        )
      : null;

  if (pageErrors.length) {
    console.error(`Page errors (${impl}):`, pageErrors);
  }

  console.log(
    `[${impl}] ${summary.passed} passed, ${summary.failed} failed (of ${summary.results.length})`,
  );
  for (const r of summary.results) {
    console.log(
      `  ${r.ok ? "PASS" : "FAIL"} [${r.kind || "?"}] ${r.name}`,
    );
    if (!r.ok && r.error) console.log(`    ${r.error.split("\n")[0]}`);
  }

  if (coverE2e && coverE2e.total) {
    console.log(
      `[${impl}] e2e coverage ${coverE2e.pct}% · ${coverE2e.hit} / ${coverE2e.total} (informational)`,
    );
  }

  await page.close();

  if (pageErrors.length) {
    throw new Error(`${impl}: ${pageErrors.length} uncaught page error(s)`);
  }
  if (summary.failed > 0) {
    throw new Error(`${impl}: ${summary.failed} test(s) failed`);
  }
  const ver = summary.verification;
  if (ver) {
    console.log(
      `[${impl}] verification proved=${ver.proved} refuted=${ver.refuted} unsupported=${ver.unsupported} missing=${ver.missing} disagreements=${ver.disagreements}`,
    );
    const bad =
      (ver.refuted || 0) +
      (ver.unsupported || 0) +
      (ver.missing || 0) +
      (ver.disagreements || 0);
    if (bad > 0) {
      throw new Error(
        `${impl}: formal verification failed (${bad} bad obligation(s))`,
      );
    }
  }
  if (impl === "js") {
    assertFullCoverage(cover, impl);
  }
  return summary;
}

const browser = await chromium.launch();
try {
  await runImpl(browser, "js");
  await runImpl(browser, "wasm");
  console.log("All DimTest runs passed.");
} finally {
  await browser.close();
}

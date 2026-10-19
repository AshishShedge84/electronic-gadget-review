const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const phase = process.argv.includes('--after') ? 'after' : 'before';
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:5173';
const outputDir = path.resolve(__dirname, '../docs/ui_audit', phase);
const jsonOutputFile = path.resolve(__dirname, '../docs/ui_audit', `DOM_FINDINGS_${phase.toUpperCase()}.json`);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const ROUTES = [
  { id: "landing", path: "/" },
  { id: "explore", path: "/explore" },
  { id: "productDetail", path: "/product?product=sony-wh1000xm5" },
  { id: "login", path: "/login" },
  { id: "register", path: "/register" },
  { id: "forgotPassword", path: "/forgot-password" },
  { id: "about", path: "/about" },
  { id: "contact", path: "/contact" },
  { id: "help", path: "/help" },
  { id: "privacy", path: "/privacy" },
  { id: "terms", path: "/terms" },
];

const PROTECTED_ROUTES = [
  { id: "dashboard", path: "/dashboard", status: "not verified", reason: "No test account or auth emulator configured" },
  { id: "summary", path: "/analysis", status: "not verified", reason: "No test account or auth emulator configured" },
  { id: "sentiment", path: "/sentiment", status: "not verified", reason: "No test account or auth emulator configured" },
  { id: "aspects", path: "/aspects", status: "not verified", reason: "No test account or auth emulator configured" },
  { id: "compare", path: "/compare", status: "not verified", reason: "No test account or auth emulator configured" },
  { id: "saved", path: "/saved", status: "not verified", reason: "No test account or auth emulator configured" },
  { id: "history", path: "/history", status: "not verified", reason: "No test account or auth emulator configured" },
  { id: "profile", path: "/profile", status: "not verified", reason: "No test account or auth emulator configured" },
  { id: "settings", path: "/settings", status: "not verified", reason: "No test account or auth emulator configured" },
  { id: "nlp", path: "/nlp", status: "not verified", reason: "No test account or auth emulator configured" },
  { id: "reports", path: "/reports", status: "not verified", reason: "No test account or auth emulator configured" }
];

const VIEWPORTS = [
  { name: "1366x768", width: 1366, height: 768, isMobile: false, hasTouch: false },
  { name: "1440x900", width: 1440, height: 900, isMobile: false, hasTouch: false },
  { name: "1920x1080", width: 1920, height: 1080, isMobile: false, hasTouch: false },
  { name: "768x1024", width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: "390x844", width: 390, height: 844, isMobile: true, hasTouch: true },
];

async function runAudit() {
  console.log(`Starting UI Audit (${phase.toUpperCase()})...`);
  const browser = await chromium.launch();
  const allFindings = {};

  for (const vp of VIEWPORTS) {
    console.log(`\n=== Testing Viewport ${vp.name} ===`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
    });

    for (const route of ROUTES) {
      const pageKey = `${route.id}_${vp.name}`;
      const page = await context.newPage();

      // Track CLS
      await page.addInitScript(() => {
        window.__cls = 0;
        try {
          const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) {
                window.__cls += entry.value;
              }
            }
          });
          observer.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {}
      });

      const targetUrl = `${baseUrl}${route.path}`;
      try {
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(1500);
      } catch (err) {
        console.error(`Error loading ${targetUrl}: ${err.message}`);
      }

      // Take full-page screenshot
      const screenshotPath = path.join(outputDir, `${route.id}_${vp.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      // Measure DOM Checks
      const domData = await page.evaluate((isTouch) => {
        const findings = {
          horizontalOverflow: {
            hasOverflow: false,
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            offendingElements: []
          },
          clippedText: [],
          touchTargetsUnder44: [],
          rowMisalignments: [],
          imagesWithoutReservedSize: [],
          clsOnLoad: Math.round((window.__cls || 0) * 1000) / 1000,
          clsAfterInteraction: 0,
          clsTotal: Math.round((window.__cls || 0) * 1000) / 1000
        };

        // 1. Document-level horizontal overflow
        if (document.documentElement.scrollWidth > window.innerWidth) {
          findings.horizontalOverflow.hasOverflow = true;
          const allElements = document.querySelectorAll('body *');
          const found = new Set();
          for (const el of allElements) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && rect.right > window.innerWidth + 1) {
              const tag = el.tagName.toLowerCase();
              const cls = el.className && typeof el.className === 'string'
                ? `.${el.className.trim().split(/\s+/).slice(0, 3).join('.')}`
                : '';
              const id = el.id ? `#${el.id}` : '';
              const selector = `${tag}${id}${cls}`;
              if (!found.has(selector)) {
                found.add(selector);
                findings.horizontalOverflow.offendingElements.push({
                  selector,
                  right: Math.round(rect.right),
                  innerWidth: window.innerWidth,
                  overflowPx: Math.round(rect.right - window.innerWidth)
                });
              }
            }
          }
        }

        // 2. Text clipped by overflow
        const allLeafs = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, label, li');
        for (const el of allLeafs) {
          if (el.children.length === 0 && el.textContent.trim().length > 0) {
            const style = window.getComputedStyle(el);
            const isOverflowHidden = style.overflow === 'hidden' || style.overflowX === 'hidden' || style.overflowY === 'hidden';
            if (isOverflowHidden) {
              const horizClipped = el.scrollWidth > el.clientWidth + 2;
              const vertClipped = el.scrollHeight > el.clientHeight + 2;
              if (horizClipped || vertClipped) {
                const hasEllipsis = style.textOverflow === 'ellipsis';
                const hasLineClamp = style.webkitLineClamp && style.webkitLineClamp !== 'none';
                if (!hasEllipsis && !hasLineClamp) {
                  const tag = el.tagName.toLowerCase();
                  const cls = el.className && typeof el.className === 'string'
                    ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
                    : '';
                  findings.clippedText.push({
                    selector: `${tag}${cls}`,
                    text: el.textContent.trim().substring(0, 35),
                    scrollWidth: el.scrollWidth,
                    clientWidth: el.clientWidth,
                    scrollHeight: el.scrollHeight,
                    clientHeight: el.clientHeight,
                    textOverflow: style.textOverflow
                  });
                }
              }
            }
          }
        }

        // 3. Tap targets under 44x44 px on touch viewports (respecting WCAG accessible label targets)
        if (isTouch) {
          const clickable = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"], [role="checkbox"]');
          for (const el of clickable) {
            if (el.tagName === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio')) {
              const label = el.closest('label') || (el.id ? document.querySelector(`label[for="${el.id}"]`) : null);
              if (label) {
                const lr = label.getBoundingClientRect();
                if (lr.width >= 43.5 && lr.height >= 43.5) {
                  continue; // Accessible target satisfied by enclosing/associated label
                }
              }
            }

            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            if (rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none') {
              if (rect.width < 43.5 || rect.height < 43.5) {
                const tag = el.tagName.toLowerCase();
                const label = (el.innerText || el.getAttribute('aria-label') || el.value || el.getAttribute('title') || '').trim().substring(0, 25);
                const cls = el.className && typeof el.className === 'string'
                  ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
                  : '';
                findings.touchTargetsUnder44.push({
                  selector: `${tag}${cls}`,
                  label,
                  width: Math.round(rect.width * 10) / 10,
                  height: Math.round(rect.height * 10) / 10
                });
              }
            }
          }
        }

        // 4. Row children visibly misaligned (same visual row, ignore equal-height grids)
        const containers = document.querySelectorAll('div, section, header, nav, form, footer');
        for (const container of containers) {
          const cStyle = window.getComputedStyle(container);
          if (cStyle.display === 'flex' && !cStyle.flexDirection.includes('column') && !container.closest('.grid')) {
            const children = Array.from(container.children).filter(ch => {
              const r = ch.getBoundingClientRect();
              const s = window.getComputedStyle(ch);
              return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
            });

            if (children.length >= 2 && children.length <= 8) {
              const firstRect = children[0].getBoundingClientRect();
              const sameRow = children.filter(ch => {
                const cr = ch.getBoundingClientRect();
                return Math.abs(cr.top - firstRect.top) < 15;
              });

              if (sameRow.length >= 2) {
                const tops = sameRow.map(ch => Math.round(ch.getBoundingClientRect().top));
                const heights = sameRow.map(ch => Math.round(ch.getBoundingClientRect().height));
                const centers = sameRow.map(ch => Math.round(ch.getBoundingClientRect().top + ch.getBoundingClientRect().height / 2));
                const minCenter = Math.min(...centers);
                const maxCenter = Math.max(...centers);
                const minTop = Math.min(...tops);
                const maxTop = Math.max(...tops);

                // Row children are aligned if either their top edges match OR their central axes match via align-items: center
                const isTopAligned = (maxTop - minTop) < 3;
                const isCenterAligned = (maxCenter - minCenter) < 3 && (cStyle.alignItems.includes('center') || cStyle.alignItems === '');

                if (!isTopAligned && !isCenterAligned && (maxTop - minTop >= 3 && maxTop - minTop < 40)) {
                  const tag = container.tagName.toLowerCase();
                  const cls = container.className && typeof container.className === 'string'
                    ? `.${container.className.trim().split(/\s+/).slice(0, 2).join('.')}`
                    : '';
                  findings.rowMisalignments.push({
                    container: `${tag}${cls}`,
                    topDelta: maxTop - minTop,
                    centerDelta: maxCenter - minCenter,
                    childCount: sameRow.length
                  });
                }
              }
            }
          }
        }

        // 5. Images without reserved size
        const imgs = document.querySelectorAll('img');
        for (const img of imgs) {
          const hasAttr = img.hasAttribute('width') || img.hasAttribute('height');
          const style = window.getComputedStyle(img);
          const hasAspectRatio = style.aspectRatio && style.aspectRatio !== 'auto';
          const hasExplicitH = style.height && style.height !== 'auto' && !style.height.includes('%');
          if (!hasAttr && !hasAspectRatio && !hasExplicitH) {
            findings.imagesWithoutReservedSize.push({
              src: img.src ? img.src.split('/').pop().substring(0, 30) : 'inline/data',
              alt: img.alt || '',
              renderedWidth: Math.round(img.getBoundingClientRect().width),
              renderedHeight: Math.round(img.getBoundingClientRect().height)
            });
          }
        }

        return findings;
      }, vp.hasTouch);

      // Interaction check: open sidebar / modal / tab to measure additional CLS
      const startCls = domData.clsOnLoad;
      try {
        const toggleBtn = await page.$('button[aria-label*="menu" i], button.md\\:hidden, header button:has(svg)');
        if (toggleBtn && await toggleBtn.isVisible()) {
          await toggleBtn.click();
          await page.waitForTimeout(200);
          await toggleBtn.click().catch(() => {});
          await page.waitForTimeout(200);
        }

        // Try tabs or modal triggers
        const tabBtn = await page.$('button[role="tab"], .tabs button');
        if (tabBtn && await tabBtn.isVisible()) {
          await tabBtn.click();
          await page.waitForTimeout(200);
        }

        const currentCls = await page.evaluate(() => window.__cls || 0);
        domData.clsAfterInteraction = Math.round((currentCls - startCls) * 1000) / 1000;
        domData.clsTotal = Math.round(currentCls * 1000) / 1000;
      } catch (e) {
        domData.clsAfterInteraction = 0;
        domData.clsTotal = domData.clsOnLoad;
      }

      domData.findingSummary = {
        horizontalOverflow: domData.horizontalOverflow.hasOverflow ? domData.horizontalOverflow.offendingElements.length : 0,
        clippedText: domData.clippedText.length,
        touchTargetsUnder44: domData.touchTargetsUnder44.length,
        rowMisalignments: domData.rowMisalignments.length,
        imagesWithoutReservedSize: domData.imagesWithoutReservedSize.length,
        clsIssues: domData.clsTotal > 0.1 ? 1 : 0
      };

      domData.totalFindings = Object.values(domData.findingSummary).reduce((a, b) => a + b, 0);

      allFindings[pageKey] = {
        routeId: route.id,
        path: route.path,
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        screenshot: `${route.id}_${vp.name}.png`,
        ...domData
      };

      console.log(`  [${route.id}] Total: ${domData.totalFindings} (Overflow: ${domData.findingSummary.horizontalOverflow}, ClippedText: ${domData.findingSummary.clippedText}, Touch<44: ${domData.findingSummary.touchTargetsUnder44}, Misalign: ${domData.findingSummary.rowMisalignments}, ImgNoSize: ${domData.findingSummary.imagesWithoutReservedSize}, CLS: ${domData.clsTotal})`);

      await page.close();
    }
    await context.close();
  }

  await browser.close();

  const finalOutput = {
    auditPhase: phase,
    timestamp: new Date().toISOString(),
    protectedRoutes: PROTECTED_ROUTES,
    results: allFindings
  };

  fs.writeFileSync(jsonOutputFile, JSON.stringify(finalOutput, null, 2), 'utf-8');
  console.log(`\nAudit completed! Results saved to: ${jsonOutputFile}`);
}

runAudit().catch(err => {
  console.error("Audit error:", err);
  process.exit(1);
});

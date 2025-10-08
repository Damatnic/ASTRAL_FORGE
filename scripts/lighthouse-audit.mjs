import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pages optimized in Sessions 2-4
const PAGES_TO_TEST = [
  // Session 2: Chart optimizations
  { url: 'http://localhost:3000/analytics', name: 'Analytics' },
  { url: 'http://localhost:3000/progress', name: 'Progress' },
  { url: 'http://localhost:3000/dashboard', name: 'Dashboard' },
  
  // Session 3: Code splitting
  { url: 'http://localhost:3000/settings', name: 'Settings' },
  { url: 'http://localhost:3000/programs', name: 'Programs' },
  
  // Session 4: Component optimizations
  { url: 'http://localhost:3000/settings/equipment', name: 'Settings-Equipment' },
  { url: 'http://localhost:3000/exercises/library', name: 'Exercise-Library' },
  
  // Control pages (not optimized)
  { url: 'http://localhost:3000/', name: 'Home' },
  { url: 'http://localhost:3000/goals', name: 'Goals' },
];

async function runLighthouse(url, name) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
    settings: {
      // Throttling to simulate 4G network
      throttlingMethod: 'simulate',
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4,
      },
    },
  };

  const runnerResult = await lighthouse(url, options);
  await chrome.kill();

  const { lhr } = runnerResult;
  const performance = lhr.categories.performance;
  
  return {
    name,
    url,
    score: Math.round(performance.score * 100),
    metrics: {
      fcp: lhr.audits['first-contentful-paint'].numericValue,
      lcp: lhr.audits['largest-contentful-paint'].numericValue,
      tti: lhr.audits['interactive'].numericValue,
      tbt: lhr.audits['total-blocking-time'].numericValue,
      cls: lhr.audits['cumulative-layout-shift'].numericValue,
      speedIndex: lhr.audits['speed-index'].numericValue,
    },
    // Bundle size metrics
    totalBytes: lhr.audits['total-byte-weight']?.numericValue || 0,
    jsBytes: lhr.audits['network-requests']?.details?.items
      ?.filter(item => item.resourceType === 'Script')
      ?.reduce((sum, item) => sum + (item.transferSize || 0), 0) || 0,
  };
}

async function runAllAudits() {
  console.log('🔍 Starting Lighthouse Performance Audit...\n');
  console.log('Testing 9 pages (8 optimized + 1 control)...\n');
  
  const results = [];
  
  for (const page of PAGES_TO_TEST) {
    console.log(`Testing ${page.name}...`);
    try {
      const result = await runLighthouse(page.url, page.name);
      results.push(result);
      console.log(`  ✓ Score: ${result.score}/100`);
    } catch (error) {
      console.error(`  ✗ Failed: ${error.message}`);
      results.push({
        name: page.name,
        url: page.url,
        error: error.message,
      });
    }
  }
  
  // Generate report
  console.log('\n' + '='.repeat(80));
  console.log('LIGHTHOUSE PERFORMANCE AUDIT RESULTS');
  console.log('='.repeat(80) + '\n');
  
  // Optimized pages results
  const optimizedPages = results.filter(r => !r.error && !['Home', 'Goals'].includes(r.name));
  const controlPages = results.filter(r => !r.error && ['Home', 'Goals'].includes(r.name));
  
  console.log('OPTIMIZED PAGES (Sessions 2-4):');
  console.log('-'.repeat(80));
  optimizedPages.forEach(result => {
    console.log(`\n${result.name} (${result.url})`);
    console.log(`  Performance Score: ${result.score}/100`);
    console.log(`  Metrics:`);
    console.log(`    - First Contentful Paint: ${(result.metrics.fcp / 1000).toFixed(2)}s`);
    console.log(`    - Largest Contentful Paint: ${(result.metrics.lcp / 1000).toFixed(2)}s`);
    console.log(`    - Time to Interactive: ${(result.metrics.tti / 1000).toFixed(2)}s`);
    console.log(`    - Total Blocking Time: ${result.metrics.tbt.toFixed(0)}ms`);
    console.log(`    - Cumulative Layout Shift: ${result.metrics.cls.toFixed(3)}`);
    console.log(`    - Speed Index: ${(result.metrics.speedIndex / 1000).toFixed(2)}s`);
    console.log(`  Bundle Size:`);
    console.log(`    - Total: ${(result.totalBytes / 1024).toFixed(0)} KB`);
    console.log(`    - JavaScript: ${(result.jsBytes / 1024).toFixed(0)} KB`);
  });
  
  console.log('\n\nCONTROL PAGES (Not Optimized):');
  console.log('-'.repeat(80));
  controlPages.forEach(result => {
    console.log(`\n${result.name}: Score ${result.score}/100`);
    console.log(`  LCP: ${(result.metrics.lcp / 1000).toFixed(2)}s | JS: ${(result.jsBytes / 1024).toFixed(0)} KB`);
  });
  
  // Summary statistics
  const avgOptimized = optimizedPages.reduce((sum, r) => sum + r.score, 0) / optimizedPages.length;
  const avgControl = controlPages.reduce((sum, r) => sum + r.score, 0) / controlPages.length;
  
  console.log('\n\nSUMMARY:');
  console.log('-'.repeat(80));
  console.log(`Average Score (Optimized): ${avgOptimized.toFixed(1)}/100`);
  console.log(`Average Score (Control): ${avgControl.toFixed(1)}/100`);
  console.log(`Improvement: ${(avgOptimized - avgControl).toFixed(1)} points`);
  
  // Save detailed results to JSON
  const outputPath = path.join(__dirname, '..', 'lighthouse-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✓ Detailed results saved to: ${outputPath}`);
  
  return results;
}

// Run the audit
runAllAudits()
  .then(() => {
    console.log('\n✓ Lighthouse audit complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n✗ Audit failed:', error);
    process.exit(1);
  });

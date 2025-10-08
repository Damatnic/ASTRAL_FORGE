const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs').promises;
const path = require('path');

const PAGES_TO_TEST = [
  // Session 2 optimizations (Charts)
  { name: 'Progress', url: 'http://localhost:3000/progress' },
  { name: 'Analytics', url: 'http://localhost:3000/analytics' },
  { name: 'Dashboard', url: 'http://localhost:3000/dashboard' },
  
  // Session 3 optimizations (Code splitting)
  { name: 'Programs', url: 'http://localhost:3000/programs' },
  { name: 'Exercise Library', url: 'http://localhost:3000/exercises/library' },
  
  // Session 4 optimizations (Components)
  { name: 'Settings', url: 'http://localhost:3000/settings' },
  { name: 'Settings Equipment', url: 'http://localhost:3000/settings/equipment' },
  
  // Baseline pages (not optimized)
  { name: 'Home', url: 'http://localhost:3000' },
  { name: 'Goals', url: 'http://localhost:3000/goals' },
];

const lighthouseConfig = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance'],
    throttlingMethod: 'simulate',
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
};

async function runLighthouse(url, name) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'error',
    output: 'json',
    port: chrome.port,
  };

  try {
    const runnerResult = await lighthouse(url, options, lighthouseConfig);
    await chrome.kill();

    const { lhr } = runnerResult;
    const performanceScore = Math.round(lhr.categories.performance.score * 100);
    
    const metrics = {
      name,
      url,
      performanceScore,
      fcp: lhr.audits['first-contentful-paint'].displayValue,
      lcp: lhr.audits['largest-contentful-paint'].displayValue,
      tti: lhr.audits['interactive'].displayValue,
      tbt: lhr.audits['total-blocking-time'].displayValue,
      cls: lhr.audits['cumulative-layout-shift'].displayValue,
      speedIndex: lhr.audits['speed-index'].displayValue,
    };

    return metrics;
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

async function runAudit() {
  console.log('🚀 Starting Lighthouse Performance Audit...\n');
  console.log('Testing', PAGES_TO_TEST.length, 'pages...\n');
  
  const results = [];
  
  for (const page of PAGES_TO_TEST) {
    console.log(`Testing: ${page.name}...`);
    try {
      const metrics = await runLighthouse(page.url, page.name);
      results.push(metrics);
      console.log(`✅ ${page.name}: Score ${metrics.performanceScore}/100`);
    } catch (error) {
      console.error(`❌ Failed to test ${page.name}:`, error.message);
    }
  }
  
  console.log('\n📊 Audit Results Summary:\n');
  console.log('Page                    | Score | FCP    | LCP    | TTI    | TBT    | CLS   ');
  console.log('------------------------|-------|--------|--------|--------|--------|-------');
  
  results.forEach(result => {
    const paddedName = result.name.padEnd(23);
    const paddedScore = String(result.performanceScore).padEnd(5);
    const paddedFcp = result.fcp.padEnd(6);
    const paddedLcp = result.lcp.padEnd(6);
    const paddedTti = result.tti.padEnd(6);
    const paddedTbt = result.tbt.padEnd(6);
    
    console.log(
      `${paddedName} | ${paddedScore} | ${paddedFcp} | ${paddedLcp} | ${paddedTti} | ${paddedTbt} | ${result.cls}`
    );
  });
  
  // Calculate averages
  const avgScore = Math.round(
    results.reduce((sum, r) => sum + r.performanceScore, 0) / results.length
  );
  
  console.log('\n📈 Summary Statistics:');
  console.log(`Average Performance Score: ${avgScore}/100`);
  console.log(`Pages with Score ≥90: ${results.filter(r => r.performanceScore >= 90).length}/${results.length}`);
  console.log(`Pages with Score ≥80: ${results.filter(r => r.performanceScore >= 80).length}/${results.length}`);
  
  // Save results
  const outputPath = path.join(__dirname, 'audit-results.json');
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Full results saved to: ${outputPath}`);
}

runAudit().catch(console.error);

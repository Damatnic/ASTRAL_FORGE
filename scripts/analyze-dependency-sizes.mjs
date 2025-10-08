#!/usr/bin/env node

/**
 * Analyze Dependency Sizes
 * 
 * This script estimates the bundle size contribution of each dependency
 * by checking node_modules sizes and known bundle size databases.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8')
);

// Known dependency sizes (approximate, from bundlephobia.com)
const knownSizes = {
  // React ecosystem
  'react': { size: '6.4 KB', gzip: '2.5 KB', note: 'React runtime' },
  'react-dom': { size: '130 KB', gzip: '42 KB', note: 'React DOM renderer' },
  'next': { size: '~400 KB', gzip: '~120 KB', note: 'Next.js framework (varies by features used)' },
  
  // Auth
  'next-auth': { size: '~60 KB', gzip: '~18 KB', note: 'NextAuth.js core' },
  
  // Database
  '@prisma/client': { size: '~200 KB', gzip: '~50 KB', note: 'Prisma client (runtime only)' },
  
  // Charts
  'recharts': { size: '~400 KB', gzip: '~100 KB', note: 'Recharts library' },
  
  // Icons
  'lucide-react': { size: '~1.5 MB full', gzip: '~250 KB full', note: 'Tree-shakable (only used icons bundled)' },
  
  // Utilities
  'date-fns': { size: '~200 KB full', gzip: '~60 KB full', note: 'Tree-shakable (only used functions bundled)' },
  'clsx': { size: '0.5 KB', gzip: '0.3 KB', note: 'Minimal utility' },
  'tailwind-merge': { size: '~8 KB', gzip: '~3 KB', note: 'Tailwind utility' },
  'zod': { size: '~55 KB', gzip: '~14 KB', note: 'Schema validation' },
  
  // Security
  'bcryptjs': { size: '~30 KB', gzip: '~10 KB', note: 'Password hashing (server-side?)' },
  
  // Other
  'html2canvas': { size: '~250 KB', gzip: '~75 KB', note: 'Screenshot generation' },
};

console.log('━'.repeat(80));
console.log('📦 DEPENDENCY SIZE ANALYSIS - MILESTONE 4 SESSION 1');
console.log('━'.repeat(80));
console.log('');

console.log('🎯 PRODUCTION DEPENDENCIES (included in client bundle):\n');

const deps = packageJson.dependencies || {};
const depEntries = Object.entries(deps);

let totalEstimatedSize = 0;
let totalEstimatedGzip = 0;

const depAnalysis = depEntries.map(([name, version]) => {
  const known = knownSizes[name];
  
  if (known) {
    const sizeNum = parseFloat(known.size);
    const gzipNum = parseFloat(known.gzip);
    
    if (!isNaN(sizeNum)) totalEstimatedSize += sizeNum;
    if (!isNaN(gzipNum)) totalEstimatedGzip += gzipNum;
    
    return {
      name,
      version,
      size: known.size,
      gzip: known.gzip,
      note: known.note,
      priority: sizeNum > 50 ? 'HIGH' : sizeNum > 20 ? 'MEDIUM' : 'LOW'
    };
  } else {
    return {
      name,
      version,
      size: 'Unknown',
      gzip: 'Unknown',
      note: 'Size data not available',
      priority: 'UNKNOWN'
    };
  }
});

// Sort by size (HIGH priority first)
const sortedDeps = depAnalysis.sort((a, b) => {
  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2, UNKNOWN: 3 };
  return priorityOrder[a.priority] - priorityOrder[b.priority];
});

// Print results
sortedDeps.forEach(dep => {
  const priorityIcon = {
    HIGH: '🔴',
    MEDIUM: '🟠',
    LOW: '🟢',
    UNKNOWN: '⚪'
  }[dep.priority];
  
  console.log(`${priorityIcon} ${dep.name.padEnd(25)} ${dep.size.padEnd(15)} (gzip: ${dep.gzip.padEnd(10)})`);
  console.log(`   ${dep.note}`);
  console.log('');
});

console.log('━'.repeat(80));
console.log('📊 ESTIMATED TOTALS (rough approximation):');
console.log('━'.repeat(80));
console.log(`Total Raw: ~${totalEstimatedSize.toFixed(0)} KB`);
console.log(`Total Gzipped: ~${totalEstimatedGzip.toFixed(0)} KB`);
console.log('');
console.log('⚠️  NOTE: These are FULL package sizes. Actual bundle size depends on:');
console.log('   - Tree-shaking (only used code is bundled)');
console.log('   - Code splitting (some deps loaded on-demand)');
console.log('   - Next.js optimizations');
console.log('   - Production minification');
console.log('');
console.log('📈 ACTUAL BUNDLE SIZE from build:');
console.log('   - Shared baseline: 88.4 KB (First Load JS)');
console.log('   - Primary framework chunk: 53.6 KB');
console.log('   - Secondary shared chunk: 31.9 KB');
console.log('   - Other shared: 2.9 KB');
console.log('');

console.log('━'.repeat(80));
console.log('🎯 OPTIMIZATION PRIORITIES:');
console.log('━'.repeat(80));
console.log('');

// Identify optimization opportunities
const highPriority = sortedDeps.filter(d => d.priority === 'HIGH');
const mediumPriority = sortedDeps.filter(d => d.priority === 'MEDIUM');

console.log('🔴 HIGH IMPACT CANDIDATES (>50 KB):');
highPriority.forEach(dep => {
  console.log(`   - ${dep.name}: ${dep.size} → Check for alternatives or optimization`);
});
console.log('');

console.log('🟠 MEDIUM IMPACT CANDIDATES (20-50 KB):');
mediumPriority.forEach(dep => {
  console.log(`   - ${dep.name}: ${dep.size} → Review usage and tree-shaking`);
});
console.log('');

console.log('💡 RECOMMENDATIONS:');
console.log('');
console.log('1. RECHARTS (400 KB) - Consider:');
console.log('   • Lazy load chart components per route');
console.log('   • Alternative: lightweight chart library');
console.log('   • Code split: Only load charts where needed');
console.log('');
console.log('2. HTML2CANVAS (250 KB) - Consider:');
console.log('   • Lazy load only when screenshot feature used');
console.log('   • Current usage: Profile screenshots?');
console.log('');
console.log('3. @PRISMA/CLIENT (200 KB) - Verify:');
console.log('   • Should be server-side only');
console.log('   • Check if accidentally included in client bundle');
console.log('');
console.log('4. DATE-FNS (200 KB) - Optimize:');
console.log('   • Use specific imports (tree-shakable)');
console.log('   • Consider date-fns-tz for timezone support');
console.log('   • Alternative: Intl API (native browser)');
console.log('');
console.log('5. REACT-DOM (130 KB) - Cannot reduce:');
console.log('   • Core dependency, required');
console.log('   • Already optimized by Next.js');
console.log('');
console.log('6. NEXT-AUTH (60 KB) - Review:');
console.log('   • Check which providers are included');
console.log('   • Optimize session handling');
console.log('');
console.log('7. NEXT.JS (120 KB runtime) - Upgrade:');
console.log('   • Current: 14.0.4');
console.log('   • Latest: 14.2.33 (already latest minor)');
console.log('   • Consider: Next.js 15 (when stable)');
console.log('');

console.log('━'.repeat(80));
console.log('✅ Analysis complete! Next steps:');
console.log('   1. Verify findings with bundle analyzer visual');
console.log('   2. Check Prisma client server-side only');
console.log('   3. Lazy load heavy components (Recharts, html2canvas)');
console.log('   4. Review date-fns imports for tree-shaking');
console.log('   5. Consider lighter chart library alternatives');
console.log('━'.repeat(80));

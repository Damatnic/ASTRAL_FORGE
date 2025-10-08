#!/usr/bin/env node

/**
 * Bulk Convert Recharts to Lazy Loading
 * 
 * This script helps convert chart components to use lazy loading
 * to reduce initial bundle size.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Files to convert (from Session 2 plan)
const filesToConvert = [
  'components/analytics/weekly-performance.tsx',
  'components/analytics/exercise-radar.tsx',
  'components/analytics/training-load.tsx',
  'components/analytics/muscle-group-analysis.tsx',
  'components/analytics/recovery-metrics.tsx',
  'components/analytics/training-distribution.tsx',
  'components/analytics/volume-load-progression.tsx',
  'components/analytics/volume-analysis.tsx',
  'components/analytics/progressive-overload-tracker.tsx',
  'components/analytics/performance-comparison.tsx',
  'components/metrics/weight-chart.tsx',
  'components/metrics/body-fat-chart.tsx',
  'components/metrics/measurements-chart.tsx',
  'components/measurements/progress-chart.tsx',
  'components/exercise-performance-chart.tsx',
];

console.log('📊 Recharts Lazy Loading Conversion Helper');
console.log('━'.repeat(80));
console.log('');
console.log(`Found ${filesToConvert.length} files to convert:`);
console.log('');

filesToConvert.forEach((file, idx) => {
  const fullPath = path.join(rootDir, file);
  const exists = fs.existsSync(fullPath);
  const icon = exists ? '✅' : '❌';
  console.log(`${idx + 1}. ${icon} ${file}`);
});

console.log('');
console.log('━'.repeat(80));
console.log('');
console.log('📝 CONVERSION PATTERN:');
console.log('');
console.log('1. Create {component}-render.tsx file with chart JSX');
console.log('2. Import it lazily in main component:');
console.log('   const Chart = lazy(() => import(\'./{component}-render\'))');
console.log('3. Wrap in Suspense with ChartSkeleton');
console.log('4. Move formatDate and CustomTooltip to render file');
console.log('');
console.log('━'.repeat(80));
console.log('');
console.log('💡 EXAMPLE (already done):');
console.log('');
console.log('✅ components/analytics/strength-progression-chart.tsx');
console.log('✅ components/analytics/strength-progression-chart-render.tsx');
console.log('');
console.log('Use this as a template for the remaining files!');
console.log('');

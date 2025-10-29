#!/usr/bin/env node

/**
 * Script de otimização de build
 * Executa análises e otimizações pós-build
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'
import { gzipSync } from 'zlib'

const DIST_DIR = 'dist'
const SIZE_LIMIT_JS = 500 * 1024 // 500KB
const SIZE_LIMIT_CSS = 100 * 1024 // 100KB

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function analyzeFile(filePath) {
  const stats = statSync(filePath)
  const content = readFileSync(filePath)
  const gzipped = gzipSync(content)
  
  return {
    path: filePath,
    size: stats.size,
    gzipSize: gzipped.length,
    extension: extname(filePath)
  }
}

function scanDirectory(dir, files = []) {
  const items = readdirSync(dir)
  
  for (const item of items) {
    const fullPath = join(dir, item)
    const stats = statSync(fullPath)
    
    if (stats.isDirectory()) {
      scanDirectory(fullPath, files)
    } else if (stats.isFile()) {
      files.push(analyzeFile(fullPath))
    }
  }
  
  return files
}

function generateReport(files) {
  const jsFiles = files.filter(f => f.extension === '.js')
  const cssFiles = files.filter(f => f.extension === '.css')
  const assetFiles = files.filter(f => !['.js', '.css', '.html'].includes(f.extension))
  
  const totalSize = files.reduce((sum, f) => sum + f.size, 0)
  const totalGzipSize = files.reduce((sum, f) => sum + f.gzipSize, 0)
  
  log('\n📊 Build Analysis Report', 'cyan')
  log('='.repeat(50), 'cyan')
  
  // Resumo geral
  log(`\n📦 Total Files: ${files.length}`, 'blue')
  log(`📏 Total Size: ${formatBytes(totalSize)}`, 'blue')
  log(`🗜️  Gzipped Size: ${formatBytes(totalGzipSize)}`, 'blue')
  log(`📉 Compression Ratio: ${((1 - totalGzipSize / totalSize) * 100).toFixed(1)}%`, 'blue')
  
  // Análise de JavaScript
  if (jsFiles.length > 0) {
    log('\n🟨 JavaScript Files:', 'yellow')
    jsFiles
      .sort((a, b) => b.size - a.size)
      .forEach(file => {
        const sizeColor = file.size > SIZE_LIMIT_JS ? 'red' : 'green'
        const warning = file.size > SIZE_LIMIT_JS ? ' ⚠️' : ''
        log(`  ${file.path.replace(DIST_DIR + '/', '')}: ${formatBytes(file.size)} (${formatBytes(file.gzipSize)} gzipped)${warning}`, sizeColor)
      })
  }
  
  // Análise de CSS
  if (cssFiles.length > 0) {
    log('\n🟦 CSS Files:', 'blue')
    cssFiles
      .sort((a, b) => b.size - a.size)
      .forEach(file => {
        const sizeColor = file.size > SIZE_LIMIT_CSS ? 'red' : 'green'
        const warning = file.size > SIZE_LIMIT_CSS ? ' ⚠️' : ''
        log(`  ${file.path.replace(DIST_DIR + '/', '')}: ${formatBytes(file.size)} (${formatBytes(file.gzipSize)} gzipped)${warning}`, sizeColor)
      })
  }
  
  // Análise de Assets
  if (assetFiles.length > 0) {
    log('\n🖼️  Asset Files:', 'magenta')
    assetFiles
      .sort((a, b) => b.size - a.size)
      .slice(0, 10) // Top 10 maiores assets
      .forEach(file => {
        log(`  ${file.path.replace(DIST_DIR + '/', '')}: ${formatBytes(file.size)}`, 'magenta')
      })
  }
  
  // Recomendações
  log('\n💡 Recommendations:', 'green')
  
  const largeJsFiles = jsFiles.filter(f => f.size > SIZE_LIMIT_JS)
  if (largeJsFiles.length > 0) {
    log('  • Consider code splitting for large JavaScript chunks', 'yellow')
  }
  
  const largeCssFiles = cssFiles.filter(f => f.size > SIZE_LIMIT_CSS)
  if (largeCssFiles.length > 0) {
    log('  • Consider CSS optimization for large stylesheets', 'yellow')
  }
  
  const compressionRatio = (1 - totalGzipSize / totalSize) * 100
  if (compressionRatio < 60) {
    log('  • Enable gzip/brotli compression on your server', 'yellow')
  }
  
  if (assetFiles.some(f => f.size > 1024 * 1024)) {
    log('  • Consider image optimization for large assets', 'yellow')
  }
  
  log('\n✅ Analysis complete!', 'green')
  
  return {
    totalFiles: files.length,
    totalSize,
    totalGzipSize,
    compressionRatio,
    jsFiles: jsFiles.length,
    cssFiles: cssFiles.length,
    assetFiles: assetFiles.length,
    warnings: largeJsFiles.length + largeCssFiles.length
  }
}

function generateBuildInfo() {
  const buildInfo = {
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'production'
  }
  
  writeFileSync(
    join(DIST_DIR, 'build-info.json'),
    JSON.stringify(buildInfo, null, 2)
  )
  
  log(`\n📝 Build info saved to ${DIST_DIR}/build-info.json`, 'green')
}

// Execução principal
try {
  log('🚀 Starting build optimization analysis...', 'cyan')
  
  const files = scanDirectory(DIST_DIR)
  const report = generateReport(files)
  
  generateBuildInfo()
  
  // Exit com código de erro se houver warnings críticos
  if (report.warnings > 0) {
    log(`\n⚠️  Build completed with ${report.warnings} warnings`, 'yellow')
    process.exit(1)
  } else {
    log('\n🎉 Build optimization completed successfully!', 'green')
    process.exit(0)
  }
  
} catch (error) {
  log(`\n❌ Error during build analysis: ${error.message}`, 'red')
  process.exit(1)
}
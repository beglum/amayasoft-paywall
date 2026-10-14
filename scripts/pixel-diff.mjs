#!/usr/bin/env node
// Pixel-diff: сравнивает рендер каждого состояния paywall с эталоном из Figma.
// Использование: BASE_URL=http://localhost:3123 pnpm pixel-diff [state ...]
// Без BASE_URL поднимает собранный сервер (.output) на свободном порту.
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { chromium } from 'playwright'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const ROOT = resolve(import.meta.dirname, '..')
const REF_DIR = resolve(ROOT, 'design/png')
const OUT_DIR = resolve(ROOT, 'design/diff')
const ALL_STATES = ['default', 'loading', 'error', 'purchasing', 'success', 'restore-empty']
const states = process.argv.slice(2).length ? process.argv.slice(2) : ALL_STATES

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch {}
    await new Promise(r => setTimeout(r, 300))
  }
  throw new Error(`Сервер не поднялся: ${url}`)
}

let server
let baseUrl = process.env.BASE_URL
if (!baseUrl) {
  const entry = resolve(ROOT, '.output/server/index.mjs')
  if (!existsSync(entry)) throw new Error('Нет .output — сначала pnpm build или задайте BASE_URL')
  const port = process.env.PORT || '3123'
  server = spawn(process.execPath, [entry], { env: { ...process.env, PORT: port }, stdio: 'ignore' })
  baseUrl = `http://localhost:${port}`
  await waitForServer(`${baseUrl}/?state=default`)
}

mkdirSync(OUT_DIR, { recursive: true })
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1 })
const page = await context.newPage()
const rows = []

try {
  for (const state of states) {
    await page.goto(`${baseUrl}/?state=${state}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(() => Promise.all([...document.images].map(img => img.decode().catch(() => {}))))
    const actualPath = resolve(OUT_DIR, `${state}.actual.png`)
    await page.screenshot({ path: actualPath, animations: 'disabled' })

    const ref = PNG.sync.read(readFileSync(resolve(REF_DIR, `${state}@1x.png`)))
    const act = PNG.sync.read(readFileSync(actualPath))
    const { width, height } = ref
    if (act.width !== width || act.height !== height) {
      rows.push({ state, diff: `размер ${act.width}×${act.height} ≠ ${width}×${height}` })
      continue
    }
    const diff = new PNG({ width, height })
    const mismatched = pixelmatch(ref.data, act.data, diff.data, width, height, { threshold: 0.1 })
    writeFileSync(resolve(OUT_DIR, `${state}.diff.png`), PNG.sync.write(diff))
    rows.push({ state, diff: `${((mismatched / (width * height)) * 100).toFixed(2)}%` })
  }
} finally {
  await browser.close()
  server?.kill()
}

const w = Math.max(...rows.map(r => r.state.length), 'состояние'.length)
console.log(`${'состояние'.padEnd(w)}  несовпадение`)
for (const r of rows) console.log(`${r.state.padEnd(w)}  ${r.diff}`)

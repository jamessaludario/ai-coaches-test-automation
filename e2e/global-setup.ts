import * as fs from 'node:fs'
import * as path from 'node:path'
import type { FullConfig } from '@playwright/test'

const AUTH_DIR = path.join(__dirname, '.auth')

async function globalSetup(config: FullConfig) {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true })
  }
}

export default globalSetup

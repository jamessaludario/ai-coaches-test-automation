import * as fs from 'node:fs'
import * as path from 'node:path'
import type { FullConfig } from '@playwright/test'

const AUTH_DIR = path.join(__dirname, '.auth')

async function globalTeardown(config: FullConfig) {
  if (fs.existsSync(AUTH_DIR)) {
    const files = fs.readdirSync(AUTH_DIR)
    for (const file of files) {
      try {
        fs.unlinkSync(path.join(AUTH_DIR, file))
      }
      catch {
        // Ignore cleanup errors
      }
    }
  }
}

export default globalTeardown

import type { Locator, Page } from 'playwright'
import { workshopScheduleContent } from '../constants'

/**
 * Card Helper Functions
 *
 * Reusable functions for working with card elements in tests
 */

export async function hasNoWorkshopsFound(page: Page): Promise<boolean> {
  return await page.getByText(workshopScheduleContent.noWorkshopsFound).isVisible().catch(() => false)
}

export async function getVisibleCards(page: Page, selector: string): Promise<Locator[]> {
  const cards = await page.locator(selector).all()
  const visibilityChecks = await Promise.all(
    cards.map(card => card.isVisible().catch(() => false)),
  )

  return cards.filter((_, index) => visibilityChecks[index])
}

export async function waitForCardsToLoad(
  page: Page,
  selector: string,
  timeout = 10000,
): Promise<void> {
  const startTime = Date.now()

  if (await hasNoWorkshopsFound(page)) {
    return
  }

  const loadingIndicators = getLoadingIndicators(page)

  for (const indicator of loadingIndicators) {
    const isVisible = await indicator.isVisible().catch(() => false)
    if (isVisible) {
      const remainingTime = Math.max(0, timeout - (Date.now() - startTime))
      await indicator.waitFor({ state: 'hidden', timeout: remainingTime }).catch(() => {})
    }
  }

  if (await hasNoWorkshopsFound(page)) {
    return
  }

  await page.locator(selector).first().waitFor({
    state: 'visible',
    timeout: Math.max(5000, timeout - (Date.now() - startTime)),
  }).catch(() => {})

  if (await hasNoWorkshopsFound(page)) {
    return
  }

  await page.waitForLoadState('networkidle', {
    timeout: Math.max(5000, timeout - (Date.now() - startTime)),
  }).catch(() => {})

  if (await hasNoWorkshopsFound(page)) {
    return
  }

  let previousCount = 0
  let stableIterations = 0
  const maxIterations = 10
  const checkInterval = 300

  for (let i = 0; i < maxIterations && Date.now() - startTime < timeout; i++) {
    if (await hasNoWorkshopsFound(page)) {
      return
    }

    const currentCount = await page.locator(selector).count()

    if (currentCount === previousCount && currentCount > 0) {
      stableIterations++
      if (stableIterations >= 3) {
        break
      }
    }
    else {
      stableIterations = 0
      previousCount = currentCount
    }

    await page.waitForTimeout(checkInterval)
  }
}

export async function waitForCardsToRefresh(
  page: Page,
  selector: string,
  timeout = 5000,
): Promise<void> {
  const startTime = Date.now()

  await page.waitForTimeout(150)

  const loadingIndicators = getLoadingIndicators(page)

  for (const indicator of loadingIndicators) {
    const isVisible = await indicator.isVisible().catch(() => false)
    if (isVisible) {
      await indicator.waitFor({ state: 'hidden', timeout: Math.max(3000, timeout - (Date.now() - startTime)) }).catch(() => {})
      break
    }
  }

  await page.waitForLoadState('networkidle', { timeout: Math.max(4000, timeout - (Date.now() - startTime)) }).catch(() => {})

  let previousCount = await page.locator(selector).count()
  let stableIterations = 0
  const maxIterations = 30
  const checkInterval = 100

  for (let i = 0; i < maxIterations && Date.now() - startTime < timeout; i++) {
    await page.waitForTimeout(checkInterval)
    const currentCount = await page.locator(selector).count()

    if (currentCount === previousCount) {
      stableIterations++
      if (stableIterations >= 6) {
        break
      }
    }
    else {
      stableIterations = 0
      previousCount = currentCount
    }
  }

  const finalCount = await page.locator(selector).count()
  if (finalCount > 0) {
    await page.locator(selector).first().waitFor({ state: 'visible', timeout: 1500 }).catch(() => {})
    await page.waitForLoadState('networkidle', { timeout: 1500 }).catch(() => {})
    await page.waitForTimeout(200)
  }
  else {
    await page.waitForTimeout(500)
  }
}

export function getLoadingIndicators(page: Page): Locator[] {
  return [
    page.getByText('Loading...'),
    page.getByRole('progressbar'),
    page.locator('[data-loading="true"]'),
    page.locator('.loading'),
  ]
}

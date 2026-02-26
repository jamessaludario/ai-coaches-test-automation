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

export function getLoadingIndicators(page: Page): Locator[] {
  return [
    page.getByText('Loading...'),
    page.getByRole('progressbar'),
    page.locator('[data-loading="true"]'),
    page.locator('.loading'),
  ]
}

// =============================================================================
// SHARED STABILIZATION HELPERS
// =============================================================================

/**
 * Wait for loading indicators (spinners, progress bars) to disappear
 */
async function waitForLoadingIndicatorsToHide(
  page: Page,
  timeout: number,
  startTime: number,
): Promise<void> {
  const loadingIndicators = getLoadingIndicators(page)

  for (const indicator of loadingIndicators) {
    const isVisible = await indicator.isVisible().catch(() => false)
    if (isVisible) {
      const remainingTime = Math.max(3000, timeout - (Date.now() - startTime))
      await indicator.waitFor({ state: 'hidden', timeout: remainingTime }).catch(() => { })
      break
    }
  }
}

/**
 * Poll card count until it stabilizes (same count for N consecutive checks)
 */
async function waitForStableCardCount(
  page: Page,
  selector: string,
  options: {
    timeout: number
    startTime: number
    checkInterval?: number
    requiredStableChecks?: number
    maxIterations?: number
    initialCount?: number
  },
): Promise<void> {
  const {
    timeout,
    startTime,
    checkInterval = 300,
    requiredStableChecks = 3,
    maxIterations = 10,
    initialCount = 0,
  } = options

  let previousCount = initialCount
  let stableIterations = 0

  for (let i = 0; i < maxIterations && Date.now() - startTime < timeout; i++) {
    if (await hasNoWorkshopsFound(page)) {
      return
    }

    const currentCount = await page.locator(selector).count()

    if (currentCount === previousCount && currentCount > 0) {
      stableIterations++
      if (stableIterations >= requiredStableChecks) {
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

// =============================================================================
// PUBLIC CARD WAIT FUNCTIONS
// =============================================================================

export async function waitForCardsToLoad(
  page: Page,
  selector: string,
  timeout = 10000,
): Promise<void> {
  const startTime = Date.now()

  if (await hasNoWorkshopsFound(page)) {
    return
  }

  await waitForLoadingIndicatorsToHide(page, timeout, startTime)

  if (await hasNoWorkshopsFound(page)) {
    return
  }

  await page.locator(selector).first().waitFor({
    state: 'visible',
    timeout: Math.max(5000, timeout - (Date.now() - startTime)),
  }).catch(() => { })

  if (await hasNoWorkshopsFound(page)) {
    return
  }

  await page.waitForLoadState('networkidle', {
    timeout: Math.max(5000, timeout - (Date.now() - startTime)),
  }).catch(() => { })

  if (await hasNoWorkshopsFound(page)) {
    return
  }

  await waitForStableCardCount(page, selector, {
    timeout,
    startTime,
    checkInterval: 300,
    requiredStableChecks: 3,
    maxIterations: 10,
  })
}

export async function waitForCardsToRefresh(
  page: Page,
  selector: string,
  timeout = 5000,
): Promise<void> {
  const startTime = Date.now()

  await page.waitForTimeout(150)

  await waitForLoadingIndicatorsToHide(page, timeout, startTime)

  await page.waitForLoadState('networkidle', {
    timeout: Math.max(4000, timeout - (Date.now() - startTime)),
  }).catch(() => { })

  const initialCount = await page.locator(selector).count()
  await waitForStableCardCount(page, selector, {
    timeout,
    startTime,
    checkInterval: 100,
    requiredStableChecks: 6,
    maxIterations: 30,
    initialCount,
  })

  const finalCount = await page.locator(selector).count()
  if (finalCount > 0) {
    await page.locator(selector).first().waitFor({ state: 'visible', timeout: 1500 }).catch(() => { })
    await page.waitForLoadState('networkidle', { timeout: 1500 }).catch(() => { })
    await page.waitForTimeout(200)
  }
  else {
    await page.waitForTimeout(500)
  }
}

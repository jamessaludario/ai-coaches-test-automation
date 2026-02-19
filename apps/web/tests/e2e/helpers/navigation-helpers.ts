import type { UserCredentials } from '@layer-base/e2e/constants'
import type { NuxtGoto } from '@layer-base/e2e/helpers'
import type { Page } from 'playwright'
import { testUsers, timeouts } from '@layer-base/e2e/constants'
import { scrollToSection, scrollToText } from '@layer-base/e2e/helpers'
import { escapeRegExp } from '@layer-base/e2e/utils'
import { expect } from '@nuxt/test-utils/playwright'
import {
  consultantPageContent,
  defaultWorkshop,
  exploreWorkshopsContent,
  pageRoutes,
  workshopRoutes,
  workshopScheduleContent,
} from '../constants'
import { waitForCardsToRefresh } from './card-helpers'

/**
 * Navigation Helper Functions
 *
 * Functions for navigating between pages and scrolling to content
 */

export async function navigateToWorkshopDetails(page: Page, goto: NuxtGoto, workshopName: string = defaultWorkshop.name) {
  await goto(pageRoutes.workshops, { waitUntil: 'networkidle' })

  const workshopSearchBox = page.getByPlaceholder(exploreWorkshopsContent.searchPlaceholder)
  await workshopSearchBox.fill(workshopName)
  await page.keyboard.press('Enter')

  await waitForCardsToRefresh(page, '.card', timeouts.wait.extraLong)
  await expect(page.getByText(workshopName)).toBeVisible({ timeout: timeouts.wait.extraLong })

  const workshopCards = page.locator('.card').filter({
    has: page.getByRole('heading', { name: new RegExp(escapeRegExp(workshopName), 'i') }),
  })
  const cardCount = await workshopCards.count()

  if (cardCount > 0) {
    await workshopCards.first().click()
  }
  else {
    throw new Error(`No workshop card found for "${workshopName}"`)
  }

  await page.waitForURL(workshopRoutes.details, { timeout: timeouts.page.navigation })
}

export async function navigateToWorkshopScheduleDetails(page: Page, goto: NuxtGoto, workshopName: string = defaultWorkshop.name) {
  await goto(pageRoutes.workshopSchedules, { waitUntil: 'networkidle' })

  const searchBox = page.getByRole('textbox', { name: workshopScheduleContent.workshopSearchPlaceholder })
  await searchBox.fill(workshopName)
  await page.keyboard.press('Enter')

  await waitForCardsToRefresh(page, '.card.relative', timeouts.wait.extraLong)

  const learnMoreLinks = page.getByRole('link', { name: workshopScheduleContent.learnMoreButton })
  const linkCount = await learnMoreLinks.count()

  if (linkCount > 0) {
    const linkToClick = linkCount > 1 ? learnMoreLinks.first() : learnMoreLinks
    await expect(linkToClick).toBeVisible({ timeout: timeouts.ui.elementVisible })
    await linkToClick.click()
  }
  else {
    throw new Error(`No "Learn more" links found for workshop "${workshopName}"`)
  }

  await page.waitForURL(workshopRoutes.schedules, { timeout: timeouts.page.navigation })
}

export async function navigateToCoachProfile(page: Page, coach: UserCredentials = testUsers.coach) {
  await page.goto(pageRoutes.consultants, { waitUntil: 'networkidle' })

  const searchBox = page.getByPlaceholder(consultantPageContent.namePlaceholder)
  await searchBox.fill(coach.fullName)
  await page.keyboard.press('Enter')
  await waitForCardsToRefresh(page, 'div[data-slot="card"]', timeouts.wait.extraLong)

  const coachCards = page.locator('div[data-slot="card"]').filter({
    has: page.getByRole('link', { name: coach.fullName }),
  })

  const cardCount = await coachCards.count()
  if (cardCount > 0) {
    await coachCards.getByRole('link', { name: coach.fullName }).click()
    await page.waitForURL(pageRoutes.consultantProfilePattern.replace(':username', coach.username), { timeout: timeouts.page.navigation })
    await expect(page.getByRole('heading', { name: new RegExp(coach.fullName, 'i') })).toBeVisible({ timeout: timeouts.ui.elementVisible })
    return true
  }
  else {
    await expect(page.getByText('No consultants found.')).toBeVisible({ timeout: timeouts.ui.elementVisible })
    return false
  }
}

// Re-export shared scroll functions for convenience
export { scrollToSection, scrollToText }

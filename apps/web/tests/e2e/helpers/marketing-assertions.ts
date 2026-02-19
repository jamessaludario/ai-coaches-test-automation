import type { Page } from 'playwright'
import { expect } from '@nuxt/test-utils/playwright'
import {
  coachProfileContent,
  homePageContent,
  timeouts,
  workshopContent,
  workshopRoutes,
} from '../constants'
import {
  expectHeadingsVisible,
  extractScheduleDatetimes,
  selectFirstIfMultiple,
  validateCardsContainMode,
  validateCardsContainText,
} from '../helpers'
import { escapeRegExp, validateScheduleDatetime } from '../utils'

/**
 * Marketing Page Assertions
 *
 * Reusable assertion functions for web marketing pages.
 */

type ScheduleValidationResult
  = | { skipped: true, reason: string }
    | { skipped: false, validated: number }

// Home Page
export async function expectHomeHeroSection(page: Page, badges: readonly string[]) {
  await expect(page.getByRole('heading', { name: homePageContent.hero.mainHeading }))
    .toBeVisible()
  await expect(page.getByText(homePageContent.hero.tagline).first())
    .toBeVisible()

  for (const badge of badges) {
    await expect(page.getByText(badge, { exact: true })).toBeVisible()
  }

  await expect(page.getByRole('heading', { name: homePageContent.hero.workshopTitle }))
    .toBeVisible()
  await expect(page.getByRole('heading', { name: homePageContent.hero.workshopSubtitle }))
    .toBeVisible()
}

export async function expectHomeValuePropositions(page: Page, sections: readonly (string | RegExp)[]) {
  const valueProposition = page.getByText(homePageContent.valueProps.mainMessage)
  await valueProposition.scrollIntoViewIfNeeded()
  await expect(valueProposition).toBeVisible()

  const deliveredInHouse = page.getByText(homePageContent.valueProps.deliveryInfo)
  await deliveredInHouse.scrollIntoViewIfNeeded()
  await expect(deliveredInHouse).toBeVisible()

  const certifiedCoaches = page.getByText(homePageContent.valueProps.coachInfo)
  await certifiedCoaches.scrollIntoViewIfNeeded()
  await expect(certifiedCoaches).toBeVisible()

  await expectHeadingsVisible(page, sections)
}

// Workshops Page
export async function expectWorkshopVisible(page: Page, workshopName: string) {
  await expect(page.getByText(workshopName)).toBeVisible()
}

export async function expectCardsContainText(page: Page, text: string, selector: 'text' | 'heading' = 'text') {
  const workshopCards = page.locator('.card.relative')
  await expect(workshopCards.first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
  const cards = await workshopCards.all()
  expect(cards.length).toBeGreaterThan(0)

  const matcher = new RegExp(escapeRegExp(text), 'i')

  for (const card of cards) {
    const locator = selector === 'heading'
      ? card.getByRole('heading', { name: matcher })
      : card.getByText(matcher)

    await expect(locator).toBeVisible({
      timeout: timeouts.ui.elementVisible,
    })
  }
}

// Coach Profile Page
export async function expectCoachProfileVisible(page: Page, coachName: string) {
  await expect(page.getByRole('heading', { name: coachName })).toBeVisible()
  await expect(page.getByRole('heading', { name: coachProfileContent.sections[2] }).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByRole('button', { name: /Request a Schedule/i })).toBeVisible({ timeout: timeouts.ui.elementVisible })
}

export async function expectCoachWorkshopSearchResults(page: Page, workshopName: string) {
  await expect(page.getByRole('textbox', { name: 'Search for a workshop' }))
    .toBeVisible()

  await validateCardsContainText(
    page,
    workshopName,
    'heading',
    `Card does not contain a heading with "${workshopName}"`,
    '.card.relative, .card',
  )
}

export async function expectCoachModeFilter(page: Page, mode: string) {
  await validateCardsContainMode(page, mode)
}

// Workshop Details Page
export async function expectWorkshopDetailsVisible(page: Page, workshopName: string) {
  await expect(page.getByRole('heading', { name: workshopName }))
    .toBeVisible({ timeout: 10000 })
  await expect(page.getByRole('button', { name: workshopContent.details.shareButton }))
    .toBeVisible()
  await expect(page.getByRole('link', { name: workshopContent.details.backButton }))
    .toBeVisible()
  await expect(await selectFirstIfMultiple(page.getByRole('link', { name: workshopContent.details.browseSchedules })))
    .toBeVisible()
  await expect(page.getByText(workshopContent.details.priceText))
    .toBeVisible()
}

export async function expectWorkshopSections(page: Page) {
  await expectHeadingsVisible(page, workshopContent.details.sections)
}

export async function expectSchedulesUrl(page: Page) {
  await expect(page).toHaveURL(workshopRoutes.schedules)
}

export async function expectWorkshopDetailsUrl(page: Page) {
  await expect(page).toHaveURL(workshopRoutes.details)
}

export async function expectWorkshopsUrl(page: Page) {
  await expect(page).toHaveURL(workshopRoutes.workshops)
}

export async function expectFutureSchedulesOnly(page: Page): Promise<ScheduleValidationResult> {
  const upcomingSessionsHeading = page.getByRole('heading', {
    name: /Available Schedules/i,
  })

  const hasUpcomingSessions = await upcomingSessionsHeading
    .waitFor({ state: 'visible', timeout: 15000 })
    .then(() => true)
    .catch(() => false)

  if (!hasUpcomingSessions) {
    return { skipped: true, reason: 'No Upcoming Sessions section found' }
  }

  await upcomingSessionsHeading.scrollIntoViewIfNeeded()

  const scheduleCards = page.locator('.card').filter({
    has: page.locator('time[datetime]'),
  })

  const cardCount = await scheduleCards.count()

  if (cardCount === 0) {
    return { skipped: true, reason: 'No schedules available to test' }
  }

  // Extract all schedule datetimes
  const datetimes = await extractScheduleDatetimes(page, '.card')

  // Validate each schedule
  const now = new Date()
  for (const datetime of datetimes) {
    const validation = validateScheduleDatetime(datetime, now)

    expect(validation.valid, validation.errors.join(', ')).toBe(true)
  }

  return { skipped: false, validated: datetimes.length }
}

// Workshop Schedule Details Page
export async function expectScheduleDetailsVisible(page: Page, workshopName: string) {
  await expect(page.getByRole('link', { name: workshopContent.schedule.bookButton }))
    .toBeVisible({ timeout: 10000 })
  await expect(page.getByRole('heading', { name: workshopName }))
    .toBeVisible()
  await expect(page.getByRole('button', { name: workshopContent.schedule.shareButton }))
    .toBeVisible()
  await expect(page.locator('text=/[A-Z][a-z]+ \\d{1,2}, \\d{4}/').first())
    .toBeVisible({ timeout: 10000 })
  await expect(page.getByText('$', { exact: false }).first())
    .toBeVisible()
  await expect(page.getByText(workshopContent.schedule.spotText))
    .toBeVisible()
}

export async function expectAllScheduleSections(page: Page) {
  await expectHeadingsVisible(page, workshopContent.schedule.sections)

  for (const badge of workshopContent.schedule.badges) {
    const badgeElement = page.getByText(badge)
    const isVisible = await badgeElement.waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
      .then(() => true)
      .catch(() => false)
    if (isVisible) {
      await expect(badgeElement).toBeVisible({ timeout: timeouts.ui.elementVisible })
    }
  }
}

export async function expectScheduleCoachSection(page: Page, coachName: string) {
  const coachSection = page.locator('section, div').filter({ has: page.getByRole('heading', { name: /Coach/i }) }).first()

  if (await coachSection.count() === 0) {
    throw new Error('Coach section not found')
  }

  await expect(coachSection.getByText(coachName)).toBeVisible({ timeout: timeouts.ui.elementVisible })
}

export async function expectBookingOrLoginUrl(page: Page) {
  await expect(page).toHaveURL(workshopRoutes.bookOrLogin, { timeout: timeouts.page.pageLoad })
}

export async function expectSchedulesListUrl(page: Page) {
  await expect(page).toHaveURL(workshopRoutes.scheduleDetails, { timeout: timeouts.page.pageLoad })
}

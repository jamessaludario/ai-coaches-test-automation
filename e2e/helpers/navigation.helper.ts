import type { Page } from 'playwright'
import type { UserCredentials } from '../constants'
import {
  consultantPageContent,
  defaultWorkshop,
  exploreWorkshopsContent,
  pageRoutes,
  testUsers,
  timeouts,
  workshopRoutes,
  workshopScheduleContent,
} from '../constants'
import { escapeRegExp } from './date.helper'
import { waitForCardsToRefresh } from './form.helper'
import { expect } from '@nuxt/test-utils/playwright'

export type WaitUntil = 'load' | 'domcontentloaded' | 'networkidle' | 'commit'
export interface NuxtGotoOptions { waitUntil?: WaitUntil }
export type NuxtGoto = (url: string, options?: NuxtGotoOptions) => Promise<void>

export async function nuxtGoto(page: Page, url: string, options?: NuxtGotoOptions): Promise<void> {
  const waitUntil = options?.waitUntil || 'networkidle'
  await page.goto(url, { ...options, waitUntil })
  if (waitUntil === 'commit') {
    await page.waitForLoadState('domcontentloaded')
  }
  try {
    await page.waitForFunction(() => {
      return (window as any).__NUXT__ !== undefined
    }, { timeout: timeouts.page.pageLoad })
  }
  catch {
    console.warn(`__NUXT__ check timed out for URL: ${url}. Continuing anyway.`)
  }
}

export function createNuxtGoto(page: Page): NuxtGoto {
  return (url: string, options?: NuxtGotoOptions) => nuxtGoto(page, url, options)
}

export async function navigateViaSidebar(page: Page, itemName: string | RegExp) {
  const sidebarLink = page.getByRole('link', { name: itemName })
  await sidebarLink.waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
  await sidebarLink.click()
}

export async function scrollToSection(page: Page, headingText: string | RegExp) {
  const heading = page.getByRole('heading', { name: headingText })
  await heading.waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
  await heading.evaluate((element: HTMLElement) => {
    element.scrollIntoView({ block: 'center', behavior: 'instant' })
  })
}

export async function scrollToText(page: Page, text: string | RegExp) {
  const textElement = page.getByText(text).first()
  await textElement.waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
  await textElement.evaluate((element: HTMLElement) => {
    element.scrollIntoView({ block: 'center', behavior: 'instant' })
  })
}

export async function clickTab(page: Page, tabName: string | RegExp) {
  const tab = page.getByRole('tab', { name: tabName })
  await tab.waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
  await tab.click()
}

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

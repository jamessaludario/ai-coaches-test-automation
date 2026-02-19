import type { Page } from 'playwright'
import { timeouts } from '../constants'

export type WaitUntil = 'load' | 'domcontentloaded' | 'networkidle' | 'commit'
export interface NuxtGotoOptions { waitUntil?: WaitUntil }
export type NuxtGoto = (url: string, options?: NuxtGotoOptions) => Promise<void>

export async function nuxtGoto(
  page: Page,
  url: string,
  options?: NuxtGotoOptions,
): Promise<void> {
  const waitUntil = options?.waitUntil || 'networkidle'

  await page.goto(url, {
    ...options,
    waitUntil,
  })

  if (waitUntil === 'commit') {
    await page.waitForLoadState('domcontentloaded')
  }

  try {
    await page.waitForFunction(() => {
      return (window as any).__NUXT__ !== undefined
    }, { timeout: timeouts.page.pageLoad })
  }
  catch {
    console.warn(`__NUXT__ check timed out for URL: ${url}. Continuing anyway. This may indicate a Nuxt hydration or build issue.`)
  }
}

export function createNuxtGoto(page: Page): NuxtGoto {
  return (url: string, options?: NuxtGotoOptions) => nuxtGoto(page, url, options)
}

/**
 * Navigate to a page using sidebar link
 */
export async function navigateViaSidebar(page: Page, itemName: string | RegExp) {
  const sidebarLink = page.getByRole('link', { name: itemName })
  await sidebarLink.waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
  await sidebarLink.click()
}

/**
 * Scroll to a section by heading text
 */
export async function scrollToSection(page: Page, headingText: string | RegExp) {
  const heading = page.getByRole('heading', { name: headingText })
  await heading.waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
  await heading.evaluate((element: HTMLElement) => {
    element.scrollIntoView({ block: 'center', behavior: 'instant' })
  })
}

/**
 * Scroll to an element by its text content
 */
export async function scrollToText(page: Page, text: string | RegExp) {
  const textElement = page.getByText(text).first()
  await textElement.waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
  await textElement.evaluate((element: HTMLElement) => {
    element.scrollIntoView({ block: 'center', behavior: 'instant' })
  })
}

/**
 * Click a tab by its name
 */
export async function clickTab(page: Page, tabName: string | RegExp) {
  const tab = page.getByRole('tab', { name: tabName })
  await tab.waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
  await tab.click()
}

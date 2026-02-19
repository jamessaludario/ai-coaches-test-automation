import { consultantPageContent, DEFAULT_COUNTRY, testUsers, timeouts } from '../../constants'
import { expect, test } from '../../fixtures'
import { navigateToCoachProfile, nuxtGoto, waitForCardsToRefresh } from '../../helpers'
import { escapeRegExp } from '../../utils'

test.describe('Consultants Page', () => {
  test.setTimeout(timeouts.workflow.extended)

  test.beforeEach(async ({ page }) => {
    await nuxtGoto(page, '/consultants')
  })

  test('search and filter consultants', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: consultantPageContent.namePlaceholder })
    await searchBox.fill(testUsers.coach.fullName)
    await page.keyboard.press('Enter')
    await expect(page.getByRole('link', { name: new RegExp(testUsers.coach.fullName, 'i') })).toBeVisible()
    await searchBox.clear()

    const locationBox = page.getByRole('combobox', { name: consultantPageContent.locationPlaceholder })
    await locationBox.fill(DEFAULT_COUNTRY)
    await page.keyboard.press('Enter')

    await waitForCardsToRefresh(page, '.card:has(span.avatar)', timeouts.wait.extraLong)

    const cards = page.locator('.card:has(span.avatar)')
    const filteredCards = cards.filter({ hasText: new RegExp(escapeRegExp(DEFAULT_COUNTRY), 'i') })

    await expect(async () => {
      const totalCount = await cards.count()
      const matchingCount = await filteredCards.count()
      expect(matchingCount).toBe(totalCount)
    }).toPass({ timeout: timeouts.wait.medium })
  })

  test('navigate to consultant profile', async ({ page }) => {
    await navigateToCoachProfile(page, testUsers.coach)
  })
})

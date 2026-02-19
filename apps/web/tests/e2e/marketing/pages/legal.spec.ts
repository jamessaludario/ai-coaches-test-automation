import { legalContent, pageRoutes, timeouts } from '../../constants'
import { expect, test } from '../../fixtures'
import { createNuxtGoto } from '../../helpers'

test.describe('Legal Pages', () => {
  test.setTimeout(timeouts.workflow.extended)

  for (const legalPage of legalContent.pages) {
    test(`Should display ${legalPage.name}`, async ({ page }) => {
      const goto = createNuxtGoto(page)
      await goto(legalPage.path, { waitUntil: 'networkidle' })
      await expect(page.getByRole('heading', { name: legalPage.heading })).toBeVisible()
      const content = await page.textContent('body')
      expect(content).toBeTruthy()
      const hasKeywords = content && legalPage.keywords.some(keyword => content.includes(keyword))
      expect(hasKeywords).toBeTruthy()
    })
  }

  test('navigate to legal pages from home', async ({ page }) => {
    const goto = createNuxtGoto(page)
    await goto(pageRoutes.home, { waitUntil: 'networkidle' })

    for (const link of legalContent.pages.filter(legalPage => legalPage.role === 'client')) {
      const linkElement = page.getByRole('link', { name: link.homepageLinkName })
      await linkElement.scrollIntoViewIfNeeded()
      await linkElement.click()
      await expect(page).toHaveURL(link.path)
      await expect(page.getByRole('heading', { name: link.heading })).toBeVisible()
      await goto(pageRoutes.home, { waitUntil: 'networkidle' })
    }
  })
})

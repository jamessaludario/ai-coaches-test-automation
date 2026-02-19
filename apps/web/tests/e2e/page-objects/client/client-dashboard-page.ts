import type { Locator, Page } from 'playwright'
import { dashboardContent, userRoutes } from '../../constants'
import { nuxtGoto } from '../../helpers'

const NAVIGATION_TIMEOUT = 10000

/**
 * Client Dashboard Page Object
 *
 * Handles client dashboard interactions.
 * For assertions, use helpers from `helpers/client-assertions.ts`
 */
export class ClientDashboardPage {
  constructor(private readonly page: Page) {}

  get dashboardHeading() {
    return this.page.getByRole('heading', { name: dashboardContent.client.heading })
  }

  get welcomeText() {
    return this.page.getByText(dashboardContent.client.welcomeMessage)
  }

  get workshopsLink() {
    return this.page.getByRole('link', { name: dashboardContent.client.navigation.workshops.text, exact: true })
  }

  get workshopsHeading() {
    return this.page.getByRole('heading', { name: dashboardContent.client.navigation.workshops.text, exact: true })
  }

  get bookingsLink() {
    return this.page.getByRole('link', { name: dashboardContent.client.navigation.bookings.text, exact: true })
  }

  get bookingsHeading() {
    return this.page.getByRole('heading', { name: dashboardContent.client.navigation.bookings.text, exact: true })
  }

  get metricsValues() {
    return this.page.locator('p.text-2xl.font-bold').all()
  }

  async goto() {
    await nuxtGoto(this.page, userRoutes.client.dashboard)
  }

  private async navigateTo(link: Locator, url: string | RegExp) {
    await link.click()
    await this.page.waitForURL(url, { timeout: NAVIGATION_TIMEOUT })
  }

  async navigateToWorkshops() {
    await this.navigateTo(this.workshopsLink, userRoutes.client.workshops)
  }

  async navigateToBookings() {
    await this.navigateTo(this.bookingsLink, userRoutes.client.bookings)
  }
}

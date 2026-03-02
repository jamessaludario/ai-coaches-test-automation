import { BasePage } from '../base.page'
import { dashboardContent, userRoutes } from '../../constants'
import { nuxtGoto } from '../../helpers'

const NAVIGATION_TIMEOUT = 10000

export class CoachDashboardPage extends BasePage {
  get dashboardHeading() { return this.page.getByRole('heading', { name: dashboardContent.coach.heading }) }
  get workshopsLink() { return this.page.getByRole('link', { name: dashboardContent.coach.navigation.workshops.text, exact: true }) }
  get workshopsHeading() { return this.page.getByRole('heading', { name: dashboardContent.coach.navigation.workshops.text, exact: true }) }
  get bookingsLink() { return this.page.getByRole('link', { name: dashboardContent.coach.navigation.bookings.text, exact: true }) }
  get bookingsHeading() { return this.page.getByRole('heading', { name: dashboardContent.coach.navigation.bookings.text, exact: true }) }
  get accountLink() { return this.page.getByRole('link', { name: dashboardContent.coach.navigation.account.text }) }
  get upcomingSessionsHeading() { return this.page.locator('h2').filter({ hasText: dashboardContent.coach.sections.upcomingSessions }) }
  get recentBookingsHeading() { return this.page.locator('h2').filter({ hasText: dashboardContent.coach.sections.recentBookings }) }
  get metricsValues() { return this.page.locator('p.text-2xl.font-bold').all() }

  async goto() {
    await nuxtGoto(this.page, userRoutes.coach.dashboard)
  }

  async navigateToWorkshops() {
    await this.workshopsLink.click()
    await this.page.waitForURL(userRoutes.coach.workshops, { timeout: NAVIGATION_TIMEOUT })
  }

  async navigateToBookings() {
    await this.bookingsLink.click()
    await this.page.waitForURL(userRoutes.coach.bookings, { timeout: NAVIGATION_TIMEOUT })
  }

  async navigateToAccount() {
    await this.accountLink.click()
    await this.page.waitForURL(userRoutes.coach.account, { timeout: NAVIGATION_TIMEOUT })
  }
}

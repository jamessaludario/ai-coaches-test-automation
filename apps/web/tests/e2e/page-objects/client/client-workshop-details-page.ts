import { nuxtGoto } from '../../helpers'
import { BasePage } from '../../page-objects'

/**
 * Client Workshop Details Page Object
 *
 * Handles workshop details page interactions for clients.
 * For assertions, use helpers from `helpers/client-assertions.ts`
 */
export class ClientWorkshopDetailsPage extends BasePage {
  get overviewTab() {
    return this.page.getByRole('tab', { name: /overview/i })
  }

  get calendarTab() {
    return this.page.getByRole('tab', { name: /calendar/i })
  }

  get historyTab() {
    return this.page.getByRole('tab', { name: /history/i })
  }

  get bookingsTab() {
    return this.page.getByRole('tab', { name: /bookings/i })
  }

  get resourcesTab() {
    return this.page.getByRole('tab', { name: /resources/i })
  }

  get workshopTitle() {
    return this.page.getByRole('heading', { level: 1 })
  }

  get workshopDescription() {
    return this.page.locator('p, div').filter({ hasText: /description/i }).first()
  }

  get myBookingsMetric() {
    return this.page.getByText(/my.*bookings/i)
  }

  get availableSessionsMetric() {
    return this.page.getByText(/available.*sessions/i)
  }

  get totalSpentMetric() {
    return this.page.getByText(/total.*spent/i)
  }

  get sessionsCompletedMetric() {
    return this.page.getByText(/sessions.*completed/i)
  }

  get upcomingSessionsList() {
    return this.page.locator('div, section').filter({ hasText: /upcoming.*sessions/i })
  }

  get myBookingsList() {
    return this.page.locator('div, section').filter({ hasText: /my.*bookings/i })
  }

  async navigateToWorkshop(workshopId: string) {
    await nuxtGoto(this.page, `/b/workshops/${workshopId}`)
  }

  async navigateToCalendar() {
    await this.calendarTab.click()
    await this.page.waitForURL(/\/calendar$/, { timeout: 10000 })
  }

  async navigateToHistory() {
    await this.historyTab.click()
    await this.page.waitForURL(/\/history$/, { timeout: 10000 })
  }

  async navigateToBookings() {
    await this.bookingsTab.click()
    await this.page.waitForURL(/\/bookings$/, { timeout: 10000 })
  }

  async navigateToResources() {
    await this.resourcesTab.click()
    await this.page.waitForURL(/\/resources$/, { timeout: 10000 })
  }
}

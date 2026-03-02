import { timeouts } from '../../constants'
import { nuxtGoto } from '../../helpers'
import { BasePage } from '../base.page'

export class ClientWorkshopDetailPage extends BasePage {
  get overviewTab() { return this.page.getByRole('tab', { name: /overview/i }) }
  get calendarTab() { return this.page.getByRole('tab', { name: /calendar/i }) }
  get historyTab() { return this.page.getByRole('tab', { name: /history/i }) }
  get bookingsTab() { return this.page.getByRole('tab', { name: /bookings/i }) }
  get resourcesTab() { return this.page.getByRole('tab', { name: /resources/i }) }
  get workshopTitle() { return this.page.getByRole('heading', { level: 1 }) }
  get myBookingsMetric() { return this.page.getByText(/my.*bookings/i) }
  get availableSessionsMetric() { return this.page.getByText(/available.*sessions/i) }
  get totalSpentMetric() { return this.page.getByText(/total.*spent/i) }
  get sessionsCompletedMetric() { return this.page.getByText(/sessions.*completed/i) }

  async navigateToWorkshop(workshopId: string) {
    await nuxtGoto(this.page, `/b/workshops/${workshopId}`)
  }

  async navigateToCalendar() {
    await this.calendarTab.click()
    await this.page.waitForURL(/\/calendar$/, { timeout: timeouts.page.navigation })
  }

  async navigateToBookings() {
    await this.bookingsTab.click()
    await this.page.waitForURL(/\/bookings$/, { timeout: timeouts.page.navigation })
  }

  async navigateToResources() {
    await this.resourcesTab.click()
    await this.page.waitForURL(/\/resources$/, { timeout: timeouts.page.navigation })
  }
}

import { timeouts } from '../../constants'
import { BasePage } from '@layer-base/e2e/page-objects'

/**
 * Coach Workshop Details Page Object
 *
 * Handles workshop details page interactions for coaches.
 * For assertions, use helpers from `helpers/coach-assertions.ts`
 */
export class CoachWorkshopDetailsPage extends BasePage {
  get overviewTab() {
    return this.page.getByRole('tab', { name: /overview/i })
  }

  get calendarTab() {
    return this.page.getByRole('tab', { name: /calendar/i })
  }

  get historyTab() {
    return this.page.getByRole('tab', { name: /history/i })
  }

  get invoicesTab() {
    return this.page.getByRole('tab', { name: /invoices/i })
  }

  get payoutsTab() {
    return this.page.getByRole('tab', { name: /payouts/i })
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

  get totalSessionsMetric() {
    return this.page.getByText(/total.*sessions/i)
  }

  get totalParticipantsMetric() {
    return this.page.getByText(/total.*participants/i)
  }

  get totalBookingsMetric() {
    return this.page.getByText(/total.*bookings/i)
  }

  get totalRevenueMetric() {
    return this.page.getByText(/total.*revenue/i)
  }

  get recentSchedulesList() {
    return this.page.locator('div, section').filter({ hasText: /recent.*schedules/i })
  }

  get recentBookingsList() {
    return this.page.locator('div, section').filter({ hasText: /recent.*bookings/i })
  }

  async navigateToWorkshop(workshopId: string) {
    await this.page.goto(`/c/workshops/${workshopId}`)
    await this.page.waitForLoadState('networkidle')
  }

  async navigateToCalendar() {
    await this.calendarTab.click()
    await this.page.waitForURL(/\/calendar$/, { timeout: timeouts.page.navigation })
  }

  async navigateToHistory() {
    await this.historyTab.click()
    await this.page.waitForURL(/\/history$/, { timeout: timeouts.page.navigation })
  }

  async navigateToInvoices() {
    await this.invoicesTab.click()
    await this.page.waitForURL(/\/invoices$/, { timeout: timeouts.page.navigation })
  }

  async navigateToPayouts() {
    await this.payoutsTab.click()
    await this.page.waitForURL(/\/payouts$/, { timeout: timeouts.page.navigation })
  }

  async navigateToResources() {
    await this.resourcesTab.click()
    await this.page.waitForURL(/\/resources$/, { timeout: timeouts.page.navigation })
  }
}

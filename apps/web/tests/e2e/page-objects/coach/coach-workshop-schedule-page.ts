import { timeouts } from '../../constants'
import { nuxtGoto } from '../../helpers'
import { BasePage } from '../../page-objects'

/**
 * Coach Workshop Schedule Page Object
 *
 * Handles workshop schedule management interactions.
 * For assertions, use helpers from `helpers/coach-assertions.ts`
 */
export class CoachWorkshopSchedulePage extends BasePage {
  get pageHeading() {
    return this.page.getByRole('heading', { name: /workshop.*schedules|schedules/i })
  }

  get overviewTab() {
    return this.page.getByRole('tab', { name: /overview/i })
  }

  get bookingsTab() {
    return this.page.getByRole('tab', { name: /bookings/i })
  }

  get resourcesTab() {
    return this.page.getByRole('tab', { name: /resources/i })
  }

  get scheduleTitle() {
    return this.page.getByRole('heading', { level: 1 })
  }

  get totalSeatsBookedMetric() {
    return this.page.getByText(/total.*seats.*booked|seats.*booked/i)
  }

  get totalBookingsMetric() {
    return this.page.getByText(/total.*bookings/i)
  }

  get totalRevenueMetric() {
    return this.page.getByText(/total.*revenue/i)
  }

  get scheduleDetails() {
    return this.page.locator('div.card').filter({ hasText: /schedule.*details/i })
  }

  get capacityInfo() {
    return this.page.locator('div.card').filter({ hasText: /capacity|max.*participants|available.*seats/i })
  }

  get recentBookingsList() {
    return this.page.locator('div, section').filter({ hasText: /recent.*bookings/i })
  }

  get scheduledSessionsList() {
    return this.page.locator('div, section').filter({ hasText: /scheduled.*sessions/i })
  }

  get dataTable() {
    return this.page.getByRole('table')
  }

  get searchInput() {
    return this.page.getByRole('textbox', { name: /search/i }).first()
  }

  async gotoSchedulesList() {
    await nuxtGoto(this.page, '/c/workshop-schedules')
  }

  async navigateToSchedule(scheduleId: string) {
    await nuxtGoto(this.page, `/c/workshop-schedules/${scheduleId}`)
    await this.page.waitForLoadState('networkidle')
  }

  async navigateToBookings() {
    await this.bookingsTab.click()
    await this.page.waitForURL(/\/bookings$/, { timeout: 10000 })
  }

  async navigateToResources() {
    await this.resourcesTab.click()
    await this.page.waitForURL(/\/resources$/, { timeout: 10000 })
  }

  async searchSchedules(query: string, expectedResults = true) {
    await this.searchInput.fill(query)
    await this.page.keyboard.press('Enter')
    if (expectedResults)
      await this.page.getByRole('table').locator('tbody tr').first().waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
    else
      await this.page.waitForTimeout(timeouts.wait.short)
  }
}

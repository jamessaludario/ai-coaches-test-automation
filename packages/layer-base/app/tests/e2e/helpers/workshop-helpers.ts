import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { timeouts } from '../constants'
import { expectToastMessage } from './assertions'
import { waitForDataTableLoad } from './datatable-helpers'
import { selectDropdownOption } from './form-helpers'

/**
 * Workshop Test Data Interface
 */
export interface WorkshopFormData {
  title: string
  description: string
  segments?: ReadonlyArray<{ readonly title: string, readonly description: string }>
  modules?: ReadonlyArray<{ readonly title: string, readonly description: string }>
  price?: number
  minSeats?: number
  maxSeats?: number
}

/**
 * Fill and submit workshop creation form
 * Works in both admin and coach contexts
 */
export async function fillWorkshopForm(page: Page, workshopData: WorkshopFormData) {
  await page.getByLabel(/title|workshop title/i).fill(workshopData.title)
  await page.getByLabel(/description|workshop description/i).fill(workshopData.description)

  // Add segments if provided
  if (workshopData.segments && workshopData.segments.length > 0) {
    for (let i = 0; i < workshopData.segments.length; i++) {
      await expect(page.getByRole('button', { name: 'Add segment' })).toBeVisible({ timeout: timeouts.ui.elementVisible })
      await page.getByRole('button', { name: 'Add segment' }).click()
      const segment = workshopData.segments[i]!
      await page.locator(`input[name*="whoIsItFor.${i}.title"]`).fill(segment.title)
      await page.locator(`textarea[name*="whoIsItFor.${i}.description"]`).fill(segment.description)
    }
  }

  // Add modules if provided
  if (workshopData.modules && workshopData.modules.length > 0) {
    for (let i = 0; i < workshopData.modules.length; i++) {
      await expect(page.getByRole('button', { name: 'Add module' })).toBeVisible({ timeout: timeouts.ui.elementVisible })
      await page.getByRole('button', { name: 'Add module' }).click()
      const module = workshopData.modules[i]!
      await page.locator(`input[name*="whatYouWillMaster.${i}.title"]`).fill(module.title)
      await page.locator(`textarea[name*="whatYouWillMaster.${i}.description"]`).fill(module.description)
    }
  }

  // Fill pricing if provided
  if (workshopData.price !== undefined) {
    await page.getByRole('spinbutton', { name: 'Price / seat' }).fill(workshopData.price.toString())
  }
  if (workshopData.minSeats !== undefined) {
    await page.getByRole('spinbutton', { name: 'Min. Seats' }).fill(workshopData.minSeats.toString())
  }
  if (workshopData.maxSeats !== undefined) {
    await page.getByRole('spinbutton', { name: 'Max. Seats' }).fill(workshopData.maxSeats.toString())
  }

  // Submit form
  await page.getByRole('button', { name: /create workshop|submit|save/i }).click()
  await expectToastMessage(page, /workshop created/i)
}

/**
 * Search for workshop in data table
 */
export async function searchWorkshopInTable(page: Page, workshopTitle: string): Promise<boolean> {
  const searchBox = page.getByPlaceholder(/search/i)
  await expect(searchBox).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await searchBox.fill(workshopTitle)
  await page.keyboard.press('Enter')
  await page.locator('table').or(page.getByRole('status')).first().waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })

  try {
    await page.getByText(workshopTitle).first().waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
    return true
  }
  catch {
    return false
  }
}

// ... existing code ...
export async function openWorkshopDialog(page: Page) {
  await page.getByRole('button', { name: /new/i }).click()
  await page.getByRole('dialog', { name: /create a workshop/i }).waitFor({ state: 'visible', timeout: timeouts.ui.modalOpen })
}

export interface ResourceData {
  title: string
  description?: string
  type?: string
  url?: string
}

/**
 * Navigate to resources tab
 */
export async function navigateToResourcesTab(page: Page): Promise<boolean> {
  try {
    const tab = page.getByRole('tab', { name: /resources/i })
    if (await tab.isVisible({ timeout: timeouts.ui.elementVisible })) {
      await tab.click()
      return true
    }
    return false
  }
  catch {
    return false
  }
}

/**
 * Navigate to coach workshops page
 */
export async function navigateToCoachWorkshops(page: Page) {
  await page.getByRole('link', { name: 'Workshops', exact: true }).click()
  await page.waitForLoadState('networkidle')
}

/**
 * Navigate to calendar tab
 */
export async function navigateToCalendarTab(page: Page) {
  const tab = page.getByRole('tab', { name: /calendar/i })
  await tab.waitFor({ state: 'visible' })
  await tab.click()
  await page.waitForURL(/\/calendar$/, { timeout: timeouts.page.pageLoad })
  await page.waitForLoadState('networkidle')
}

/**
 * Open new schedule dialog
 */
export async function openNewScheduleDialog(page: Page) {
  await page.getByRole('button', { name: /new|add/i }).click()
  await page.getByRole('dialog', { name: /schedule.*workshop/i }).waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
}

/**
 * Create a new workshop resource
 */
export async function createResource(page: Page, resourceData: ResourceData) {
  await page.getByLabel(/title/i).fill(resourceData.title)
  if (resourceData.description) {
    await page.getByLabel(/description/i).fill(resourceData.description)
  }
  if (resourceData.url) {
    await page.getByLabel(/url/i).fill(resourceData.url)
  }
  if (resourceData.type) {
    await page.getByRole('combobox', { name: /type/i }).click()
    await page.getByRole('option', { name: resourceData.type }).click()
  }

  const visibleCheckbox = page.getByRole('checkbox', { name: 'Visible' });
  await expect(visibleCheckbox).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await visibleCheckbox.check();

  await page.getByRole('button', { name: /save|create/i }).click()
  await expectToastMessage(page, /success|created|saved/i)
}

/**
 * Search and select workshop (Coach/User View)
 */
export async function searchAndSelectWorkshop(page: Page, title: string) {
  const searchBox = page.getByPlaceholder(/search/i)
  await expect(searchBox).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await searchBox.fill(title)
  await waitForDataTableLoad(page, title)
  await page.getByText(title).first().click()
  await page.waitForLoadState('networkidle')
}

/**
 * Create a schedule for a workshop
 */
export interface ScheduleData {
  daysOffset?: number
  duration?: number
  startDate?: Date
  endDate?: Date
  country?: string
  level?: string
  status?: string
  visibility?: string
  mode?: string
}

/**
 * Create a schedule for a workshop
 */
export async function createSchedule(page: Page, data: ScheduleData = {}): Promise<Date> {
  const now = new Date()
  let start = data.startDate
  let end = data.endDate

  if (!start) {
    start = new Date(now)
    start.setDate(now.getDate() + (data.daysOffset ?? 1))
    start.setMinutes(0, 0, 0)
  }

  if (!end) {
    end = new Date(start)
    end.setHours(start.getHours() + (data.duration ?? 1))
  }

  const formatDateTimeLocal = (date: Date) => {
    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - (offset * 60 * 1000))
    return localDate.toISOString().slice(0, 16)
  }

  const startValue = formatDateTimeLocal(start)
  const endValue = formatDateTimeLocal(end)

  const startDateInput = page.locator('input[type="datetime-local"]').first()
  await expect(startDateInput).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await startDateInput.fill(startValue)

  const endDateInput = page.locator('input[type="datetime-local"]').nth(1)
  await expect(endDateInput).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await endDateInput.fill(endValue)

  if (data.country) {
    await selectDropdownOption(page, /country/i, data.country)
  }
  if (data.level) {
    await selectDropdownOption(page, /level/i, data.level)
  }
  if (data.status) {
    await selectDropdownOption(page, /status/i, data.status)
  }
  if (data.visibility) {
    await selectDropdownOption(page, /visibility/i, data.visibility)
  }
  if (data.mode) {
    await selectDropdownOption(page, /mode/i, data.mode)
  }

  await page.getByRole('button', { name: /save|schedule|create/i }).click()
  await expectToastMessage(page, /schedule created/i)

  return start
}

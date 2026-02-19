import type { Page } from 'playwright'
import { clickRowAction, getFirstDataTableCellText } from '../helpers'
import { escapeRegExp } from '../utils'

/**
 * Table Navigation Helper Functions
 *
 * Functions for navigating to and interacting with data table rows
 */

/**
 * Private helper function to navigate to first row
 * Used internally by other table navigation functions
 */
async function navigateToFirstRow(
  page: Page,
  urlPattern: string | RegExp,
  clickAction: () => Promise<void>,
): Promise<string | null> {
  const dataTable = page.getByRole('table')
  const hasTable = await dataTable.isVisible().catch(() => false)

  if (!hasTable) {
    return null
  }

  const rows = dataTable.locator('tbody tr')
  const rowCount = await rows.count()

  if (rowCount === 0) {
    return null
  }

  await clickAction()
  await page.waitForURL(urlPattern, { timeout: 10000 })

  const url = page.url()
  const match = url.match(urlPattern)

  return match?.[1] ?? null
}

export async function navigateToFirstTableRow(
  page: Page,
  urlPattern: string | RegExp,
): Promise<string | null> {
  return navigateToFirstRow(page, urlPattern, async () => {
    const firstRowText = await getFirstDataTableCellText(page, 1)

    if (!firstRowText) {
      throw new Error('No row text found')
    }

    await page.getByRole('link', { name: new RegExp(escapeRegExp(firstRowText), 'i') }).first().click()
  })
}

export async function clickFirstTableRow(
  page: Page,
  urlPattern: string | RegExp,
): Promise<string | null> {
  return navigateToFirstRow(page, urlPattern, async () => {
    const dataTable = page.getByRole('table')
    const rows = dataTable.locator('tbody tr')
    await rows.first().click()
  })
}

export async function clickFirstTableRowAction(
  page: Page,
  actionName: 'view' | 'edit' | 'delete' | 'manage',
  urlPattern: string | RegExp,
): Promise<string | null> {
  return navigateToFirstRow(page, urlPattern, async () => {
    const firstRowText = await getFirstDataTableCellText(page, 1)

    if (!firstRowText) {
      throw new Error('No row text found')
    }

    await clickRowAction(page, new RegExp(escapeRegExp(firstRowText), 'i'), actionName)
  })
}

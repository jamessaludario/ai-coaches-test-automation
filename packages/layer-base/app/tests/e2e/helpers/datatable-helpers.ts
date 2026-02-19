import type { Page } from 'playwright'
import { sharedAdminSelectors, timeouts } from '../constants'
import { expect } from '../fixtures'

function tableOrStatus(page: Page) {
  return page.locator('table').or(page.getByRole('status')).first()
}

/**
 * Wait for data table to load, optionally filtering by search query
 */
export async function waitForDataTableLoad(page: Page, searchQuery?: string) {
  await page.waitForLoadState('networkidle')
  const emptyState = page.getByText(/No .* found|No results|No data/i)

  if (searchQuery) {
    const startTime = Date.now()
    const timeout = timeouts.api.dataTableLoad

    while (Date.now() - startTime < timeout) {
      const isEmptyVisible = await emptyState.isVisible().catch(() => false)
      if (isEmptyVisible) {
        return
      }

      const rows = page.locator('tbody tr')
      const rowCount = await rows.count()

      if (rowCount > 0) {
        const lastRow = rows.last()
        const lastRowText = await lastRow.textContent().catch(() => '')

        if (lastRowText && lastRowText.toLowerCase().includes(searchQuery.toLowerCase())) {
          await page.waitForTimeout(500)
          return
        }
      }

      await page.waitForTimeout(300)
    }

    throw new Error(`Timeout waiting for data table to load with search query: "${searchQuery}"`)
  }
  else {
    // Default wait for standard navigation/load
    await page.waitForLoadState('networkidle')
    await Promise.any([
      tableOrStatus(page).waitFor({ state: 'visible', timeout: timeouts.api.dataTableLoad }),
      emptyState.waitFor({ state: 'visible', timeout: timeouts.api.dataTableLoad }),
    ])
  }
}

/**
 * Search in data table using the search input field
 */
export async function searchDataTable(page: Page, query: string) {
  const searchInput = page.getByRole('textbox', { name: sharedAdminSelectors.dataTable.searchInput })
    .or(page.getByPlaceholder(sharedAdminSelectors.dataTable.searchInput))
    .first()

  await searchInput.clear()
  await searchInput.fill(query)
  await page.keyboard.press('Enter')

  await waitForDataTableLoad(page, query)
}

export async function getFirstDataTableCellText(page: Page, columnIndex: number = 0): Promise<string | null> {
  const firstRowCell = page.locator('tbody tr').first().locator('td').nth(columnIndex)
  const emptyState = page.getByText(/No .* found|No results|No data/i)

  await Promise.race([
    expect(firstRowCell).toBeVisible({ timeout: timeouts.ui.elementVisible }).catch(() => { }),
    expect(emptyState).toBeVisible({ timeout: timeouts.ui.elementVisible }).catch(() => { }),
  ])

  const isEmpty = await emptyState.isVisible()
  if (isEmpty) {
    return null
  }

  const isVisible = await firstRowCell.isVisible()
  if (isVisible) {
    return await firstRowCell.textContent()
  }

  return null
}

export async function clickRowAction(
  page: Page,
  rowIdentifier: string | RegExp,
  action: 'view' | 'edit' | 'delete' | 'manage',
) {
  const row = page.getByRole('row').filter({ hasText: rowIdentifier }).first()
  await expect(row).toBeVisible({ timeout: timeouts.ui.elementVisible })

  const ellipsisButton = row.locator('button.dropdown-menu-trigger')
  await ellipsisButton.click()

  const actionButton = page.getByRole('menuitem', { name: new RegExp(action, 'i') })
  await expect(actionButton).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await actionButton.click()
}

export async function clickRowLink(page: Page, rowIdentifier: string | RegExp) {
  const row = page.getByRole('row').filter({ hasText: rowIdentifier }).first()
  await expect(row).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await row.getByRole('link').first().click()
}

/**
 * Get the total number of rows in the current table view
 */
export async function getTableRowCount(page: Page, tableSelector: string = 'table'): Promise<number> {
  const table = page.locator(tableSelector).first()
  if (await table.count() === 0)
    return 0
  const rows = table.locator('tbody tr')
  const count = await rows.count()
  // Handle case where there might be a "No data" row
  if (count === 1 && await rows.first().locator('td').count() === 1) {
    const text = await rows.first().textContent()
    if (text?.toLowerCase().includes('no data') || text?.toLowerCase().includes('empty')) {
      return 0
    }
  }
  return count
}

/**
 * Navigate to a specific page using pagination buttons
 */
export async function goToPage(page: Page, pageNumber: number) {
  await page.getByRole('button', { name: String(pageNumber) }).click()
  await tableOrStatus(page).waitFor({ state: 'visible', timeout: timeouts.api.dataTableLoad })
}

/**
 * Sort a table by clicking on a column header
 */
export async function sortByColumn(page: Page, columnName: string | RegExp) {
  await page.getByRole('columnheader', { name: columnName }).click()
  await tableOrStatus(page).waitFor({ state: 'visible', timeout: timeouts.api.dataTableLoad })
}

/**
 * Check if the table is empty
 */
export async function isTableEmpty(page: Page, tableSelector: string = 'table'): Promise<boolean> {
  const table = page.locator(tableSelector).first()
  if (await table.count() === 0)
    return true

  const emptyState = table.locator('.table-empty')
  return (await emptyState.count()) > 0
}

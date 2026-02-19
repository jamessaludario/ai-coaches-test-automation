/**
 * Shared Test Data Constants
 *
 * Reusable test data for workshops, resources, and schedules
 * Used across admin, web, and lifecycle integration tests
 */

import * as process from 'node:process'
import { getTimestamp } from '../utils'

const TIMESTAMP = getTimestamp()
const UNIQUE_TIMESTAMP = `${TIMESTAMP}-${Date.now()}`

/**
 * Workshop test data
 * Used for creating test workshops across all test suites
 */
export const WORKSHOP_DATA = {
  title: `QA Workshop - ${UNIQUE_TIMESTAMP}`,
  description: `Sample QA Workshop - ${UNIQUE_TIMESTAMP}`,
  segments: [
    {
      title: 'Software Testers',
      description: 'Able to test workshop',
    },
  ],
  modules: [
    {
      title: 'Software Testing',
      description: 'Software Testing process',
    },
  ],
  price: 1,
  minSeats: 1,
  maxSeats: 1000,
} as const

/**
 * Segment test data
 * Individual segment for workshop creation
 */
export const SEGMENT_DATA = {
  title: 'Software Testers',
  description: 'Able to test workshop',
} as const

/**
 * Module test data
 * Individual module for workshop creation
 */
export const MODULE_DATA = {
  title: 'Software Testing',
  description: 'Software Testing process',
} as const

/**
 * Resource test data
 * Used for adding resources to workshops
 */
export const RESOURCE_DATA = {
  title: 'Sales Automation Bundle',
  description: 'Bundle for Sales Automation',
  type: 'Bundle',
  get url() {
    const bundleUrl = process.env.TEST_BUNDLE_URL
    if (!bundleUrl) {
      throw new Error('Missing required environment variable: TEST_BUNDLE_URL. Please set a valid test bundle URL.')
    }
    return bundleUrl
  },
}

/**
 * Schedule test data
 * Configuration for creating workshop schedules
 */
export const SCHEDULE_DATA = {
  daysOffset: 7,
  duration: 1, // hours
  country: 'Philippines',
  level: 'Beginner' as const,
  status: 'Published' as const,
  visibility: 'Public' as const,
  mode: 'Online' as const,
} as const

export const BOOKING_DATA = {
  unitNumber: '10',
  addressLine1: '123 Main St',
  addressLine2: 'Apt 4B',
  city: 'Cebu City',
  state: 'Cebu',
  zip: '6000',
  country: 'Philippines',
  numberOfSeats: 10,
}

export const PAYMENT_DATA = {
  validCard: {
    number: '4242 4242 4242 4242',
    expiry: '12/31',
    cvc: '999',
  },
  declinedCard: {
    number: '4000 0000 0000 0002',
    expiry: '12/31',
    cvc: '999',
  },
} as const

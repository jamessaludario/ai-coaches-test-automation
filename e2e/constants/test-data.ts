import * as process from 'node:process'
import { getTimestamp } from '../helpers/date.helper'

const TIMESTAMP = getTimestamp()
const UNIQUE_TIMESTAMP = `${TIMESTAMP}-${Date.now()}`

export interface WorkshopData {
  name: string
  description: string
  mode: 'Online' | 'In-Person' | 'Hybrid'
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: number
}

export interface ScheduleData {
  startDate: Date
  endDate: Date
  startTime?: string
  endTime?: string
  country?: string
  visibility?: 'Public' | 'Private' | 'Unlisted'
  mode?: 'Online' | 'In-Person' | 'Hybrid'
  level?: 'Beginner' | 'Intermediate' | 'Advanced'
  status?: 'Published' | 'Draft' | 'Active'
}

export interface AddressData {
  unitNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zip: string
}

export interface ScheduleReference {
  date: string
  time: string
  mode?: string
  level?: string
}

export interface AdminUserData {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  phoneNumber?: string
  country?: string
  headline?: string
  bio?: string
  role?: 'admin' | 'coach' | 'client'
}

export type AdminUserDataDynamic = AdminUserData & { [key: string]: string | undefined }

export interface BookingData {
  workshopId: string
  userId: string
  seats: number
  status: 'pending' | 'confirmed' | 'cancelled'
}

export interface VoucherData {
  code: string
  discount: number
  type: 'Percentage' | 'Fixed Amount'
  maxUses?: number
  expiresAt?: string
}

export interface RoleData {
  name: string
  description: string
  permissions: string[]
}

const baseWorkshopData = {
  name: process.env.TEST_WORKSHOP_NAME || 'AI Agent Mastery for Sales',
  description: 'Equip sales teams with AI tools to automate prospecting and improve forecasting.',
  level: 'Beginner' as const,
  price: 189,
}

export const defaultWorkshop: WorkshopData = {
  ...baseWorkshopData,
  mode: 'Online',
}

export const workshops = {
  online: { ...baseWorkshopData, mode: 'Online' as const, textLocator: 'online' },
  inPerson: { ...baseWorkshopData, mode: 'In-Person' as const, textLocator: 'in-person' },
  hybrid: { ...baseWorkshopData, mode: 'Hybrid' as const, textLocator: 'hybrid' },
} as const

export const schedules = {
  immediate: { daysFromNow: 1, duration: 1, mode: 'Online', level: 'Beginner', status: 'Published' },
  nextWeek: { daysFromNow: 7, duration: 1, mode: 'In-Person', level: 'Intermediate', status: 'Published' },
  nextMonth: { daysFromNow: 30, duration: 1, mode: 'Hybrid', level: 'Advanced', status: 'Published' },
} as const

export const defaultAddress: AddressData = {
  unitNumber: '10',
  addressLine1: '123 Main St',
  addressLine2: 'Apt 4B',
  city: 'Cebu City',
  state: 'Cebu',
  zip: '6000',
}

export const addresses = {
  philippines: { unitNumber: '10', addressLine1: '123 Ayala Ave', addressLine2: 'Unit 5A', city: 'Makati', state: 'Metro Manila', zip: '1200' },
  usa: { unitNumber: '500', addressLine1: '123 Market Street', addressLine2: 'Suite 200', city: 'San Francisco', state: 'California', zip: '94103' },
} as const

export const paymentData = {
  validCard: { number: '4242 4242 4242 4242', expiry: '12/34', cvc: '999' },
  declinedCard: { number: '4000 0000 0000 0002', expiry: '12/34', cvc: '999' },
} as const

export const coaches = {
  default: {
    name: process.env.TEST_COACH_NAME || 'QA Tester',
    location: 'Philippines',
  },
} as const

export const workshopScheduleContent = {
  workshopSearchPlaceholder: /AI Workshop \(e.g. How To/i,
  workshopListHeading: /AI Workshops/i,
  workshopLocationPlaceholder: /Anywhere/i,
  learnMoreButton: /Learn more/i,
  noWorkshopsFound: 'No workshops found.',
} as const

export const workshopContent = {
  details: {
    bookButton: 'Book for your Business',
    bookNowButton: 'Book Now',
    shareButton: 'Share Workshop',
    backButton: 'Back to Workshops',
    browseSchedules: 'Browse All Schedules',
    scheduleRequestButton: 'Request a Schedule',
    priceText: '$',
    sections: [
      'Who is this workshop for?',
      'What You\'ll Master',
      'Available Schedules',
    ],
  },
  schedule: {
    bookButton: 'Book for your Business',
    shareButton: 'Share Workshop',
    spotText: 'Spots Available',
    sections: [
      'Who is this workshop for?',
      'What You\'ll Master',
      'Meet Your AI Coach',
    ],
    badges: ['Target Audience', 'Learning Outcomes', 'Expert Instructor'],
  },
} as const

export const bookingContent = {
  steps: [
    'You are booking for workshop:',
    'Review & Select Seats',
    'Payment Details',
    'Booking Confirmation',
  ],
  reviewSection: [
    'Schedule',
    'Location',
    'Select Seats',
    'Promo Code',
    'Booking Summary',
    'Total Amount',
  ],
  buttons: {
    continueToPayment: 'Continue to Payment',
    previousStep: 'Previous',
    manageBooking: 'Manage Booking',
    downloadInvoice: 'Download Invoice',
  },
  paymentSection: {
    heading: 'Payment Information',
    summary: 'Order Summary',
  },
  confirmation: {
    heading: 'Booking confirmed',
    paymentStatus: /^Payment (received|complete)$/i,
    bookingId: /ID: \d+/i,
    manageButton: 'Manage Booking',
    downloadButton: 'Download Invoice',
  },
} as const

export const exploreWorkshopsContent = {
  searchPlaceholder: /Search workshops/i,
  workshopListHeading: /Available Workshops/i,
} as const

export const SCHEDULE_EVENT_SELECTOR = '.hover-card-trigger'
export const WORKSHOP_CARD_SELECTOR = '.card.relative, .card'

/** Shared workshop data for lifecycle tests */
export const WORKSHOP_DATA = {
  title: `QA Workshop - ${UNIQUE_TIMESTAMP}`,
  description: `Sample QA Workshop - ${UNIQUE_TIMESTAMP}`,
  segments: [{ title: 'Software Testers', description: 'Able to test workshop' }],
  modules: [{ title: 'Software Testing', description: 'Software Testing process' }],
  price: 1,
  minSeats: 1,
  maxSeats: 1000,
} as const

export const SEGMENT_DATA = { title: 'Software Testers', description: 'Able to test workshop' } as const
export const MODULE_DATA = { title: 'Software Testing', description: 'Software Testing process' } as const

export const RESOURCE_DATA = {
  title: 'Sales Automation Bundle',
  description: 'Bundle for Sales Automation',
  type: 'Bundle',
  get url() {
    const bundleUrl = process.env.TEST_BUNDLE_URL
    if (!bundleUrl) {
      throw new Error('Missing required environment variable: TEST_BUNDLE_URL.')
    }
    return bundleUrl
  },
}

export const SCHEDULE_DATA = {
  daysOffset: 7,
  duration: 1,
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
  validCard: { number: '4242 4242 4242 4242', expiry: '12/31', cvc: '999' },
  declinedCard: { number: '4000 0000 0000 0002', expiry: '12/31', cvc: '999' },
} as const

export const adminUserFixtures = {
  newCoach: {
    firstName: `Test_${TIMESTAMP}`,
    lastName: `Coach_${TIMESTAMP}`,
    email: `test-coach-${TIMESTAMP}@example.com`,
    username: `coach_${TIMESTAMP}`,
    password: `Password!${TIMESTAMP}`,
  },
  newClient: {
    firstName: `Test_${TIMESTAMP}`,
    lastName: `Client_${TIMESTAMP}`,
    email: `test-client-${TIMESTAMP}@example.com`,
    username: `client_${TIMESTAMP}`,
    password: `Password!${TIMESTAMP}`,
  },
  newAdmin: {
    firstName: `Test_${TIMESTAMP}`,
    lastName: `Admin_${TIMESTAMP}`,
    email: `test-admin-${TIMESTAMP}@example.com`,
    username: `admin_${TIMESTAMP}`,
    password: `Password!${TIMESTAMP}`,
  },
  newUser: {
    firstName: `Test_${TIMESTAMP}`,
    lastName: `User_${TIMESTAMP}`,
    email: `test-user-${TIMESTAMP}@example.com`,
    username: `user_${TIMESTAMP}`,
    password: `Password!${TIMESTAMP}`,
  },
} as const

export const bookingFixtures: readonly BookingData[] = [
  { workshopId: 'workshop-123', userId: 'user-456', seats: 2, status: 'pending' },
  { workshopId: 'workshop-789', userId: 'user-012', seats: 1, status: 'confirmed' },
  { workshopId: 'workshop-345', userId: 'user-678', seats: 3, status: 'cancelled' },
] as const

export const workshopFixtures = {
  basic: {
    title: `Introduction to AI ${TIMESTAMP}`,
    description: 'Learn the basics of AI and machine learning',
    duration: 60,
    price: 99.99,
    maxParticipants: 20,
  },
  advanced: {
    title: `Advanced Machine Learning ${TIMESTAMP}`,
    description: 'Deep dive into ML algorithms',
    duration: 120,
    price: 199.99,
    maxParticipants: 15,
  },
} as const

export const voucherFixtures = {
  percentage: { code: `PERCENT_${TIMESTAMP}`, discount: 20, type: 'Percentage', maxUses: 100 },
  fixed: { code: `FIXED_${TIMESTAMP}`, discount: 50, type: 'Fixed Amount', maxUses: 50 },
} as const

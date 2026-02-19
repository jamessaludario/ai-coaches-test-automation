import { getTimestamp } from '../utils'

const TIMESTAMP = getTimestamp()

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

export interface WorkshopData {
  title: string
  description: string
  duration: number
  price: number
  maxParticipants: number
}

export interface BookingData {
  workshopId: string
  userId: string
  seats: number
  status: 'pending' | 'confirmed' | 'cancelled'
}

// Sample booking data
export const bookingFixtures: readonly BookingData[] = [
  {
    workshopId: 'workshop-123',
    userId: 'user-456',
    seats: 2,
    status: 'pending',
  },
  {
    workshopId: 'workshop-789',
    userId: 'user-012',
    seats: 1,
    status: 'confirmed',
  },
  {
    workshopId: 'workshop-345',
    userId: 'user-678',
    seats: 3,
    status: 'cancelled',
  },
] as const

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

// Sample admin user data for testing
export const adminUserFixtures: {
  newCoach: AdminUserDataDynamic
  newClient: AdminUserDataDynamic
  newAdmin: AdminUserDataDynamic
  newUser: AdminUserDataDynamic
} = {
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

// Sample workshop data
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

// Sample voucher data
export const voucherFixtures = {
  percentage: {
    code: `PERCENT_${TIMESTAMP}`,
    discount: 20,
    type: 'Percentage',
    maxUses: 100,
  },

  fixed: {
    code: `FIXED_${TIMESTAMP}`,
    discount: 50,
    type: 'Fixed Amount',
    maxUses: 50,
  },
} as const

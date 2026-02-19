/**
 * Dashboard content expectations
 */
export const dashboardContent = {
  coach: {
    heading: /Dashboard/i,
    welcomeMessage: /Dashboard|Welcome/i,
    metrics: [
      /Total Workshops/i,
      /Upcoming Sessions?/i,
      /Total Revenue/i,
      /Clients Taught/i,
      /Completed Sessions/i,
      /Pending Bookings/i,
    ],
    sections: {
      upcomingSessions: /Upcoming.*Sessions?/i,
      recentBookings: /Recent.*Bookings?/i,
    },
    accountProfileSections: {
      introductionVideo: /Introduction Video/i,
      avatar: /Avatar/i,
      displayName: /Display Name/i,
      headline: /Headline/i,
      bio: /Bio/i,
      certifications: /Certifications/i,
      experience: /Experience/i,
      specializations: /Specializations/i,
      socialPlatforms: /Social Platforms/i,
      username: /Username/i,
      email: /Email/i,
      phoneNumber: /Phone Number/i,
      country: /Country/i,
    },
    emptyStates: {
      noSessions: /No upcoming sessions|Schedule.*workshop/i,
      noBookings: /No bookings|No recent bookings/i,
    },
    navigation: {
      workshops: { text: 'Workshops', url: /\/c\/workshops/ },
      bookings: { text: 'Bookings', url: /\/c\/bookings/ },
      account: { text: 'Profile', url: /\/c\/account\/profile/ },
    },
  },

  client: {
    heading: 'Dashboard',
    welcomeMessage: /Welcome back/i,
    metrics: [
      /Upcoming.*Sessions?/i,
      /Completed.*Workshops?/i,
      /Total.*Bookings?/i,
      /Total.*Invested/i,
    ],
    workshopMetrics: [
      /my.*bookings/i,
      /available.*sessions/i,
      /total.*spent/i,
      /sessions.*completed/i,
    ],
    elements: [
      /Upcoming.*Sessions?/i,
      /Bookings?/i,
      /Workshops?/i,
    ],
    navigation: {
      workshops: { text: 'Workshops', url: /\/b\/workshops/ },
      bookings: { text: 'Bookings', url: /\/b\/bookings/ },
    },
  },
} as const

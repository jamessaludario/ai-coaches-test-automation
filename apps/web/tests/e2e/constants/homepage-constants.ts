export const homePageContent = {
  hero: {
    mainHeading: /World's #1/i,
    tagline: 'Upskill, Accelerate, Outpace',
    badges: ['Workshops', 'Coaching', 'Consulting'],
    workshopTitle: /AI MASTERY FOR BUSINESS/i,
    workshopSubtitle: /One-Day Hands-On Workshop/i,
  },

  hostedBy: {
    text: /Hosted by Certified AI Coaches/i,
    poweredBy: /Powered By:/i,
  },

  workshopRequirements: [
    /Minimum \d+ Attendees/i,
    /Attendees must bring laptops/i,
    /Room must have a large screen for the presenter/i,
    /Internet Access/i,
  ],

  homepageSections: {
    gameChanger: {
      heading: /Why This Workshop is a Game-Changer/i,
      text: /not another AI.*talking head.*event/i,
      text2: /full-day interactive/i,
    },
    whatYoullMaster: {
      heading: /Here['\u2019]s What You['\u2019]ll Master/i,
      pillars: [
        { name: 'Marketing', value: /Save.*\$20,000/i },
        { name: 'Sales', value: /Lift close rates/i },
        { name: 'Customer Service', value: /Reduce ticket resolution time by 70%/i },
        { name: 'Operations', value: /Create clarity and scale/i },
        { name: 'Talent & HR', value: /Cut time-to-hire in half/i },
        { name: 'Finance', value: /Make smarter decisions/i },
      ],
      aicommandRoom: {
        heading: /AI Command Room/i,
        text: /convert every idea or challenge/i,
      },
    },
    whoShouldAttend: {
      heading: /Who Should Attend/i,
      numberOfEmployees: /50 to 2,000 employees/i,
      benefits: [
        { name: 'Scale without burning out', value: /Scale without burning out their teams/i },
        { name: 'Future-proof their operations', value: /Future-proof their operations/i },
        { name: 'Drive real business outcomes', value: /Drive real business outcomes with AI/i },
        { name: 'hands-on experience', value: /Get hands-on experience building AI systems—no code required/i },
      ],
    },

    secureYourWorkshopDate: {
      heading: /Secure Your.*Workshop Date/i,
      text: /Dates are limited due to demand./i,
    },

    workshopOutcomes: {
      outcomes: [
        { name: 'Real AI agents built for your business', value: /Real AI agents built for your business/i },
        { name: 'Tools you can use again and again', value: /Tools you can use again and again/i },
        { name: 'A system to identify new AI opportunities', value: /A system to identify new AI opportunities/i },
        { name: 'Confidence to lead AI transformation in-house', value: /Confidence to lead AI transformation in-house/i },
      ],
    },
  },

  valueProps: {
    mainMessage: /What if your business could scale output/i,
    deliveryInfo: /Delivered In-House at your Company or selected location/i,
    coachInfo: /Run by Certified AI Coaches/i,
    sections: [
      /Why This Workshop is a Game-Changer/i,
      /Here['\u2019]s What You['\u2019]ll Master/i,
      /Who Should Attend/i,
      /Secure Your.*Workshop Date/i,
    ],
  },

  navigation: {
    findCoaches: { text: /Find AI Coaches/i, url: /consultants/ },
    workshops: { text: /Explore AI Workshops/i, url: /workshops/ },
    contact: { text: /Contact an AI Coach/i },
  },

  legal: [
    { name: 'Terms of Use', heading: /^Terms and Conditions/ },
    { name: 'Privacy', heading: /^Privacy Policy/ },
  ],
} as const

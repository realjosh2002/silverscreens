// Brand colors
export const COLORS = {
  goldAccent: '#D4AF37',
  goldHover: '#E5BF63',
  goldBorder: '#8A6A2F',
  bgPrimary: '#050505',
  bgSecondary: '#0B0F14',
  bgElevated: '#121821',
  textWhite: '#F5F5F5',
  textSecondary: '#A8B0BD',
  red: '#E53E3E',
}

// Talent categories with roles (from PRD)
export const TALENT_CATEGORIES = [
  { category: 'Direction', roles: ['Director', 'Assistant Director'] },
  {
    category: 'Production Office',
    roles: [
      'Line Producer', 'Production Assistant', 'Production Manager',
      'Asst. Production Manager', 'Unit Manager', 'Production Coordinator',
      'First Assistant Director', 'Second Assistant Director',
    ],
  },
  { category: 'Accounting', roles: ['Production Accountant'] },
  {
    category: 'Locations',
    roles: ['Location Manager', 'Asst. Location Manager', 'Location Scout', 'Location Assistant', 'Location Production Assistant'],
  },
  { category: 'Continuity', roles: ['Script Supervisor'] },
  { category: 'Casting', roles: ['Casting Director', 'Casting PA'] },
  {
    category: 'Camera & Lighting',
    roles: [
      'Director of photography', 'Camera operator', 'First Assistant Camera',
      'Second Assistant Camera', 'Film Loader', 'Digital Imaging Technician',
      'Motion Control Technician', 'Gaffer', 'Best Boy', 'Lighting Technician',
    ],
  },
  { category: 'Grip', roles: ['Key Grip', 'Best Boy', 'Dolly Grip', 'Grips', 'Sound Grip'] },
  { category: 'Sound', roles: ['Production Sound Mixer', 'Boom Operator', 'Second Assistant Sound'] },
  {
    category: 'Art',
    roles: ['Production Designer', 'Art Director', 'Standby Art Director', 'Assistant Art Director', 'Set Designer', 'Illustrator', 'Graphic Artist'],
  },
  { category: 'Sets', roles: ['Set Decorator', 'Buyer', 'Leadman', 'Set Dresser', 'Greensman'] },
  { category: 'Construction', roles: ['Construction coordinator', 'Head carpenter', 'Propmaker'] },
  { category: 'Scenic', roles: ['Key Scenic', 'Head of Plaster'] },
  { category: 'Property', roles: ['Propmaster', 'Weapons Master'] },
  {
    category: 'Costume',
    roles: ['Costume Designer', 'Costume Supervisor', 'Key Costumer', 'Costume Standby', 'Breakdown Artist', 'Costume Buyer', 'Cutter'],
  },
  {
    category: 'Hair & Make Up',
    roles: ['Key Make Up Artist', 'Special Make Up effects', 'Make Up Supervisor', 'Make Up Artist', 'Key Hair', 'Hair Stylist'],
  },
  { category: 'Special Effects', roles: ['Special Effects Supervisor', 'Special Effects Assistant'] },
  { category: 'Stunt', roles: ['Stunt Master', 'Stunt Coordinator'] },
  { category: 'Post Production', roles: ['Post Production Supervisor'] },
  { category: 'Editorial', roles: ['Film Editor', 'Negative Cutter', 'Colorist', 'Telecine Colorist'] },
  {
    category: 'Visual Effects',
    roles: ['Visual Effects Producer', 'VE Creative Director', 'VE Supervisor', 'VE Editor', 'Composer', 'Rotoscope Artist', 'Paint Artist', 'Matte Painter'],
  },
  {
    category: 'Sound & Music',
    roles: [
      'Sound Designer', 'Dialogue editor', 'Sound Editor', 'Re-Recording Mixer',
      'Music Supervisor', 'Music Composer / Director', 'Foley Artist',
      'Conductor / Orchestrator', 'Sound Recorder / Mixer', 'Music Preparation', 'Music Editor',
    ],
  },
  { category: 'Animation', roles: ['Animation Artist'] },
  { category: 'Electrical', roles: ['Electrician', 'Digital Intermediate Technician'] },
  {
    category: 'Acting',
    roles: ['Hero', 'Heroine', 'Villain', 'Comedian', 'Character Artist', 'Supporting Roles', 'Child Artist'],
  },
  { category: 'Story', roles: ['Story Writer'] },
  { category: 'Singing', roles: ['Singer'] },
  { category: 'Dancing', roles: ['Dancer'] },
  { category: 'Dubbing', roles: ['Dubbing Artist'] },
  { category: 'Television', roles: ['Anchoring', 'Newsreader', 'Talk show', 'Stage show', 'Drama', 'Production Crew'] },
  { category: 'Modelling', roles: ['Model', 'Advertisement'] },
  { category: 'Advertisement', roles: ['Advertisement'] },
  { category: 'Food', roles: ['Food Supplier / Caterer'] },
  { category: 'Transport', roles: ['Cab Service Provider', 'Caravan Service Provider'] },
  { category: 'Travels', roles: ['Ticketing Agents', 'Hotels'] },
  { category: 'Distributor', roles: ['Distributors'] },
]

export const LANGUAGES = [
  'Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi',
  'Gujarati', 'Punjabi', 'Odia', 'Assamese', 'Urdu', 'Bhojpuri', 'Rajasthani',
  'Haryanvi', 'Maithili', 'Sanskrit',
]

export const AVAILABILITY_OPTIONS = [
  'Films', 'Television', 'OTT', 'Web Series', 'Short Films', 'Advertisements',
  'Music Videos', 'Theatre', 'Modelling', 'Events', 'Live Shows', 'Voice Over',
  'Dubbing', 'Photography', 'Freelance Projects',
]

export const EXPERIENCE_LEVELS = ['Fresher', '1-2 Years', '3-5 Years', '5-10 Years', '10+ Years']

export const PROJECT_TYPES = [
  'Feature Film', 'Short Film', 'Web Series', 'OTT Series', 'Television Drama',
  'Television Show', 'Advertisement', 'Music Video', 'Documentary', 'Theatre',
  'Reality Show', 'Talk Show', 'Live Event', 'Corporate Film', 'Wedding Film',
]

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  aspirant: [
    {
      id: 'aspirant-basic',
      name: 'Spotlight',
      duration: 'quarterly',
      months: 3,
      price: 999,
      features: [
        'Up to 5 casting call applications/month',
        '10 profile images + 5 videos',
        'Basic profile visibility',
        'Email notifications',
        'Standard support',
      ],
    },
    {
      id: 'aspirant-pro',
      name: 'Stardom',
      duration: 'half-yearly',
      months: 6,
      price: 1799,
      recommended: true,
      features: [
        'Up to 20 casting call applications/month',
        '10 profile images + 5 videos',
        'Enhanced profile visibility',
        'Priority in search results',
        'Email + SMS notifications',
        'Priority support',
        'Profile analytics',
      ],
    },
    {
      id: 'aspirant-premium',
      name: 'Icon',
      duration: 'annual',
      months: 12,
      price: 2999,
      features: [
        'Unlimited casting call applications',
        '10 profile images + 5 videos',
        'Maximum profile visibility',
        'Top placement in search results',
        'Verified badge',
        'Email + SMS + WhatsApp notifications',
        'Dedicated support',
        'Advanced analytics',
        'Featured in landing page',
      ],
    },
  ],
  agency: [
    {
      id: 'agency-starter',
      name: 'Discovery',
      duration: 'quarterly',
      months: 3,
      price: 2999,
      features: [
        'Up to 5 active casting calls',
        'Access to verified talent pool',
        '50 talent profile views/month',
        'Basic messaging',
        'Standard support',
      ],
    },
    {
      id: 'agency-pro',
      name: 'Production',
      duration: 'half-yearly',
      months: 6,
      price: 5499,
      recommended: true,
      features: [
        'Up to 15 active casting calls',
        'Full talent pool access',
        'Unlimited profile views',
        'Advanced search filters',
        'Shortlisting tools',
        'Audition scheduling',
        'Priority support',
        'Performance analytics',
      ],
    },
    {
      id: 'agency-enterprise',
      name: 'Studio',
      duration: 'annual',
      months: 12,
      price: 9999,
      features: [
        'Unlimited active casting calls',
        'Full talent pool access',
        'Unlimited everything',
        'AI-powered talent matching',
        'Advanced analytics dashboard',
        'Dedicated account manager',
        'API access',
        'White-label options',
        'Featured agency badge',
      ],
    },
  ],
}

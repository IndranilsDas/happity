// Demo data for the Happity clone

export type Activity = {
  id: string
  name: string
  description: string
  category: string
  ageRange: string
  location: {
    address: string
    city: string
    postcode: string
  }
  provider: {
    id: string
    name: string
    image: string
  }
  price: string
  days: string[]
  times: string[]
  image: string
  featured?: boolean
}

export type Provider = {
  id: string
  name: string
  description: string
  image: string
  activities: number
  location: string
  rating: number
}

export type City = {
  name: string
  activityCount: number
}

// Demo activities
export const activities: Activity[] = [
  {
    id: "act1",
    name: "Baby Sensory Adventure",
    description:
      "A magical world of sensory experiences designed to stimulate your baby's senses and promote development through light, sound, textures, and movement.",
    category: "Baby Sensory",
    ageRange: "0-12 months",
    location: {
      address: "Community Center",
      city: "London",
      postcode: "E1 6AN",
    },
    provider: {
      id: "prov1",
      name: "Little Explorers",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    price: "£12 per session",
    days: ["Monday", "Wednesday"],
    times: ["10:00", "11:30"],
    image:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    featured: true,
  },
  {
    id: "act2",
    name: "Toddler Dance Party",
    description:
      "Fun-filled dance sessions for toddlers to develop coordination, rhythm, and social skills through music and movement.",
    category: "Dance",
    ageRange: "1-3 years",
    location: {
      address: "Dance Studio",
      city: "Manchester",
      postcode: "M1 2WD",
    },
    provider: {
      id: "prov2",
      name: "Tiny Dancers",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80",
    },
    price: "£8 per session",
    days: ["Tuesday", "Thursday"],
    times: ["09:30", "14:00"],
    image:
      "https://images.unsplash.com/photo-1502781252888-9143ba7f074e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
  },
  {
    id: "act3",
    name: "Mum & Baby Yoga",
    description:
      "Gentle yoga sessions designed for new mums and their babies, helping with postnatal recovery and bonding.",
    category: "Baby Yoga",
    ageRange: "0-12 months",
    location: {
      address: "Wellness Center",
      city: "Bristol",
      postcode: "BS1 5TY",
    },
    provider: {
      id: "prov3",
      name: "Peaceful Beginnings",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    price: "£15 per session",
    days: ["Monday", "Friday"],
    times: ["11:00", "13:30"],
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1520&q=80",
    featured: true,
  },
  {
    id: "act4",
    name: "Postnatal Fitness Class",
    description: "Safe and effective exercise classes for new mums to regain strength and fitness after childbirth.",
    category: "Postnatal Fitness",
    ageRange: "Mums with babies 0-12 months",
    location: {
      address: "Fitness Studio",
      city: "Edinburgh",
      postcode: "EH1 1TH",
    },
    provider: {
      id: "prov4",
      name: "Strong Mums",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    },
    price: "£10 per session",
    days: ["Wednesday", "Saturday"],
    times: ["10:00", "11:30"],
    image:
      "https://images.unsplash.com/photo-1518310952931-b1de897abd40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "act5",
    name: "Baby First Aid Workshop",
    description:
      "Essential first aid skills for parents and caregivers, covering choking, CPR, and common emergencies.",
    category: "Baby First Aid",
    ageRange: "Parents of children 0-5 years",
    location: {
      address: "Health Center",
      city: "Birmingham",
      postcode: "B1 1AA",
    },
    provider: {
      id: "prov5",
      name: "Safe Hands",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    price: "£45 per workshop",
    days: ["Saturday"],
    times: ["10:00", "14:00"],
    image:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "act6",
    name: "Toddler Sports Club",
    description:
      "Fun introduction to sports for toddlers, developing coordination, teamwork, and confidence through play.",
    category: "Sports",
    ageRange: "2-4 years",
    location: {
      address: "Sports Hall",
      city: "Leeds",
      postcode: "LS1 3AD",
    },
    provider: {
      id: "prov6",
      name: "Little Champions",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    },
    price: "£9 per session",
    days: ["Tuesday", "Thursday"],
    times: ["16:00", "17:00"],
    image:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "act7",
    name: "Sensory Play for SEND Children",
    description:
      "Inclusive sensory play sessions designed specifically for children with special educational needs and disabilities.",
    category: "SEND",
    ageRange: "0-5 years",
    location: {
      address: "Inclusive Learning Center",
      city: "Cardiff",
      postcode: "CF10 1EP",
    },
    provider: {
      id: "prov7",
      name: "Inclusive Play",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    },
    price: "£7 per session",
    days: ["Monday", "Wednesday", "Friday"],
    times: ["10:00", "13:00"],
    image:
      "https://images.unsplash.com/photo-1602030638412-bb8dcc0bc8b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  },
  {
    id: "act8",
    name: "Parent & Toddler Storytime",
    description: "Interactive storytelling sessions that bring books to life through props, music, and activities.",
    category: "Storytime",
    ageRange: "1-4 years",
    location: {
      address: "Library",
      city: "Oxford",
      postcode: "OX1 2JD",
    },
    provider: {
      id: "prov8",
      name: "Story Makers",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    },
    price: "£5 per session",
    days: ["Tuesday", "Thursday"],
    times: ["10:30", "13:30"],
    image:
      "https://images.unsplash.com/photo-1549737221-bef65e2604a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  },
]

// Demo providers
export const providers: Provider[] = [
  {
    id: "prov1",
    name: "Little Explorers",
    description: "Providing sensory play experiences for babies and toddlers since 2015.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    activities: 5,
    location: "London",
    rating: 4.8,
  },
  {
    id: "prov2",
    name: "Tiny Dancers",
    description: "Dance classes for children of all ages, focusing on fun and building confidence.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80",
    activities: 3,
    location: "Manchester",
    rating: 4.9,
  },
  {
    id: "prov3",
    name: "Peaceful Beginnings",
    description: "Yoga and mindfulness for parents and children, promoting wellbeing and bonding.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    activities: 4,
    location: "Bristol",
    rating: 4.7,
  },
]

// Demo cities
export const cities: City[] = [
  { name: "ABERDEEN", activityCount: 15 },
  { name: "BATH", activityCount: 23 },
  { name: "BELFAST", activityCount: 31 },
  { name: "BIRMINGHAM", activityCount: 47 },
  { name: "BRIGHTON", activityCount: 29 },
  { name: "BRISTOL", activityCount: 38 },
  { name: "CAMBRIDGE", activityCount: 26 },
  { name: "CANTERBURY", activityCount: 18 },
  { name: "CARDIFF", activityCount: 33 },
  { name: "CHELMSFORD", activityCount: 21 },
  { name: "DERBY", activityCount: 19 },
  { name: "EDINBURGH", activityCount: 42 },
  { name: "LEEDS", activityCount: 36 },
  { name: "LEICESTER", activityCount: 28 },
  { name: "LIVERPOOL", activityCount: 34 },
  { name: "LONDON", activityCount: 156 },
  { name: "MANCHESTER", activityCount: 52 },
  { name: "NORWICH", activityCount: 24 },
  { name: "OXFORD", activityCount: 27 },
  { name: "PLYMOUTH", activityCount: 22 },
  { name: "SOUTHAMPTON", activityCount: 31 },
  { name: "ST ALBANS", activityCount: 17 },
  { name: "SUNDERLAND", activityCount: 19 },
  { name: "SWANSEA", activityCount: 25 },
]

// Categories with counts
export const categories = [
  {
    name: "POSTNATAL FITNESS",
    count: 42,
    image:
      "https://images.unsplash.com/photo-1518310952931-b1de897abd40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    name: "BABY YOGA",
    count: 38,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1520&q=80",
  },
  {
    name: "DANCE",
    count: 56,
    image:
      "https://images.unsplash.com/photo-1502781252888-9143ba7f074e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
  },
  {
    name: "SPORTS",
    count: 47,
    image:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    name: "SEND",
    count: 29,
    image:
      "https://images.unsplash.com/photo-1602030638412-bb8dcc0bc8b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  },
  {
    name: "BABY FIRST AID",
    count: 31,
    image:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    name: "WALK & TALK",
    count: 35,
    image:
      "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    name: "STORYTIME",
    count: 44,
    image:
      "https://images.unsplash.com/photo-1549737221-bef65e2604a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  },
]

// PND resources
export const pndResources = [
  {
    id: "res1",
    title: "Recognizing Postnatal Depression",
    description: "Learn about the signs and symptoms of postnatal depression and when to seek help.",
    link: "#",
  },
  {
    id: "res2",
    title: "Self-Care for New Parents",
    description: "Practical tips for taking care of your mental health while caring for a new baby.",
    link: "#",
  },
  {
    id: "res3",
    title: "Finding Support in Your Community",
    description: "Resources and groups that can provide support for parents experiencing PND.",
    link: "#",
  },
  {
    id: "res4",
    title: "Talking to Your Partner About PND",
    description: "How to communicate your feelings and needs with your partner during this challenging time.",
    link: "#",
  },
]

// Helper functions
export function getActivityById(id: string): Activity | undefined {
  return activities.find((activity) => activity.id === id)
}

// Update the getActivitiesByCategory function to be more flexible with matching
export function getActivitiesByCategory(category: string): Activity[] {
  // Make the search case-insensitive
  const normalizedCategory = category.toUpperCase()
  return activities.filter(
    (activity) =>
      activity.category.toUpperCase() === normalizedCategory ||
      activity.category.toUpperCase().includes(normalizedCategory),
  )
}

export function getActivitiesByCity(city: string): Activity[] {
  return activities.filter((activity) => activity.location.city.toUpperCase() === city.toUpperCase())
}

export function getActivitiesByAgeRange(ageRange: string): Activity[] {
  return activities.filter((activity) => activity.ageRange.includes(ageRange))
}

export function getActivitiesByDay(day: string): Activity[] {
  return activities.filter((activity) => activity.days.includes(day))
}

export function searchActivities(query: string): Activity[] {
  const lowercaseQuery = query.toLowerCase()
  return activities.filter(
    (activity) =>
      activity.name.toLowerCase().includes(lowercaseQuery) ||
      activity.description.toLowerCase().includes(lowercaseQuery) ||
      activity.category.toLowerCase().includes(lowercaseQuery) ||
      activity.location.city.toLowerCase().includes(lowercaseQuery),
  )
}

export function getFeaturedActivities(): Activity[] {
  return activities.filter((activity) => activity.featured)
}


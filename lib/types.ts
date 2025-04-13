// types.ts

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

  // UI‑required fields
  capacity: number
  date: string
  time: string
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
  registeredUsers?: string[]
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
  id: string
  name: string
  activityCount: number
}

export type Category = {
  id: string
  name: string
  count: number
  image: string
}

export type PNDResource = {
  id: string
  title: string
  description: string
  link: string
}

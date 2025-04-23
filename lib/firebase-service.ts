// firebase-service.ts

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore"
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"
import { db, storage } from "./firebase"
import {
  Activity,
  Provider,
  City,
  Category,
  PNDResource,
} from "../lib/types"

// ───────────── Helper ─────────────

type WithId = { id: string }
const converter = <T extends WithId>(doc: QueryDocumentSnapshot<DocumentData>): T => {
  const data = doc.data() as Omit<T, "id">
  return { id: doc.id, ...data } as T
}

// ───────────── Activities ─────────────

export const getActivities = async (): Promise<Activity[]> => {
  const snap = await getDocs(collection(db, "activities"))
  return snap.docs.map(d => converter<Activity>(d))
}

export const getActivityById = async (id: string): Promise<Activity | null> => {
  const refDoc = doc(db, "activities", id)
  const snap = await getDoc(refDoc)
  return snap.exists() ? converter<Activity>(snap) : null
}

export const getAllActivities = getActivities

export const addActivity = async (
  activity: Omit<Activity, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "activities"), {
    ...activity,
    featured: activity.featured ?? false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export const updateActivity = async (
  id: string,
  activity: Partial<Activity>
): Promise<void> => {
  const refDoc = doc(db, "activities", id)
  await updateDoc(refDoc, {
    ...activity,
    updatedAt: serverTimestamp(),
  })
}

export const deleteActivity = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "activities", id))
}

export const getActivitiesCount = async (): Promise<number> => {
  const snap = await getDocs(collection(db, "activities"))
  return snap.size
}

export const getFeaturedActivities = async (): Promise<Activity[]> => {
  const q = query(
    collection(db, "activities"),
    where("featured", "==", true)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => converter<Activity>(d))
}

// ───────────── Providers ─────────────
export const getProviders = async (): Promise<Provider[]> => {
  const q = query(collection(db, "users"), where("role", "==", "provider"))
  const snap = await getDocs(q)
  return snap.docs.map(d => converter<Provider>(d))
}

export const getProviderById = async (id: string): Promise<Provider | null> => {
  const ref = doc(db, "users", id)
  const snap = await getDoc(ref)
  return snap.exists() && snap.data()?.role === "provider"
    ? converter<Provider>(snap)
    : null
}

export const getAllProviders = getProviders

export const addProvider = async (provider: Omit<Provider, "id">): Promise<string> => {
  const ref = await addDoc(collection(db, "users"), {
    ...provider,
    role: "provider",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export const updateProvider = async (id: string, provider: Partial<Provider>): Promise<void> => {
  const ref = doc(db, "users", id)
  await updateDoc(ref, {
    ...provider,
    updatedAt: serverTimestamp(),
  })
}

export const deleteProvider = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "users", id))
}

export const getProvidersCount = async (): Promise<number> => {
  const q = query(collection(db, "users"), where("role", "==", "provider"))
  const snap = await getDocs(q)
  return snap.size
}

// ───────────── Cities ─────────────

export const getCities = async (): Promise<City[]> => {
  const snap = await getDocs(collection(db, "cities"))
  return snap.docs.map(d => converter<City>(d))
}

export const getCityById = async (id: string): Promise<City | null> => {
  const refDoc = doc(db, "cities", id)
  const snap = await getDoc(refDoc)
  return snap.exists() ? converter<City>(snap) : null
}

export const addCity = async (city: Omit<City, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "cities"), {
    ...city,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export const updateCity = async (
  id: string,
  city: Partial<City>
): Promise<void> => {
  const refDoc = doc(db, "cities", id)
  await updateDoc(refDoc, {
    ...city,
    updatedAt: serverTimestamp(),
  })
}

export const deleteCity = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "cities", id))
}

export const getCitiesCount = async (): Promise<number> => {
  const snap = await getDocs(collection(db, "cities"))
  return snap.size
}

// ───────────── Categories ─────────────

export const getCategories = async (): Promise<Category[]> => {
  const snap = await getDocs(collection(db, "categories"))
  return snap.docs.map(d => converter<Category>(d))
}

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const refDoc = doc(db, "categories", id)
  const snap = await getDoc(refDoc)
  return snap.exists() ? converter<Category>(snap) : null
}

export const addCategory = async (
  category: Omit<Category, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "categories"), {
    ...category,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export const updateCategory = async (
  id: string,
  category: Partial<Category>
): Promise<void> => {
  const refDoc = doc(db, "categories", id)
  await updateDoc(refDoc, {
    ...category,
    updatedAt: serverTimestamp(),
  })
}

export const deleteCategory = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "categories", id))
}

export const getCategoriesCount = async (): Promise<number> => {
  const snap = await getDocs(collection(db, "categories"))
  return snap.size
}

// ───────────── PND Resources ─────────────

export const getResources = async (): Promise<PNDResource[]> => {
  const snap = await getDocs(collection(db, "resources"))
  return snap.docs.map(d => converter<PNDResource>(d))
}

export const getResourceById = async (id: string): Promise<PNDResource | null> => {
  const refDoc = doc(db, "resources", id)
  const snap = await getDoc(refDoc)
  return snap.exists() ? converter<PNDResource>(snap) : null
}

export const addResource = async (
  resource: Omit<PNDResource, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "resources"), {
    ...resource,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export const updateResource = async (
  id: string,
  resource: Partial<PNDResource>
): Promise<void> => {
  const refDoc = doc(db, "resources", id)
  await updateDoc(refDoc, {
    ...resource,
    updatedAt: serverTimestamp(),
  })
}

export const deleteResource = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "resources", id))
}

// ───────────── Image Upload ─────────────

export const uploadImage = async (
  file: File,
  path: string
): Promise<string> => {
  const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export const deleteImage = async (url: string): Promise<void> => {
  const storageRef = ref(storage, url)
  await deleteObject(storageRef)
}

// ───────────── Category Helpers ─────────────

export interface CategoryData {
  name: string
  image?: string | null
  description?: string
}

export async function createCategoryInFirestore(data: CategoryData) {
  const docRef = await addDoc(collection(db, "categories"), {
    name: data.name,
    image: data.image ?? null,
    description: data.description ?? "",
    createdAt: Timestamp.now(),
  })
  return docRef
}

export interface CategoryFormat {
  id: string
  name: string
  image?: string
}

export async function getAllCategories(): Promise<CategoryFormat[]> {
  const snap = await getDocs(collection(db, "categories"))
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<CategoryFormat, "id">) }))
}

export async function updateCategoryInFirestore(
  categoryId: string,
  data: { name: string; image?: string | null; description?: string | null }
) {
  const categoryRef = doc(db, "categories", categoryId)
  await updateDoc(categoryRef, {
    name: data.name,
    image: data.image ?? null,
    description: data.description ?? "",
  })
}

// ───────────── User ─────────────

export async function getUserById(userId: string) {
  if (!userId) return null

  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() }
    }
    return null
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

// ───────────── Bookings ─────────────

interface BookingData {
  userId: string
  userName: string
  userEmail: string
  phone?: string
  babyAge?: string
  activityId: string
  activityTitle: string
  bookingDate: string
  participants: number
  status: "pending" | "confirmed" | "cancelled"
  createdAt: Date
}

export const createBooking = async (bookingData: BookingData): Promise<string> => {
  const docRef = await addDoc(collection(db, "bookings"), {
    ...bookingData,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export const getUserBookings = async (userId: string) => {
  const q = query(
    collection(db, "bookings"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs.map((doc) => converter<BookingData & WithId>(doc))
}

export const getActivityBookings = async (activityId: string) => {
  const q = query(
    collection(db, "bookings"),
    where("activityId", "==", activityId),
    orderBy("createdAt", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs.map((doc) => converter<BookingData & WithId>(doc))
}

export const getAllBookings = async () => {
  const q = query(
    collection(db, "bookings"),
    orderBy("createdAt", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs.map((doc) => converter<BookingData & WithId>(doc))
}

// Add this function to update booking status
export const updateBookingStatus = async (
  bookingId: string, 
  status: "pending" | "confirmed" | "cancelled"
): Promise<void> => {
  const bookingRef = doc(db, "bookings", bookingId)
  await updateDoc(bookingRef, { 
    status,
    updatedAt: serverTimestamp()
  })
}

interface UserProfile {
  fullName?: string
  email?: string
  role?: string
  profile_img?: string
  emailVerified?: boolean
  [key: string]: any
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!userId) return null

  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as UserProfile
    }
    return null
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<void> => {
  if (!userId) throw new Error("User ID is required")

  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

export const uploadProfileImage = async (userId: string, file: File): Promise<string> => {
  if (!userId || !file) throw new Error("User ID and file are required")

  try {
    // Create a reference to the storage location
    const storageRef = ref(storage, `profile_images/${userId}/${Date.now()}_${file.name}`)

    // Upload the file
    await uploadBytes(storageRef, file)

    // Get the download URL
    const downloadUrl = await getDownloadURL(storageRef)

    // Update the user profile with the new image URL
    await updateUserProfile(userId, { profile_img: downloadUrl })

    return downloadUrl
  } catch (error) {
    console.error("Error uploading profile image:", error)
    throw error
  }
}

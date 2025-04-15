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

// Helper to convert Firestore snapshots to typed objects
type WithId = { id: string }
const converter = <T extends WithId>(
  doc: QueryDocumentSnapshot<DocumentData>
): T => {
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

// Create a new activity, defaulting featured to false
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

// Update existing activity (will update featured if included)
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

// Fetch only those marked featured
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
  const snap = await getDocs(collection(db, "providers"))
  return snap.docs.map(d => converter<Provider>(d))
}

export const getProviderById = async (id: string): Promise<Provider | null> => {
  const refDoc = doc(db, "providers", id)
  const snap = await getDoc(refDoc)
  return snap.exists() ? converter<Provider>(snap) : null
}

export const getAllProviders = getProviders

export const addProvider = async (
  provider: Omit<Provider, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "providers"), {
    ...provider,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export const updateProvider = async (
  id: string,
  provider: Partial<Provider>
): Promise<void> => {
  const refDoc = doc(db, "providers", id)
  await updateDoc(refDoc, {
    ...provider,
    updatedAt: serverTimestamp(),
  })
}

export const deleteProvider = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "providers", id))
}

export const getProvidersCount = async (): Promise<number> => {
  const snap = await getDocs(collection(db, "providers"))
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

export const getCategoryById = async (
  id: string
): Promise<Category | null> => {
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

export const getResourceById = async (
  id: string
): Promise<PNDResource | null> => {
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

export async function getUserById(userId: string) {
  if (!userId) return null;
  
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
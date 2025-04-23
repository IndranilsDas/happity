"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getUserProfile, updateUserProfile, uploadProfileImage } from "@/lib/firebase-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, User, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProfilePage() {
  const { id } = useParams()
  const { user, role, loading } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "",
    profile_img: "",
    bio: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  console.log("profile user", user, role, loading )
  // Check if user is authorized to view this profile
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
        return
      }

      if (user.uid !== id) {
        router.push("/")
        return
      }

      fetchUserProfile()
    }
  }, [user, loading, id, router])

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)
      const userData = await getUserProfile(id as string)

      if (userData) {
        setProfile({
          fullName: userData.fullName || "",
          email: userData.email || "",
          role: userData.role || "",
          profile_img: userData.profile_img || "",
          bio: userData.bio || "",
        })
      } else {
        setError("Profile not found")
      }
    } catch (err) {
      setError("Error loading profile")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)

      // Upload image if selected
      let profileImageUrl = profile.profile_img

      if (imageFile) {
        profileImageUrl = await uploadProfileImage(user.uid, imageFile)
      }

      // Update profile data
      const updatedProfile = {
        fullName: profile.fullName,
        bio: profile.bio,
        profile_img: profileImageUrl,
      }

      await updateUserProfile(user.uid, updatedProfile)
      setProfile({ ...profile, profile_img: profileImageUrl })
      setSuccess("Profile updated successfully")
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 max-w-3xl py-10">
      <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
          <CardDescription>Make changes to your profile information here</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="px-6">
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={imagePreview || profile.profile_img} alt={profile.fullName || "Profile"} />
                <AvatarFallback className="text-2xl">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="profile-image">Profile Image</Label>
                <Input id="profile-image" type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile.email} disabled />
                <p className="text-sm text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={profile.role} disabled />
                <p className="text-sm text-muted-foreground">Role cannot be changed</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between px-6">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

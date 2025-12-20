"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Camera } from "lucide-react"
import SubscriptionPlans from "@/components/subscription/SubscriptionPlans"

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [message, setMessage] = useState({ type: "", text: "" })

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    website: "",
    city: "",
    state: "",
    zipCode: "",
    companyName: "",
    profession: "",
    biography: "",
    photo: "",
    banner: "",
  })

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)

  const [accountData, setAccountData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [subscription, setSubscription] = useState<any>(null)
  const [loadingSubscription, setLoadingSubscription] = useState(true)

  useEffect(() => {
    fetchProfile()
    fetchSubscription()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile")
      const data = await res.json()

      if (res.ok && data.profile) {
        setProfileData({
          firstName: data.profile.firstName || "",
          lastName: data.profile.lastName || "",
          phone: data.profile.phone || "",
          website: data.profile.website || "",
          city: data.profile.city || "",
          state: data.profile.state || "",
          zipCode: data.profile.zipCode || "",
          companyName: data.profile.companyName || "",
          profession: data.profile.profession || "",
          biography: data.profile.biography || "",
          photo: data.profile.photo || "",
          banner: data.profile.banner || "",
        })
        setAccountData({ ...accountData, email: data.user?.email || "" })
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoadingProfile(false)
    }
  }

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/subscription")
      if (res.ok) {
        const data = await res.json()
        setSubscription(data.subscription)
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error)
    } finally {
      setLoadingSubscription(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      setMessage({ type: "success", text: "Profile updated successfully!" })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    if (accountData.newPassword !== accountData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords don't match" })
      setLoading(false)
      return
    }

    if (accountData.newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" })
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: accountData.currentPassword,
          newPassword: accountData.newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to change password")
      }

      setMessage({ type: "success", text: "Password changed successfully!" })
      setAccountData({ ...accountData, currentPassword: "", newPassword: "", confirmPassword: "" })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result as string

        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photo: base64 }),
        })

        if (!res.ok) {
          throw new Error("Failed to upload photo")
        }

        setProfileData({ ...profileData, photo: base64 })
        setMessage({ type: "success", text: "Profile photo updated!" })
        setTimeout(() => setMessage({ type: "", text: "" }), 3000)
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingBanner(true)
    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result as string

        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ banner: base64 }),
        })

        if (!res.ok) {
          throw new Error("Failed to upload banner")
        }

        setProfileData({ ...profileData, banner: base64 })
        setMessage({ type: "success", text: "Banner image updated!" })
        setTimeout(() => setMessage({ type: "", text: "" }), 3000)
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setUploadingBanner(false)
    }
  }

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your professional profile details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* Photo and Banner Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Images</h3>
                  
                  {/* Banner Upload */}
                  <div className="space-y-2">
                    <Label>Banner Image</Label>
                    <div className="relative h-32 bg-gradient-to-r from-brand-teal-500 to-brand-gold-400 rounded-lg overflow-hidden">
                      {profileData.banner && (
                        <img
                          src={profileData.banner}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <label
                        htmlFor="banner-upload"
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-50 cursor-pointer transition-all"
                      >
                        <div className="text-center text-white">
                          <Camera className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm font-medium">
                            {uploadingBanner ? "Uploading..." : "Change Banner"}
                          </p>
                        </div>
                      </label>
                      <input
                        id="banner-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        disabled={uploadingBanner}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Recommended: 1200x300px</p>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label>Profile Photo</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={profileData.photo || undefined} />
                          <AvatarFallback className="text-2xl bg-brand-teal-500 text-white">
                            {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <label
                          htmlFor="photo-upload"
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-50 rounded-full cursor-pointer transition-all"
                        >
                          <Upload className="h-6 w-6 text-white" />
                        </label>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhoto}
                          className="hidden"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {uploadingPhoto ? "Uploading..." : "Click to change photo"}
                        </p>
                        <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 5MB.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={profileData.profession}
                      onChange={(e) =>
                        setProfileData({ ...profileData, profession: e.target.value })
                      }
                      placeholder="e.g., Real Estate Agent"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={profileData.companyName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, companyName: e.target.value })
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profileData.website}
                      onChange={(e) =>
                        setProfileData({ ...profileData, website: e.target.value })
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) =>
                        setProfileData({ ...profileData, city: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={profileData.state}
                      onChange={(e) =>
                        setProfileData({ ...profileData, state: e.target.value })
                      }
                      placeholder="CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={profileData.zipCode}
                      onChange={(e) =>
                        setProfileData({ ...profileData, zipCode: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biography">Biography</Label>
                  <Textarea
                    id="biography"
                    value={profileData.biography}
                    onChange={(e) =>
                      setProfileData({ ...profileData, biography: e.target.value })
                    }
                    placeholder="Tell others about your professional background..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-gold-400 hover:bg-brand-gold-500"
                >
                  {loading ? "Saving..." : "Save Profile"}
                </Button>
                </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Address</CardTitle>
                <CardDescription>Your account email address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={accountData.email} disabled />
                  <p className="text-sm text-gray-500">
                    Contact support to change your email address
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={accountData.currentPassword}
                      onChange={(e) =>
                        setAccountData({ ...accountData, currentPassword: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={accountData.newPassword}
                      onChange={(e) =>
                        setAccountData({ ...accountData, newPassword: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={accountData.confirmPassword}
                      onChange={(e) =>
                        setAccountData({ ...accountData, confirmPassword: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-brand-gold-400 hover:bg-brand-gold-500"
                  >
                    {loading ? "Changing..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription & Billing</CardTitle>
              <CardDescription>
                Manage your subscription plan and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSubscription ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : (
                <SubscriptionPlans
                  currentPlan={subscription?.plan}
                  hasActiveSubscription={subscription?.status === "ACTIVE" || subscription?.status === "TRIALING"}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">
                    Receive emails about new referrals and partnerships
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Partnership Invitations</p>
                  <p className="text-sm text-gray-500">
                    Get notified when someone invites you to partner
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Referral Updates</p>
                  <p className="text-sm text-gray-500">
                    Receive updates on referral status changes
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <Button className="bg-brand-gold-400 hover:bg-brand-gold-500">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


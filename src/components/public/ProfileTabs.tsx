"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Share2, UserPlus, Users } from "lucide-react"

interface ProfileTabsProps {
  children: {
    profile: React.ReactNode
    shareWithClients: React.ReactNode
    inviteProfessional: React.ReactNode
    partners: React.ReactNode
  }
}

export function ProfileTabs({ children }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="share" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share With Clients</span>
        </TabsTrigger>
        <TabsTrigger value="invite" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Invite Professional</span>
        </TabsTrigger>
        <TabsTrigger value="partners" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Partners</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-0">
        {children.profile}
      </TabsContent>

      <TabsContent value="share" className="mt-0">
        {children.shareWithClients}
      </TabsContent>

      <TabsContent value="invite" className="mt-0">
        {children.inviteProfessional}
      </TabsContent>

      <TabsContent value="partners" className="mt-0">
        {children.partners}
      </TabsContent>
    </Tabs>
  )
}

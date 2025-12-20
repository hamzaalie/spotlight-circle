import { auth } from "@/auth"
import { redirect } from "next/navigation"
import PosterGenerator from "@/components/marketing/PosterGenerator"
import { Printer } from "lucide-react"

export default async function PosterGeneratorPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Printer className="h-8 w-8 text-brand-teal-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Poster Generator
          </h1>
        </div>
        <p className="text-gray-600">
          Create professional marketing posters to promote your referral network
        </p>
      </div>

      {/* Poster Generator Component */}
      <PosterGenerator />
    </>
  )
}


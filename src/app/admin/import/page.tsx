import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminHeader } from "@/components/admin/AdminHeader"
import CSVImportClient from "@/components/admin/CSVImportClient"

export default async function ImportProfessionalsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // Check admin role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdminHeader
        title="Import Professionals"
        description="Bulk import professionals from a CSV file"
      />

      <CSVImportClient />
    </div>
  )
}

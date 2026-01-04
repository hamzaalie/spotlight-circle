import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react"

export default async function AdminCategoriesPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profession Categories</h1>
          <p className="text-gray-600 mt-1">
            Manage profession categories for user profiles
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="bg-brand-gold-400 hover:bg-brand-gold-500">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories ({categories.length})</CardTitle>
          <CardDescription>
            Categories are shown in dropdown menus during profile setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No categories yet. Click "Add Category" to create one.
              </div>
            ) : (
              <div className="divide-y">
                {categories.map((category: any, index: number) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between py-4 hover:bg-gray-50 px-4 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex flex-col items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <span className="text-xs text-gray-500 font-mono w-8 text-center">
                          #{category.order}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          disabled={index === categories.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          {!category.isActive && (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {category.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Created: {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <form action={`/api/admin/categories/${category.id}`} method="POST">
                        <input type="hidden" name="_method" value="DELETE" />
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Usage Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-900 space-y-2">
          <ul className="list-disc list-inside space-y-1">
            <li>Categories appear in dropdown menus during onboarding</li>
            <li>Users can still add custom profession titles</li>
            <li>Order determines the sequence in dropdown lists</li>
            <li>Inactive categories won't show in dropdowns but preserve existing data</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: string
    isPositive: boolean
  }
  colorClass?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  colorClass = "bg-brand-teal-100 text-brand-teal-600",
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={`rounded-full p-2 ${colorClass}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
        {trend && (
          <p
            className={`text-xs mt-1 font-medium ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

import { Badge } from "@/components/ui/badge"

interface UserStatusBadgeProps {
  status: "ACTIVE" | "SUSPENDED" | "PENDING"
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const config = {
    ACTIVE: {
      label: "Active",
      className: "bg-green-100 text-green-700 hover:bg-green-100",
    },
    SUSPENDED: {
      label: "Suspended",
      className: "bg-red-100 text-red-700 hover:bg-red-100",
    },
    PENDING: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    },
  }

  const { label, className } = config[status]

  return <Badge className={className}>{label}</Badge>
}

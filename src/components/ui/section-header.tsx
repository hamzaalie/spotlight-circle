import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  badge?: string
  title: string
  description?: string
  className?: string
  centered?: boolean
}

export function SectionHeader({
  badge,
  title,
  description,
  className,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={cn(centered && "text-center", className)}>
      {badge && (
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-teal-500/20 to-brand-gold-400/20 px-4 py-2 mb-4 border border-brand-teal-500/30">
          <span className="text-sm font-semibold bg-gradient-to-r from-brand-teal-400 to-brand-gold-400 bg-clip-text text-transparent">
            {badge}
          </span>
        </div>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}


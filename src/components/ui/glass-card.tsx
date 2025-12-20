import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]",
        hover && "transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_8px_48px_0_rgba(139,92,246,0.3)]",
        className
      )}
    >
      {children}
    </div>
  )
}


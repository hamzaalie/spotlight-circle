"use client"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="max-w-md w-full bg-white rounded-lg border border-red-200 p-8 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Dashboard Error
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || "Failed to load dashboard"}
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-brand-gold-400 text-white rounded-md hover:bg-brand-gold-500 transition-colors"
        >
          Reload
        </button>
      </div>
    </div>
  )
}


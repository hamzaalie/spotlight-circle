import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-brand-teal-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-brand-gold-400 text-white rounded-md hover:bg-brand-gold-500 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}


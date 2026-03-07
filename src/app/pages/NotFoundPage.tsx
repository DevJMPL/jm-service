import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-white">
      <div className="max-w-lg rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-6">
        <h1 className="text-3xl font-semibold">404</h1>
        <p className="text-white/70 mt-2">Page not found.</p>

        <Link
          to="/"
          className="inline-block mt-6 rounded-2xl bg-white/20 border border-white/25 px-4 py-2 hover:bg-white/25 transition"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
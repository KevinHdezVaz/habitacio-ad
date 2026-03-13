import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1B3A6B] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="font-semibold text-[#1B3A6B] text-lg tracking-tight">
            Habitacio.ad
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="bg-[#F5F7FA] text-[#1B3A6B] font-medium px-4 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            Iniciar sesión
          </Link>
          <button className="text-[#1B3A6B] p-1 hover:opacity-70 transition-opacity" aria-label="Menú">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span className="font-bold text-xl text-[#1a3c5e]">Habitacio.ad</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/habitaciones" className="text-sm font-medium text-[#1a3c5e] hover:text-[#0ea5a0] transition-colors">
            Buscar
          </Link>
          <Link href="/perfiles" className="text-sm font-medium text-[#1a3c5e] hover:text-[#0ea5a0] transition-colors">
            Perfiles
          </Link>
          <Link href="/publicar" className="text-sm font-medium text-[#1a3c5e] hover:text-[#0ea5a0] transition-colors">
            Publicar
          </Link>
          <Link href="/login" className="bg-[#f4f5f7] text-[#1a3c5e] font-semibold px-5 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors">
            Iniciar sesión
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-[#1a3c5e] text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 flex flex-col p-4 gap-4 shadow-lg animate-in slide-in-from-top duration-200">
          <Link href="/habitaciones" className="font-medium text-[#1a3c5e]" onClick={() => setIsOpen(false)}>Buscar habitación</Link>
          <Link href="/perfiles" className="font-medium text-[#1a3c5e]" onClick={() => setIsOpen(false)}>Ver perfiles</Link>
          <Link href="/publicar" className="font-medium text-[#1a3c5e]" onClick={() => setIsOpen(false)}>Publicar</Link>
          <Link href="/login" className="bg-[#1a3c5e] text-white text-center py-3 rounded-xl font-bold" onClick={() => setIsOpen(false)}>
            Iniciar sesión
          </Link>
        </div>
      )}
    </header>
  )
}
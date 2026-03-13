'use client'

import Link from 'next/link'
import { useState } from 'react'
import { logout } from '@/app/actions/auth'
import type { User } from '@supabase/supabase-js'

export default function Navbar({
  user,
  isAdmin = false,
}: {
  user: User | null
  isAdmin?: boolean
}) {
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

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/chat" className="text-sm font-medium text-[#1a3c5e] hover:text-[#0ea5a0] transition-colors">
                Mensajes
              </Link>
              <Link href="/perfil" className="text-sm font-medium text-[#1a3c5e] hover:text-[#0ea5a0] transition-colors">
                Mi perfil
              </Link>

              {/* Dashboard — solo admins */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 bg-[#1a3c5e] text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#0ea5a0] transition-colors"
                >
                  <span>⚙️</span>
                  Dashboard
                </Link>
              )}

              <form action={logout}>
                <button
                  type="submit"
                  className="bg-[#f4f5f7] text-[#1a3c5e] font-semibold px-5 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  Salir
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#f4f5f7] text-[#1a3c5e] font-semibold px-5 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              Iniciar sesión
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-[#1a3c5e] text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menú"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 flex flex-col p-4 gap-4 shadow-lg">
          <Link href="/habitaciones" className="font-medium text-[#1a3c5e]" onClick={() => setIsOpen(false)}>
            Buscar habitación
          </Link>
          <Link href="/perfiles" className="font-medium text-[#1a3c5e]" onClick={() => setIsOpen(false)}>
            Ver perfiles
          </Link>
          <Link href="/publicar" className="font-medium text-[#1a3c5e]" onClick={() => setIsOpen(false)}>
            Publicar
          </Link>

          {user ? (
            <>
              <Link href="/chat" className="font-medium text-[#1a3c5e]" onClick={() => setIsOpen(false)}>
                Mensajes
              </Link>
              <Link href="/perfil" className="font-medium text-[#1a3c5e]" onClick={() => setIsOpen(false)}>
                Mi perfil
              </Link>

              {/* Dashboard móvil — solo admins */}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 bg-[#1a3c5e] text-white px-4 py-3 rounded-xl font-bold text-sm"
                >
                  <span>⚙️</span>
                  Dashboard
                </Link>
              )}

              <form action={logout}>
                <button
                  type="submit"
                  className="w-full bg-gray-100 text-[#1a3c5e] text-center py-3 rounded-xl font-bold"
                >
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-[#1a3c5e] text-white text-center py-3 rounded-xl font-bold"
              onClick={() => setIsOpen(false)}
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

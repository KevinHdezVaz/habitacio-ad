'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { logout } from '@/app/actions/auth'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import type { User } from '@supabase/supabase-js'

function MiniAvatar({ avatarUrl, userName }: { avatarUrl: string | null; userName: string | null }) {
  const iniciales = userName
    ? userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'
  return (
    <span className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#e8edf2] inline-flex">
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="w-full h-full bg-gradient-to-br from-[#1a3c5e] to-[#2d5a8e] flex items-center justify-center text-white text-[10px] font-bold">
          {iniciales}
        </span>
      )}
    </span>
  )
}

export default function Navbar({
  user,
  isAdmin = false,
  unreadCount = 0,
  locale = 'es',
  avatarUrl = null,
  userName = null,
}: {
  user: User | null
  isAdmin?: boolean
  unreadCount?: number
  locale?: string
  avatarUrl?: string | null
  userName?: string | null
}) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('nav')

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span className="font-bold text-xl text-[#1a3c5e]">Habitacio.ad</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/habitaciones" className="text-sm font-medium text-[#1a3c5e] hover:text-[#0ea5a0] transition-colors">
            {t('buscar')}
          </Link>
          <Link href="/perfiles" className="text-sm font-medium text-[#1a3c5e] hover:text-[#0ea5a0] transition-colors">
            {t('perfiles')}
          </Link>
          <Link href="/publicar" className="text-sm font-medium text-[#1a3c5e] hover:text-[#0ea5a0] transition-colors">
            {t('publicar')}
          </Link>

          {user ? (
            <div className="flex items-center gap-5">
              <Link href="/chat" className="relative text-sm font-medium text-[#1a3c5e] hover:text-[#0ea5a0] transition-colors">
                {t('mensajes')}
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/perfil" className="flex items-center gap-2 text-sm font-medium text-[#1a3c5e] hover:text-[#0ea5a0] transition-colors">
                <MiniAvatar avatarUrl={avatarUrl} userName={userName} />
                {t('miPerfil')}
              </Link>

              {isAdmin && (
                <Link href="/admin" className="text-sm font-medium text-[#1a3c5e] hover:text-[#0ea5a0] transition-colors">
                  {t('dashboard')}
                </Link>
              )}

              <form action={logout}>
                <button
                  type="submit"
                  className="bg-[#f4f5f7] text-[#1a3c5e] font-semibold px-5 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {t('salir')}
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#f4f5f7] text-[#1a3c5e] font-semibold px-5 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {t('iniciarSesion')}
            </Link>
          )}

          {/* Selector de idioma — desktop */}
          <LanguageSwitcher currentLocale={locale} />
        </nav>

        {/* Mobile: idioma + toggle */}
        <div className="md:hidden flex items-center gap-3">
          <LanguageSwitcher currentLocale={locale} />
          <button
            className="text-[#1a3c5e] text-2xl"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menú"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 flex flex-col p-4 gap-4 shadow-lg animate-fade-in">
          <Link href="/habitaciones" className="font-medium text-[#1a3c5e]" onClick={() => setIsOpen(false)}>
            {t('buscar')}
          </Link>
          <Link href="/perfiles" className="font-medium text-[#1a3c5e]" onClick={() => setIsOpen(false)}>
            {t('perfiles')}
          </Link>
          <Link href="/publicar" className="font-medium text-[#1a3c5e]" onClick={() => setIsOpen(false)}>
            {t('publicar')}
          </Link>

          {user ? (
            <>
              <Link href="/chat" className="relative inline-flex items-center gap-2 font-medium text-[#1a3c5e]" onClick={() => setIsOpen(false)}>
                {t('mensajes')}
                {unreadCount > 0 && (
                  <span className="min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/perfil" className="flex items-center gap-2 font-medium text-[#1a3c5e]" onClick={() => setIsOpen(false)}>
                <MiniAvatar avatarUrl={avatarUrl} userName={userName} />
                {t('miPerfil')}
              </Link>

              {isAdmin && (
                <Link href="/admin" onClick={() => setIsOpen(false)} className="font-medium text-[#1a3c5e]">
                  {t('dashboard')}
                </Link>
              )}

              <form action={logout}>
                <button type="submit" className="w-full bg-gray-100 text-[#1a3c5e] text-center py-3 rounded-xl font-bold">
                  {t('cerrarSesion')}
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-[#1a3c5e] text-white text-center py-3 rounded-xl font-bold"
              onClick={() => setIsOpen(false)}
            >
              {t('iniciarSesion')}
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

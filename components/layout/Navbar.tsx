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
          <img src="/logo.jpeg" alt="Habitacio.ad" className="h-10 w-auto rounded-xl" />
          <span className="font-bold text-xl text-[#1a3c5e]">Habitacio.ad</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <span className="text-sm font-medium text-[#1a3c5e] cursor-default">{t('buscar')}</span>
          <span className="text-sm font-medium text-[#1a3c5e] cursor-default">{t('perfiles')}</span>
          <span className="text-sm font-medium text-[#1a3c5e] cursor-default">{t('publicar')}</span>
          <span className="bg-[#f4f5f7] text-[#1a3c5e] font-semibold px-5 py-2 rounded-full text-sm cursor-default">
            {t('iniciarSesion')}
          </span>
        </nav>

        {/* Mobile: toggle — TEMPORALMENTE SIN MENÚ */}
        <div className="md:hidden flex items-center gap-3">
          <button className="text-[#1a3c5e] text-2xl" aria-label="Menú">☰</button>
        </div>
      </div>
    </header>
  )
}

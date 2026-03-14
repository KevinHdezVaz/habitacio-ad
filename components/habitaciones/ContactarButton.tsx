'use client'

import { crearOAbrirConversacion } from '@/app/actions/chat'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
  anuncioId: string
  arrendadorId: string
  currentUserId: string | null
  isOwner: boolean
  compact?: boolean   // modo icono para la barra móvil
}

export default function ContactarButton({ anuncioId, arrendadorId, currentUserId, isOwner, compact = false }: Props) {
  const [loading, setLoading] = useState(false)

  if (isOwner) {
    if (compact) return null
    return (
      <div className="w-full bg-[#f4f5f7] text-[#6b7280] text-center py-3 rounded-xl font-semibold text-sm">
        Este es tu anuncio
      </div>
    )
  }

  if (!currentUserId) {
    if (compact) {
      return (
        <Link
          href={`/login?next=/habitaciones/${anuncioId}`}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a3c5e] to-[#2d5a8e] text-white font-bold px-5 py-3 rounded-2xl text-sm shadow-sm hover:shadow-md transition-all"
        >
          💬 Contactar
        </Link>
      )
    }
    return (
      <Link
        href={`/login?next=/habitaciones/${anuncioId}`}
        className="w-full bg-gradient-to-r from-[#1a3c5e] to-[#2d5a8e] text-white text-center py-3.5 rounded-2xl font-bold text-sm block hover:from-[#152e4a] transition-all shadow-sm"
      >
        Inicia sesión para contactar
      </Link>
    )
  }

  async function handleContactar() {
    setLoading(true)
    await crearOAbrirConversacion(anuncioId, arrendadorId)
  }

  if (compact) {
    return (
      <button
        onClick={handleContactar}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a3c5e] to-[#2d5a8e] text-white font-bold px-5 py-3 rounded-2xl text-sm shadow-sm hover:shadow-md transition-all disabled:opacity-60"
      >
        {loading ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
          </svg>
        ) : '💬'} Contactar
      </button>
    )
  }

  return (
    <button
      onClick={handleContactar}
      disabled={loading}
      className="w-full bg-gradient-to-r from-[#1a3c5e] to-[#2d5a8e] text-white py-3.5 rounded-2xl font-bold text-sm hover:from-[#152e4a] transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
          </svg>
          Abriendo chat…
        </>
      ) : (
        <>💬 Enviar mensaje</>
      )}
    </button>
  )
}

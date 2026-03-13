'use client'

import { crearOAbrirConversacion } from '@/app/actions/chat'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
  anuncioId: string
  arrendadorId: string
  currentUserId: string | null
  isOwner: boolean
}

export default function ContactarButton({ anuncioId, arrendadorId, currentUserId, isOwner }: Props) {
  const [loading, setLoading] = useState(false)

  if (isOwner) {
    return (
      <div className="w-full bg-[#f4f5f7] text-[#6b7280] text-center py-3 rounded-xl font-semibold text-sm">
        Este es tu anuncio
      </div>
    )
  }

  if (!currentUserId) {
    return (
      <Link
        href={`/login?next=/habitaciones/${anuncioId}`}
        className="w-full bg-[#1a3c5e] text-white text-center py-3 rounded-xl font-bold text-sm block hover:bg-[#152e4a] transition-colors"
      >
        Inicia sesión para contactar
      </Link>
    )
  }

  async function handleContactar() {
    setLoading(true)
    await crearOAbrirConversacion(anuncioId, arrendadorId)
  }

  return (
    <button
      onClick={handleContactar}
      disabled={loading}
      className="w-full bg-[#1a3c5e] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#152e4a] transition-colors disabled:opacity-60"
    >
      {loading ? 'Abriendo chat...' : '💬 Enviar mensaje'}
    </button>
  )
}

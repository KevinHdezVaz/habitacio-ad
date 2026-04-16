'use client'

import { eliminarUsuario } from '@/app/actions/admin'
import { useState } from 'react'

export default function BotonEliminarUsuario({ userId, nombre }: { userId: string; nombre: string }) {
  const [confirmando, setConfirmando] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!confirmando) {
    return (
      <button
        onClick={() => setConfirmando(true)}
        className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
      >
        Eliminar usuario
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
      <span className="text-sm text-red-700 font-medium">
        ¿Eliminar a <strong>{nombre}</strong> y todos sus datos?
      </span>
      <button
        onClick={async () => {
          setLoading(true)
          await eliminarUsuario(userId)
        }}
        disabled={loading}
        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors disabled:opacity-60"
      >
        {loading ? 'Eliminando...' : 'Confirmar'}
      </button>
      <button
        onClick={() => setConfirmando(false)}
        disabled={loading}
        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[#374151] hover:border-[#1a3c5e] transition-colors disabled:opacity-60"
      >
        Cancelar
      </button>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/ui/Spinner'
import { cambiarTipoUsuario } from '@/app/actions/admin'

export default function CambiarTipoUsuario({
  userId,
  tipoActual,
}: {
  userId: string
  tipoActual: string
}) {
  const router  = useRouter()
  const [tipo, setTipo]       = useState(tipoActual)
  const [loading, setLoading] = useState(false)

  async function handleChange(nuevoTipo: string) {
    if (nuevoTipo === tipo) return
    setLoading(true)
    const res = await cambiarTipoUsuario(userId, nuevoTipo)
    if (!res.error) {
      setTipo(nuevoTipo)
      router.refresh()
    }
    setLoading(false)
  }

  const opciones = [
    { key: 'inquilino',  label: 'Inquilino' },
    { key: 'arrendador', label: 'Propietario' },
    { key: 'admin',      label: 'Admin' },
  ]

  return (
    <div className="flex gap-1 shrink-0">
      {opciones.map((op) => {
        const isActive = tipo === op.key
        const isChanging = loading && tipo !== op.key && op.key === tipo
        return (
          <button
            key={op.key}
            onClick={() => handleChange(op.key)}
            disabled={loading}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-1 ${
              isActive
                ? op.key === 'admin'     ? 'bg-purple-600 text-white'
                : op.key === 'arrendador' ? 'bg-[#1a3c5e] text-white'
                :                          'bg-[#0ea5a0] text-white'
                : 'bg-gray-100 text-[#6b7280] hover:bg-gray-200'
            }`}
          >
            {loading && !isActive ? <Spinner size="xs" color="blue" /> : null}
            {op.label}
          </button>
        )
      })}
    </div>
  )
}

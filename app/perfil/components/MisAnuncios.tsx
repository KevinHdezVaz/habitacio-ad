'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cambiarEstadoAnuncio } from '@/app/actions/perfil'
import type { Anuncio } from '@/types'

const badgeEstado: Record<string, { bg: string; label: string }> = {
  activo:    { bg: 'bg-emerald-100 text-emerald-700', label: 'Activo' },
  pendiente: { bg: 'bg-amber-100 text-amber-700',    label: 'Pendiente' },
  inactivo:  { bg: 'bg-gray-100 text-gray-500',      label: 'Inactivo' },
}

export default function MisAnuncios({ anuncios }: { anuncios: Anuncio[] }) {
  const [estados, setEstados] = useState<Record<string, string>>(
    Object.fromEntries(anuncios.map((a) => [a.id, a.estado]))
  )
  const [loading, setLoading] = useState<string | null>(null)

  async function toggle(id: string) {
    const actual = estados[id]
    if (actual === 'pendiente') return // no puede cambiar pendientes
    const nuevo = actual === 'activo' ? 'inactivo' : 'activo'

    setLoading(id)
    const res = await cambiarEstadoAnuncio(id, nuevo as 'activo' | 'inactivo')
    if (!res.error) setEstados((prev) => ({ ...prev, [id]: nuevo }))
    setLoading(null)
  }

  if (anuncios.length === 0) {
    return (
      <div className="text-center py-10 flex flex-col items-center gap-3">
        <span className="text-4xl">📭</span>
        <p className="text-[#6b7280] text-sm">Aún no has publicado ningún anuncio.</p>
        <Link
          href="/publicar"
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a3c5e] text-white text-sm font-semibold hover:bg-[#0ea5a0] transition-colors"
        >
          Publicar mi primer anuncio
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {anuncios.map((anuncio) => {
        const estado = estados[anuncio.id] ?? anuncio.estado
        const badge  = badgeEstado[estado] ?? badgeEstado.inactivo
        const isPendiente = estado === 'pendiente'

        return (
          <div
            key={anuncio.id}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
          >
            {/* Thumb placeholder */}
            <div className="w-16 h-14 rounded-lg bg-[#f4f5f7] shrink-0 overflow-hidden">
              {anuncio.imagenes_anuncio?.[0]?.url ? (
                <img
                  src={anuncio.imagenes_anuncio[0].url}
                  alt={anuncio.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-[#1a3c5e] text-sm truncate">{anuncio.titulo}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-xs text-[#6b7280] mt-0.5">
                {anuncio.parroquia} · {anuncio.precio}€/mes
              </p>
              {isPendiente && (
                <p className="text-xs text-amber-600 mt-1">⏳ En revisión por el equipo de habitacio.ad</p>
              )}
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/habitaciones/${anuncio.id}`}
                className="px-3 py-1.5 rounded-lg bg-[#f4f5f7] hover:bg-gray-200 text-[#374151] text-xs font-medium transition-colors"
              >
                Ver
              </Link>
              <Link
                href={`/publicar/${anuncio.id}`}
                className="px-3 py-1.5 rounded-lg bg-[#e8f0fa] hover:bg-[#d4e4f7] text-[#1a3c5e] text-xs font-medium transition-colors"
              >
                ✏️ Editar
              </Link>
              {!isPendiente && (
                <button
                  onClick={() => toggle(anuncio.id)}
                  disabled={loading === anuncio.id}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                    estado === 'activo'
                      ? 'bg-red-50 hover:bg-red-100 text-red-600'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {loading === anuncio.id
                    ? '…'
                    : estado === 'activo'
                    ? 'Desactivar'
                    : 'Activar'}
                </button>
              )}
            </div>
          </div>
        )
      })}

      <div className="pt-2">
        <Link
          href="/publicar"
          className="inline-flex items-center gap-2 text-sm text-[#0ea5a0] hover:text-[#1a3c5e] font-medium transition-colors"
        >
          + Publicar otro anuncio
        </Link>
      </div>
    </div>
  )
}

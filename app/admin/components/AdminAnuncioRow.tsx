'use client'

import { useState } from 'react'
import Link from 'next/link'
import Spinner from '@/components/ui/Spinner'
import { aprobarAnuncio, rechazarAnuncio, destacarAnuncio } from '@/app/actions/admin'

type AnuncioAdmin = {
  id: string
  titulo: string
  parroquia: string
  precio: number
  estado: string
  created_at: string
  profiles: { nombre: string } | null
}

export default function AdminAnuncioRow({ anuncio }: { anuncio: AnuncioAdmin }) {
  const [estado, setEstado]       = useState(anuncio.estado)
  const [destacado, setDestacado] = useState(false)
  const [loading, setLoading]     = useState<string | null>(null)

  const fecha = new Date(anuncio.created_at).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  async function handleAprobar() {
    setLoading('aprobar')
    const res = await aprobarAnuncio(anuncio.id)
    if (!res.error) setEstado('activo')
    setLoading(null)
  }
  async function handleRechazar() {
    setLoading('rechazar')
    const res = await rechazarAnuncio(anuncio.id)
    if (!res.error) setEstado('inactivo')
    setLoading(null)
  }
  async function handleDestacar() {
    setLoading('destacar')
    const nuevoValor = !destacado
    const res = await destacarAnuncio(anuncio.id, nuevoValor)
    if (!res.error) setDestacado(nuevoValor)
    setLoading(null)
  }

  const badgeEstado: Record<string, string> = {
    pendiente: 'bg-amber-100 text-amber-700',
    activo:    'bg-emerald-100 text-emerald-700',
    inactivo:  'bg-red-100 text-red-600',
  }

  return (
    <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/admin/anuncios/${anuncio.id}`}
            className="font-medium text-[#1a3c5e] hover:text-[#0ea5a0] transition-colors truncate text-sm"
          >
            {anuncio.titulo}
          </Link>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${badgeEstado[estado] ?? 'bg-gray-100 text-gray-600'}`}>
            {estado}
          </span>
          {destacado && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 uppercase">⭐ Destacado</span>
          )}
        </div>
        <p className="text-xs text-[#6b7280] mt-0.5">
          {anuncio.profiles?.nombre ?? 'Desconocido'} · {anuncio.parroquia} · {anuncio.precio}€/mes · {fecha}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {estado === 'pendiente' && (
          <>
            <button onClick={handleAprobar} disabled={loading !== null}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-1.5">
              {loading === 'aprobar' ? <Spinner size="xs" color="white" /> : '✓'} Aprobar
            </button>
            <button onClick={handleRechazar} disabled={loading !== null}
              className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-1.5">
              {loading === 'rechazar' ? <Spinner size="xs" color="blue" /> : '✕'} Rechazar
            </button>
          </>
        )}
        {estado === 'activo' && (
          <>
            <button onClick={handleDestacar} disabled={loading !== null}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 ${destacado ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
              {loading === 'destacar' ? <Spinner size="xs" color="blue" /> : (destacado ? '★' : '☆')}
              {destacado ? 'Quitar' : 'Destacar'}
            </button>
            <button onClick={handleRechazar} disabled={loading !== null}
              className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-1.5">
              {loading === 'rechazar' ? <Spinner size="xs" color="blue" /> : null} Desactivar
            </button>
          </>
        )}
        {estado === 'inactivo' && (
          <button onClick={handleAprobar} disabled={loading !== null}
            className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-1.5">
            {loading === 'aprobar' ? <Spinner size="xs" color="teal" /> : null} Reactivar
          </button>
        )}
      </div>
    </div>
  )
}

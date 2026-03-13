'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { aprobarAnuncio, rechazarAnuncio, destacarAnuncio } from '@/app/actions/admin'

export default function AccionesAdmin({
  anuncioId,
  estadoInicial,
  destacadoInicial,
}: {
  anuncioId: string
  estadoInicial: string
  destacadoInicial: boolean
}) {
  const router = useRouter()
  const [estado, setEstado]       = useState(estadoInicial)
  const [destacado, setDestacado] = useState(destacadoInicial)
  const [loading, setLoading]     = useState<string | null>(null)
  const [msg, setMsg]             = useState<string | null>(null)

  async function handleAprobar() {
    setLoading('aprobar')
    const res = await aprobarAnuncio(anuncioId)
    if (!res.error) {
      setEstado('activo')
      setMsg('✅ Anuncio aprobado y visible públicamente.')
      router.refresh()
    }
    setLoading(null)
  }

  async function handleRechazar() {
    setLoading('rechazar')
    const res = await rechazarAnuncio(anuncioId)
    if (!res.error) {
      setEstado('inactivo')
      setMsg('Anuncio desactivado.')
      router.refresh()
    }
    setLoading(null)
  }

  async function handleDestacar() {
    setLoading('destacar')
    const nuevoValor = !destacado
    const res = await destacarAnuncio(anuncioId, nuevoValor)
    if (!res.error) {
      setDestacado(nuevoValor)
      setMsg(nuevoValor ? '⭐ Anuncio marcado como destacado.' : 'Destacado eliminado.')
      router.refresh()
    }
    setLoading(null)
  }

  return (
    <div className="flex flex-col gap-3">
      {msg && (
        <p className="text-sm text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl">{msg}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {estado === 'pendiente' && (
          <>
            <button
              onClick={handleAprobar}
              disabled={loading !== null}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading === 'aprobar' ? 'Aprobando…' : '✓ Aprobar anuncio'}
            </button>
            <button
              onClick={handleRechazar}
              disabled={loading !== null}
              className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading === 'rechazar' ? 'Rechazando…' : '✕ Rechazar'}
            </button>
          </>
        )}

        {estado === 'activo' && (
          <>
            <button
              onClick={handleDestacar}
              disabled={loading !== null}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
                destacado
                  ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {loading === 'destacar' ? '…' : destacado ? '★ Quitar destacado' : '☆ Marcar como destacado'}
            </button>
            <button
              onClick={handleRechazar}
              disabled={loading !== null}
              className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading === 'rechazar' ? '…' : 'Desactivar'}
            </button>
          </>
        )}

        {estado === 'inactivo' && (
          <button
            onClick={handleAprobar}
            disabled={loading !== null}
            className="px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loading === 'aprobar' ? '…' : 'Reactivar anuncio'}
          </button>
        )}
      </div>
    </div>
  )
}

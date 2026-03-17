'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { reactivarPerfilInquilino, ocultarPerfilInquilino, marcarPerfilCaducado } from '@/app/actions/perfiles-inquilino'
import type { PerfilInquilino } from '@/types'

const labelTipo: Record<string, string> = {
  anual: 'Todo el año', temporero: 'Temporada', ambos: 'Flexible',
}

function diasRestantes(fechaCaducidad: string) {
  const diff = new Date(fechaCaducidad).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function MiPerfilBusqueda({ perfil }: { perfil: PerfilInquilino }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dias = diasRestantes(perfil.fecha_caducidad)
  const esCaducado = perfil.estado === 'caducado' || dias === 0
  const esActivo = perfil.estado === 'activo' && dias > 0

  const alertaDias = esActivo && dias <= 7

  // Si la fecha ya pasó pero el estado aún dice 'activo', lo marcamos como caducado en la DB
  useEffect(() => {
    if (dias === 0 && perfil.estado === 'activo') {
      marcarPerfilCaducado(perfil.id)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleReactivar() {
    setLoading(true)
    setError(null)
    const res = await reactivarPerfilInquilino(perfil.id)
    setLoading(false)
    if (res.error) setError(res.error)
    else router.refresh()
  }

  async function handleOcultar() {
    setLoading(true)
    await ocultarPerfilInquilino(perfil.id)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-[#1a3c5e] text-lg">Mi perfil de búsqueda</h2>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          esCaducado
            ? 'bg-red-100 text-red-600'
            : 'bg-green-100 text-green-700'
        }`}>
          {esCaducado ? 'Caducado' : 'Activo'}
        </span>
      </div>

      {/* Info del perfil */}
      <div className="flex items-center gap-4 bg-[#f8fafc] rounded-xl p-4">
        <div className="w-12 h-12 rounded-full bg-[#1a3c5e] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {perfil.nombre?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <p className="font-bold text-[#1a3c5e]">{perfil.nombre}{perfil.edad ? `, ${perfil.edad} años` : ''}</p>
          <p className="text-xs text-[#6b7280]">
            {labelTipo[perfil.tipo_busqueda]} · Hasta {perfil.presupuesto_max}€/mes
          </p>
          {perfil.parroquias?.length > 0 && (
            <p className="text-xs text-[#9ca3af] mt-0.5">
              {perfil.parroquias.slice(0, 3).join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Estado caducidad */}
      {esCaducado ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="text-xl">⏰</span>
            <div>
              <p className="font-bold text-red-700 text-sm">Tu perfil ha caducado</p>
              <p className="text-xs text-red-600 mt-0.5">
                Ya no es visible para los propietarios. Reactívalo gratis para volver a aparecer.
              </p>
            </div>
          </div>
          <button
            onClick={handleReactivar}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#1a3c5e] text-white font-bold text-sm hover:bg-[#0ea5a0] transition-colors disabled:opacity-50"
          >
            {loading ? 'Reactivando…' : 'Reactivar gratis — 30 días más'}
          </button>
        </div>
      ) : alertaDias ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold text-amber-700 text-sm">
                Tu perfil caduca en {dias} día{dias !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Caduca el {new Date(perfil.fecha_caducidad).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}. Renuévalo ahora para no perder visibilidad.
              </p>
            </div>
          </div>
          <button
            onClick={handleReactivar}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Renovando…' : 'Renovar gratis — 30 días más'}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-green-700">Visible para propietarios</p>
              <p className="text-xs text-green-600">
                Caduca el {new Date(perfil.fecha_caducidad).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} ({dias} días)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Acciones secundarias */}
      <div className="flex gap-2 pt-1">
        <a
          href={`/perfiles/${perfil.id}`}
          className="flex-1 text-center py-2 rounded-xl border border-gray-200 text-xs font-semibold text-[#6b7280] hover:border-[#1a3c5e] hover:text-[#1a3c5e] transition-colors"
        >
          Ver mi perfil
        </a>
        <button
          onClick={handleOcultar}
          disabled={loading}
          className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-[#6b7280] hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-40"
        >
          Ocultar perfil
        </button>
      </div>
    </div>
  )
}

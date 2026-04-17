'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import { Anuncio } from '@/types'
import TarjetaHabitacion from '@/components/habitaciones/TarjetaHabitacion'

const PARROQUIAS = [
  'Andorra la Vella',
  'Escaldes-Engordany',
  'Encamp',
  'Sant Julià de Lòria',
  'La Massana',
  'Ordino',
  'Canillo',
]

export default function HabitacionesPage() {
  const t = useTranslations('rooms')
  const searchParams = useSearchParams()
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [filtros, setFiltros] = useState({
    parroquia:      searchParams.get('parroquia')      ?? '',
    precioMin:      searchParams.get('precio_min')     ?? '',
    precioMax:      searchParams.get('precio_max')     ?? '',
    tipoEstancia:   searchParams.get('tipo_estancia')  ?? '',
    fianza:         '',
    gastosIncluidos:'',
    admitePareja:   '',
    admiteMascotas: '',
    fumadores:      '',
    orden:          'recientes',
  })

  useEffect(() => {
    cargarAnuncios()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros])

  async function cargarAnuncios() {
    setCargando(true)
    let query = supabase
      .from('anuncios')
      .select('*, imagenes_anuncio(*)')
      .eq('estado', 'activo')

    if (filtros.parroquia) query = query.eq('parroquia', filtros.parroquia)
    if (filtros.precioMin) query = query.gte('precio', Number(filtros.precioMin))
    if (filtros.precioMax) query = query.lte('precio', Number(filtros.precioMax))
    if (filtros.tipoEstancia) query = query.eq('tipo_estancia', filtros.tipoEstancia)
    if (filtros.fianza) query = query.eq('fianza', filtros.fianza === 'si')
    if (filtros.gastosIncluidos) query = query.eq('gastos_incluidos', filtros.gastosIncluidos === 'si')
    if (filtros.admitePareja) query = query.eq('admite_pareja', filtros.admitePareja === 'si')
    if (filtros.admiteMascotas) query = query.eq('admite_mascotas', filtros.admiteMascotas === 'si')
    if (filtros.fumadores) query = query.eq('fumadores', filtros.fumadores === 'si')

    if (filtros.orden === 'precio_asc') query = query.order('precio', { ascending: true })
    else if (filtros.orden === 'precio_desc') query = query.order('precio', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data } = await query
    setAnuncios((data as Anuncio[]) ?? [])
    setCargando(false)
  }

  function actualizarFiltro(key: string, valor: string) {
    setFiltros((prev) => ({ ...prev, [key]: valor }))
  }

  function limpiarFiltros() {
    setFiltros({ parroquia: '', precioMin: '', precioMax: '', tipoEstancia: '', fianza: '', gastosIncluidos: '', admitePareja: '', admiteMascotas: '', fumadores: '', orden: 'recientes' })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Cabecera */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a3c5e]">{t('title')}</h1>
        <p className="text-[#6b7280] text-sm">{t('available', { count: anuncios.length })}</p>
      </div>

      {/* Ordenación + Filtros en la misma línea */}
      <div className="flex items-center gap-2">
        <select
          value={filtros.orden}
          onChange={(e) => actualizarFiltro('orden', e.target.value)}
          className="flex-1 bg-white border border-[#e5e7eb] rounded-xl px-3 py-2 text-sm font-medium text-[#1a3c5e] shadow-sm appearance-none"
        >
          <option value="recientes">{t('sortRecent')}</option>
          <option value="precio_asc">{t('sortPriceAsc')}</option>
          <option value="precio_desc">{t('sortPriceDesc')}</option>
        </select>
        <button
          onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border shadow-sm transition-colors ${
            filtrosAbiertos ? 'bg-[#1a3c5e] text-white border-[#1a3c5e]' : 'bg-white text-[#1a3c5e] border-[#e5e7eb]'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          {t('filters')}
        </button>
      </div>

      {/* Panel de filtros */}
      {filtrosAbiertos && (
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="font-bold text-[#1a3c5e]">{t('filters')}</p>
            <button onClick={limpiarFiltros} className="text-sm font-medium text-[#6b7280] underline underline-offset-2">
              {t('clearFilters')}
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-[#6b7280] mb-1 block">{t('parish')}</label>
            <select
              value={filtros.parroquia}
              onChange={(e) => actualizarFiltro('parroquia', e.target.value)}
              className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 text-sm text-[#1a3c5e]"
            >
              <option value="">{t('allParishes')}</option>
              {PARROQUIAS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1 block">{t('minPrice')}</label>
              <input type="number" value={filtros.precioMin} onChange={(e) => actualizarFiltro('precioMin', e.target.value)} placeholder="0" className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 text-sm text-[#1a3c5e]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1 block">{t('maxPrice')}</label>
              <input type="number" value={filtros.precioMax} onChange={(e) => actualizarFiltro('precioMax', e.target.value)} placeholder="2000" className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 text-sm text-[#1a3c5e]" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#6b7280] mb-2 block">{t('stayType')}</label>
            <div className="flex gap-2">
              {[
                { label: t('all'), valor: '' },
                { label: t('annual'), valor: 'anual' },
                { label: t('seasonal'), valor: 'temporero' },
                { label: t('both'), valor: 'ambos' },
              ].map((op) => (
                <button
                  key={op.valor}
                  onClick={() => actualizarFiltro('tipoEstancia', op.valor)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                    filtros.tipoEstancia === op.valor ? 'bg-[#1a3c5e] text-white' : 'bg-[#f4f5f7] text-[#6b7280]'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'gastosIncluidos', label: t('expensesIncluded') },
              { key: 'fianza', label: t('withDeposit') },
              { key: 'admitePareja', label: t('coupleAllowed') },
              { key: 'admiteMascotas', label: t('petsAllowed') },
              { key: 'fumadores', label: t('smoking') },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-xs font-medium text-[#6b7280] mb-1 block">{label}</label>
                <select
                  value={filtros[key as keyof typeof filtros]}
                  onChange={(e) => actualizarFiltro(key, e.target.value)}
                  className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 text-sm text-[#1a3c5e]"
                >
                  <option value="">{t('indifferent')}</option>
                  <option value="si">{t('yes')}</option>
                  <option value="no">{t('no')}</option>
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={() => setFiltrosAbiertos(false)}
            className="w-full bg-[#1a3c5e] text-white font-semibold py-3 rounded-xl text-sm"
          >
            {t('applyFilters')}
          </button>
        </div>
      )}

      {/* Resultados */}
      {cargando ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-video bg-gray-200" />
              <div className="p-3 flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : anuncios.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-[#eef2f8] rounded-2xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1a3c5e" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/>
            </svg>
          </div>
          <p className="font-bold text-[#1a3c5e]">{t('noResults')}</p>
          <button onClick={limpiarFiltros} className="text-sm font-medium text-[#6b7280] underline underline-offset-2">
            {t('clearFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 stagger-children">
          {anuncios.map((anuncio) => (
            <TarjetaHabitacion key={anuncio.id} anuncio={anuncio} />
          ))}
        </div>
      )}

      {/* Banner CTA al pie de los resultados */}
      {!cargando && anuncios.length > 0 && (
        <div className="mt-2 bg-[#eef2f8] border border-[#c7d4e8] rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-[#1a3c5e] text-sm">{t('ctaTitle')}</p>
            <p className="text-[#6b7280] text-xs mt-0.5">{t('ctaText')}</p>
          </div>
          <a
            href="/buscar-habitacion"
            className="shrink-0 bg-[#1a3c5e] text-white text-sm font-semibold px-5 py-2.5 rounded-xl whitespace-nowrap"
          >
            {t('ctaBtn')}
          </a>
        </div>
      )}
    </div>
  )
}

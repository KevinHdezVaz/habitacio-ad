import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase-server'
import { Anuncio } from '@/types'

export default async function Home() {
  const t = await getTranslations('home')

  // Últimas habitaciones desde Supabase
  const supabase = await createClient()
  const { data: anuncios } = await supabase
    .from('anuncios')
    .select('*, imagenes_anuncio(*)')
    .eq('estado', 'activo')
    .order('created_at', { ascending: false })
    .limit(4)

  const ultimasHabitaciones: Anuncio[] = anuncios ?? []

  const acciones = [
    {
      icono: '🔍',
      titulo: t('buscarHabitacion'),
      subtitulo: t('buscarHabitacionSub'),
      href: '/habitaciones',
      color: '#1a3c5e',
      bg: '#e8f4fd',
    },
    {
      icono: '🏠',
      titulo: t('publicarHabitacion'),
      subtitulo: t('publicarHabitacionSub'),
      href: '/publicar',
      color: '#1a3c5e',
      bg: '#e6f7f7',
    },
    {
      icono: '🙋',
      titulo: t('encontrarme'),
      subtitulo: t('encontrarmeSub'),
      href: '/buscar-habitacion',
      color: '#1a3c5e',
      bg: '#e6f7f7',
    },
    {
      icono: '👥',
      titulo: t('verPerfiles'),
      subtitulo: "",
      href: '/perfiles',
      color: '#1a3c5e',
      bg: '#e8edf2',
    },
  ]

  const porqueItems = [
    t('porqueItem1'),
    t('porqueItem2'),
    t('porqueItem3'),
    t('porqueItem4'),
  ]

  return (
    <div className="flex flex-col gap-8">

      {/* ── HERO con imagen de fondo ──────────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden -mx-4 min-h-[260px]"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay degradado blanco */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/88 via-white/78 to-white/50" />

        <div className="relative z-10 px-4 pt-7 pb-5">
          <h1 className="text-[28px] font-extrabold text-[#1a3c5e] leading-tight">
            {t('heroTitle')}{' '}
            <span className="text-[#0ea5a0]">{t('andorra')},</span>
            <br />
            sin perder tiempo
          </h1>
          <p className="text-[#4b5563] mt-2 text-sm leading-relaxed">
            Anuncios claros, perfiles reales y opciones para todo el año o temporada
          </p>

          {/* Buscador rápido */}
          <form
            action="/habitaciones"
            method="get"
            className="mt-4 bg-white rounded-2xl shadow-lg p-3 flex flex-col gap-2"
          >
            {/* Fila de selects */}
            <div className="flex gap-2">
              <select
                name="parroquia"
                className="flex-1 text-sm text-[#1a3c5e] font-medium bg-[#f4f7fa] border-0 outline-none cursor-pointer rounded-xl px-3 py-2.5"
              >
                <option value="">Zona</option>
                <option value="Andorra la Vella">Andorra la Vella</option>
                <option value="Escaldes-Engordany">Escaldes-Engordany</option>
                <option value="Encamp">Encamp</option>
                <option value="La Massana">La Massana</option>
                <option value="Ordino">Ordino</option>
                <option value="Sant Julià de Lòria">Sant Julià de Lòria</option>
                <option value="Canillo">Canillo</option>
              </select>

              <select
                name="precio_max"
                className="flex-1 text-sm text-[#1a3c5e] font-medium bg-[#f4f7fa] border-0 outline-none cursor-pointer rounded-xl px-3 py-2.5"
              >
                <option value="">Presupuesto</option>
                <option value="400">Hasta 400 €</option>
                <option value="600">Hasta 600 €</option>
                <option value="800">Hasta 800 €</option>
                <option value="1200">Hasta 1.200 €</option>
              </select>
            </div>

            {/* Segunda fila: tipo estancia + botón */}
            <div className="flex gap-2">
              <select
                name="tipo_estancia"
                className="flex-1 text-sm text-[#1a3c5e] font-medium bg-[#f4f7fa] border-0 outline-none cursor-pointer rounded-xl px-3 py-2.5"
              >
                <option value="">Tipo de estancia</option>
                <option value="anual">Todo el año</option>
                <option value="temporero">Temporada</option>
              </select>

              <button
                type="submit"
                className="bg-[#1a3c5e] text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#152f4a] transition-colors flex-shrink-0 whitespace-nowrap"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                Buscar
              </button>
            </div>
          </form>

          {/* Stats bar */}
          <div className="mt-3 bg-[#1a3c5e]/90 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-4">
            <span className="text-xs font-semibold text-white">
              +&nbsp;<span className="text-white font-bold">120</span> perfiles activos
            </span>
            <div className="w-px h-3.5 bg-white/20" />
            <span className="text-xs font-medium text-white flex items-center gap-1.5" id="stats-habitaciones">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nuevas habitaciones cada semana
            </span>
          </div>
        </div>
      </div>

      {/* ── ¿QUÉ NECESITAS? ───────────────────────────────────────────────── */}
      <div>
        <h2 className="font-bold text-[#1a3c5e] text-lg mb-3">{t('queNecesitas')}</h2>
        <div className="grid grid-cols-2 gap-3">
          {acciones.map((accion) => (
            <div
              key={accion.titulo}
              className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: accion.bg }}
              >
                {accion.icono}
              </div>
              <div>
                <p className="font-bold text-sm leading-tight" style={{ color: accion.color }}>
                  {accion.titulo}
                </p>
                <p className="text-[#9ca3af] text-xs mt-1">{accion.subtitulo} →</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ÚLTIMAS HABITACIONES (datos reales) ──────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-[#1a3c5e] text-lg">{t('ultimasHabitaciones')}</h2>
          <span className="text-[#0ea5a0] text-sm font-semibold">{t('verTodas')}</span>
        </div>

        {ultimasHabitaciones.length === 0 ? (
          <p className="text-center text-[#9ca3af] text-sm py-8">Aún no hay habitaciones publicadas.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {ultimasHabitaciones.map((hab) => {
              const imagen = hab.imagenes_anuncio?.[0]?.url ?? null
              const tipoLabel = hab.tipo_estancia === 'anual' ? 'Todo el año' : hab.tipo_estancia === 'temporero' ? 'Temporada' : 'Anual / Temporada'
              const disponibleLabel = hab.disponible_desde
                ? new Date(hab.disponible_desde) <= new Date()
                  ? 'Disponible ahora'
                  : `Disponible: ${new Date(hab.disponible_desde).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`
                : 'Disponible ahora'

              return (
                <div
                  key={hab.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col"
                >
                  {/* Imagen — altura fija */}
                  <div className="relative h-[280px] flex-shrink-0 bg-[#f4f7fa]">
                    {imagen ? (
                      <img src={imagen} alt={hab.titulo} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🏠</div>
                    )}
                    <div className="absolute top-2 left-2 bg-white rounded-full px-2 py-0.5 text-[11px] font-bold text-[#1a3c5e] shadow">
                      {hab.precio} €/mes
                    </div>
                    {hab.destacado && (
                      <div className="absolute top-2 right-2 bg-[#f59e0b] rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow">
                        Destacado
                      </div>
                    )}
                  </div>

                  {/* Info — altura fija */}
                  <div className="p-2.5 flex flex-col gap-1 h-[130px] overflow-hidden">
                    <p className="font-bold text-[13px] text-[#1a3c5e] leading-tight">{hab.precio} €/mes</p>
                    <p className="text-[11px] text-[#6b7280] font-medium truncate">{hab.parroquia}</p>
                    <p className="text-[11px] text-[#6b7280] truncate">{tipoLabel} →</p>
                    <p className="text-[11px] text-[#6b7280] flex items-center gap-1">
                      <span className="flex-shrink-0">📅</span>
                      <span className="truncate">{disponibleLabel}</span>
                    </p>
                    <p className="text-[11px] text-[#6b7280] flex items-center gap-1">
                      <span className="flex-shrink-0">💰</span>
                      <span className="truncate">{hab.gastos_incluidos ? 'Gastos incluidos' : 'Gastos no incluidos'} →</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── POR QUÉ + NO ENCUENTRAS ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Izquierda: checklist */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <h2 className="font-bold text-[#1a3c5e] text-sm leading-snug">{t('porqueTitle')}</h2>
          <ul className="flex flex-col gap-2">
            {porqueItems.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-[#374151]">
                <span className="w-4 h-4 rounded-full bg-[#0ea5a0] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="font-medium leading-snug">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-[#9ca3af] leading-relaxed">{t('porqueFooter')}</p>
        </div>

        {/* Derecha: No encuentras habitación */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2.5">
          <h2 className="font-bold text-sm text-[#1a3c5e] leading-snug">{t('noEncuentrasTitle')}</h2>
          <p className="text-[#6b7280] text-[11px] leading-relaxed">{t('noEncuentrasDesc')}</p>
          <span className="mt-auto inline-block bg-[#1a3c5e] text-white font-bold text-[11px] text-center py-2.5 px-3 rounded-xl">
            {t('noEncuentrasBtn')}
          </span>
        </div>
      </div>

    </div>
  )
}

import { getTranslations } from 'next-intl/server'

export default async function Home() {
  const t = await getTranslations('home')

  const acciones = [
    {
      icono: '🔍',
      titulo: t('buscarHabitacion'),
      subtitulo: t('buscarHabitacionSub'),
      href: '/habitaciones',
      color: '#2980b9',
      bg: '#e8f4fd',
    },
    {
      icono: '🏠',
      titulo: t('publicarHabitacion'),
      subtitulo: t('publicarHabitacionSub'),
      href: '/publicar',
      color: '#0ea5a0',
      bg: '#e6f7f7',
    },
    {
      icono: '🙋',
      titulo: t('encontrarme'),
      subtitulo: t('encontrarmeSub'),
      href: '/buscar-habitacion',
      color: '#0ea5a0',
      bg: '#e6f7f7',
    },
    {
      icono: '👥',
      titulo: t('verPerfiles'),
      subtitulo: t('verPerfilesSub'),
      href: '/perfiles',
      color: '#1a3c5e',
      bg: '#e8edf2',
    },
  ]

  const ultimasHabitaciones = [
    {
      precio: 570,
      parroquia: 'Andorra la Vella',
      imagen: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
      tipo: 'Todo el año',
      perfil: 'Larga estancia',
      disponible: null,
      gastosIncluidos: true,
      destacado: false,
    },
    {
      precio: 650,
      parroquia: 'Escaldes-Engordany',
      imagen: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400',
      tipo: 'Temporada',
      perfil: 'Temporeros',
      disponible: '2 de mayo',
      gastosIncluidos: false,
      destacado: true,
    },
    {
      precio: 490,
      parroquia: 'Encamp',
      imagen: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400',
      tipo: 'Todo el año',
      perfil: 'Larga estancia',
      disponible: null,
      gastosIncluidos: true,
      destacado: false,
    },
    {
      precio: 720,
      parroquia: 'Sant Julià de Lòria',
      imagen: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
      tipo: 'Temporada',
      perfil: 'Trabajadores',
      disponible: '15 de abril',
      gastosIncluidos: false,
      destacado: false,
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
      <div className="relative rounded-2xl overflow-hidden -mx-4">
        {/* Imagen de fondo */}
        <img
          src="https://images.unsplash.com/photo-1601827688494-97f0cce3ad34?w=800&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlay blanco degradado */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/85 to-white/60" />

        <div className="relative z-10 px-4 pt-7 pb-5">
          <h1 className="text-[28px] font-extrabold text-[#1a3c5e] leading-tight">
            {t('heroTitle')}{' '}
            <span className="text-[#0ea5a0]">{t('andorra')},</span>
            <br />
            <span className="font-extrabold">sin perder tiempo</span>
          </h1>
          <p className="text-[#4b5563] mt-2 text-sm leading-relaxed">
            Anuncios claros, perfiles reales y opciones para todo el año o temporada
          </p>

          {/* Buscador rápido */}
          <form
            action="/habitaciones"
            method="get"
            className="mt-4 bg-white rounded-2xl shadow-md p-3 flex flex-wrap gap-2 items-center"
          >
            <select
              name="parroquia"
              className="flex-1 min-w-[90px] text-sm text-[#1a3c5e] font-medium bg-transparent border-0 outline-none cursor-pointer"
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

            <div className="w-px h-5 bg-[#e5e7eb]" />

            <select
              name="precio_max"
              className="flex-1 min-w-[100px] text-sm text-[#1a3c5e] font-medium bg-transparent border-0 outline-none cursor-pointer"
            >
              <option value="">Presupuesto</option>
              <option value="400">Hasta 400 €</option>
              <option value="600">Hasta 600 €</option>
              <option value="800">Hasta 800 €</option>
              <option value="1200">Hasta 1200 €</option>
            </select>

            <div className="w-px h-5 bg-[#e5e7eb]" />

            <select
              name="tipo_estancia"
              className="flex-1 min-w-[90px] text-sm text-[#1a3c5e] font-medium bg-transparent border-0 outline-none cursor-pointer"
            >
              <option value="">Todo el año</option>
              <option value="anual">Todo el año</option>
              <option value="temporero">Temporada</option>
            </select>

            <button
              type="submit"
              className="bg-[#1a3c5e] text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#152f4a] transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Buscar →
            </button>
          </form>

          {/* Stats bar */}
          <div className="mt-3 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-4">
            <span className="text-xs font-semibold text-[#1a3c5e]">
              + <span className="text-[#0ea5a0]">120</span> perfiles activos
            </span>
            <div className="w-px h-3.5 bg-[#cbd5e1]" />
            <span className="text-xs font-medium text-[#4b5563] flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[#0ea5a0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
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
            <a
              key={accion.titulo}
              href={accion.href}
              className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow active:scale-95"
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
            </a>
          ))}
        </div>
      </div>

      {/* ── ÚLTIMAS HABITACIONES ──────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-[#1a3c5e] text-lg">{t('ultimasHabitaciones')}</h2>
          <a href="/habitaciones" className="text-[#0ea5a0] text-sm font-semibold">{t('verTodas')}</a>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {ultimasHabitaciones.map((hab, i) => (
            <a key={i} href="/habitaciones" className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {/* Imagen */}
              <div className="relative aspect-[4/3]">
                <img src={hab.imagen} alt="Habitació" className="w-full h-full object-cover" />
                {/* Precio */}
                <div className="absolute top-2 left-2 bg-white rounded-full px-2 py-0.5 text-[11px] font-bold text-[#1a3c5e] shadow">
                  {hab.precio} €/mes
                </div>
                {/* Badge destacado */}
                {hab.destacado && (
                  <div className="absolute top-2 right-2 bg-[#f59e0b] rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow">
                    Destacado
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2.5 flex flex-col gap-1.5">
                <div>
                  <p className="font-bold text-[13px] text-[#1a3c5e]">{hab.precio} €/mes</p>
                  <p className="text-[11px] text-[#6b7280] font-medium">{hab.parroquia}</p>
                </div>
                <p className="text-[11px] text-[#6b7280]">
                  {hab.tipo} · {hab.perfil} →
                </p>
                <p className="text-[11px] text-[#6b7280] flex items-center gap-1">
                  <span>📅</span>
                  {hab.disponible ? `Disponible: ${hab.disponible}` : 'Disponible ahora'}
                </p>
                <p className="text-[11px] text-[#6b7280] flex items-center gap-1">
                  <span>💰</span>
                  {hab.gastosIncluidos ? 'Gastos incluidos' : 'Gastos no incluidos'} →
                </p>
              </div>
            </a>
          ))}
        </div>
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
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="font-medium leading-snug">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-[#9ca3af] leading-relaxed">{t('porqueFooter')}</p>
        </div>

        {/* Derecha: No encuentras habitación */}
        <div className="bg-gradient-to-br from-[#1a3c5e] to-[#2d5a8e] rounded-2xl p-4 shadow-sm flex flex-col gap-2.5 text-white">
          <h2 className="font-bold text-sm leading-snug">{t('noEncuentrasTitle')}</h2>
          <p className="text-[#a8c0d6] text-[11px] leading-relaxed">{t('noEncuentrasDesc')}</p>
          <a
            href="/buscar-habitacion"
            className="mt-auto inline-block bg-[#0ea5a0] text-white font-bold text-[11px] text-center py-2.5 px-3 rounded-xl hover:bg-[#0d8f8a] transition-colors"
          >
            {t('noEncuentrasBtn')}
          </a>
        </div>
      </div>

    </div>
  )
}

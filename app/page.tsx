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
    { precio: 570, parroquia: 'Andorra la Vella', imagen: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400' },
    { precio: 680, parroquia: 'Escaldes', imagen: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400' },
    { precio: 490, parroquia: 'Encamp', imagen: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400' },
    { precio: 620, parroquia: 'Sant Julià', imagen: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400' },
  ]

  const ventajas = [
    { icono: '✅', titulo: t('infoClara'),      texto: t('infoClaraText') },
    { icono: '🏔️', titulo: t('paraResidentes'), texto: t('paraResidentesText') },
    { icono: '💬', titulo: t('contactoDirecto'), texto: t('contactoDirectoText') },
    { icono: '📱', titulo: t('facilMovil'),      texto: t('facilMovilText') },
  ]

  return (
    <div className="flex flex-col gap-8">

      {/* HERO */}
      <div className="pt-2">
        <h1 className="text-3xl font-bold text-[#1a3c5e] leading-tight">
          {t('heroTitle')}{' '}
          <span className="text-[#0ea5a0]">{t('andorra')}</span>
        </h1>
        <p className="text-[#6b7280] mt-2 text-base">{t('heroSubtitle')}</p>
        <div className="flex gap-3 mt-4">
          <a href="/habitaciones"
            className="flex-1 bg-[#1a3c5e] text-white text-center py-3 rounded-xl font-semibold text-sm"
          >
            {t('buscarHabitacion')}
          </a>
          <a href="/publicar"
            className="flex-1 border-2 border-[#1a3c5e] text-[#1a3c5e] text-center py-3 rounded-xl font-semibold text-sm"
          >
            {t('publicarGratis')}
          </a>
        </div>
      </div>

      {/* 4 ACCIONES */}
      <div>
        <h2 className="font-bold text-[#1a3c5e] text-lg mb-3">{t('queNecesitas')}</h2>
        <div className="grid grid-cols-2 gap-3 stagger-children">
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
                <p className="text-[#9ca3af] text-xs mt-1">{accion.subtitulo} &rarr;</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ÚLTIMAS HABITACIONES */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-[#1a3c5e] text-lg">{t('ultimasHabitaciones')}</h2>
          <a href="/habitaciones" className="text-[#0ea5a0] text-sm font-semibold">{t('verTodas')}</a>
        </div>
        <div className="grid grid-cols-2 gap-3 stagger-children">
          {ultimasHabitaciones.map((hab, i) => (
            <a key={i} href="/habitaciones" className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-square">
                <img src={hab.imagen} alt="Habitació" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-white rounded-full px-2 py-1 text-xs font-bold text-[#1a3c5e] shadow">
                  {hab.precio} €/mes
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-[#6b7280] font-medium">{hab.parroquia}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* VENTAJAS */}
      <div>
        <h2 className="font-bold text-[#1a3c5e] text-lg mb-3">{t('porqueTitle')}</h2>
        <div className="flex flex-col gap-3 stagger-children">
          {ventajas.map((v) => (
            <div key={v.titulo} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 items-start">
              <span className="text-2xl">{v.icono}</span>
              <div>
                <p className="font-bold text-[#1a3c5e] text-sm">{v.titulo}</p>
                <p className="text-[#6b7280] text-xs mt-1">{v.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA FINAL */}
      <div className="bg-[#1a3c5e] rounded-2xl p-6 text-center">
        <h2 className="text-white font-bold text-xl mb-2">{t('ctaTitle')}</h2>
        <p className="text-[#a8c0d6] text-sm mb-4">{t('ctaSubtitle')}</p>
        <a href="/publicar" className="inline-block bg-[#0ea5a0] text-white font-semibold px-6 py-3 rounded-xl text-sm">
          {t('ctaBtn')}
        </a>
      </div>

    </div>
  )
}

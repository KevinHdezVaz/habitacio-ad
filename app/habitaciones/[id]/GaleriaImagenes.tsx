'use client'

import { useState, useEffect, useCallback } from 'react'

interface Props {
  imagenes: { url: string }[]
  titulo: string
}

export default function GaleriaImagenes({ imagenes, titulo }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [indiceActual, setIndiceActual]   = useState(0)

  const total = imagenes.length
  const imgPrincipal   = imagenes[0]?.url ?? 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
  const imgSecundarias = imagenes.slice(1, 5) // hasta 4 secundarias

  const abrirLightbox = (i: number) => {
    setIndiceActual(i)
    setLightboxOpen(true)
  }

  const cerrar = () => setLightboxOpen(false)

  const anterior = useCallback(() => {
    setIndiceActual((prev) => (prev - 1 + total) % total)
  }, [total])

  const siguiente = useCallback(() => {
    setIndiceActual((prev) => (prev + 1) % total)
  }, [total])

  // Navegación con teclado
  useEffect(() => {
    if (!lightboxOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')      cerrar()
      if (e.key === 'ArrowLeft')   anterior()
      if (e.key === 'ArrowRight')  siguiente()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, anterior, siguiente])

  // Bloquear scroll cuando el lightbox está abierto
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  return (
    <>
      {/* ── GRID ESTILO AIRBNB ─────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden">
        {total === 0 ? (
          <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-3xl">
            <span className="text-4xl">🏠</span>
          </div>
        ) : total === 1 ? (
          /* Solo 1 imagen — full width */
          <button
            onClick={() => abrirLightbox(0)}
            className="w-full aspect-video block group"
            aria-label="Ver foto"
          >
            <img
              src={imgPrincipal}
              alt={titulo}
              className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-200"
            />
          </button>
        ) : total === 2 ? (
          /* 2 imágenes — 50/50 */
          <div className="grid grid-cols-2 gap-2 aspect-[16/9]">
            {imagenes.slice(0, 2).map((img, i) => (
              <button key={i} onClick={() => abrirLightbox(i)} className="overflow-hidden group h-full">
                <img src={img.url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-200" />
              </button>
            ))}
          </div>
        ) : (
          /* 3+ imágenes — grid Airbnb */
          <div className="grid grid-cols-4 grid-rows-2 gap-2" style={{ height: '420px' }}>
            {/* Imagen principal — ocupa col 1-2, row 1-2 */}
            <button
              onClick={() => abrirLightbox(0)}
              className="col-span-2 row-span-2 overflow-hidden group relative"
              aria-label="Ver foto principal"
            >
              <img
                src={imgPrincipal}
                alt={titulo}
                className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-200"
              />
            </button>

            {/* Secundarias — col 3-4 */}
            {imgSecundarias.map((img, i) => {
              const esUltima     = i === imgSecundarias.length - 1
              const hayMas       = total > 5
              const mostrarBadge = esUltima && hayMas

              return (
                <button
                  key={i}
                  onClick={() => abrirLightbox(i + 1)}
                  className="overflow-hidden group relative"
                  aria-label={`Ver foto ${i + 2}`}
                >
                  <img
                    src={img.url}
                    alt={`Foto ${i + 2}`}
                    className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-200"
                  />
                  {/* Badge "Mostrar todas las fotos" en la última celda */}
                  {mostrarBadge && (
                    <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                      <span className="flex items-center gap-1.5 bg-white text-[#1a3c5e] text-xs font-bold px-3 py-2 rounded-xl shadow-md">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                        </svg>
                        +{total - 5} fotos más
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Botón "Mostrar todas las fotos" superpuesto — esquina inferior derecha */}
        {total > 1 && (
          <button
            onClick={() => abrirLightbox(0)}
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[#1a3c5e] text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:bg-white hover:shadow-lg transition-all border border-white/80"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
            Mostrar todas las fotos ({total})
          </button>
        )}
      </div>

      {/* ── LIGHTBOX ───────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col"
          style={{ backgroundColor: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) cerrar() }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
            <p className="text-white/70 text-sm font-medium select-none">
              {indiceActual + 1} / {total}
            </p>
            <p className="text-white font-semibold text-sm truncate max-w-xs text-center">{titulo}</p>
            <button
              onClick={cerrar}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors text-white"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Imagen central — ocupa todo el espacio disponible */}
          <div className="flex-1 flex items-center justify-center relative" style={{ minHeight: 0 }}>
            {/* Flecha izquierda */}
            {total > 1 && (
              <button
                onClick={anterior}
                className="absolute left-3 sm:left-5 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors text-white border border-white/10"
                aria-label="Anterior"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
            )}

            {/* Imagen centrada con límites de viewport */}
            <img
              key={indiceActual}
              src={imagenes[indiceActual]?.url}
              alt={`${titulo} — foto ${indiceActual + 1}`}
              className="object-contain rounded-xl select-none"
              style={{
                maxWidth: '88vw',
                maxHeight: '72vh',
                animation: 'fadeIn 0.15s ease',
              }}
              draggable={false}
            />

            {/* Flecha derecha */}
            {total > 1 && (
              <button
                onClick={siguiente}
                className="absolute right-3 sm:right-5 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors text-white border border-white/10"
                aria-label="Siguiente"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            )}
          </div>

          {/* Miniaturas */}
          {total > 1 && (
            <div className="flex-shrink-0 px-4 pb-5 pt-2">
              <div className="flex gap-2 overflow-x-auto justify-center scrollbar-hide">
                {imagenes.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setIndiceActual(i)}
                    className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      i === indiceActual
                        ? 'border-white scale-105 shadow-lg'
                        : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                    aria-label={`Foto ${i + 1}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'

interface Props {
  imagenes: { url: string }[]
  titulo: string
}

export default function GaleriaImagenes({ imagenes, titulo }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [indiceActual, setIndiceActual] = useState(0)

  const total = imagenes.length
  const imgPrincipal = imagenes[0]?.url ?? 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
  const imgSecundarias = imagenes.slice(1, 5)

  const abrirLightbox = (i: number) => {
    setIndiceActual(i)
    setLightboxOpen(true)
  }
  const cerrar = () => setLightboxOpen(false)

  const anterior = useCallback(() => setIndiceActual((p) => (p - 1 + total) % total), [total])
  const siguiente = useCallback(() => setIndiceActual((p) => (p + 1) % total), [total])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar()
      if (e.key === 'ArrowLeft') anterior()
      if (e.key === 'ArrowRight') siguiente()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, anterior, siguiente])

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  return (
    <>
      {/* ── GRID GALERÍA ───────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden">
        {total === 0 ? (
          <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-3xl">
            <span className="text-4xl">🏠</span>
          </div>
        ) : total === 1 ? (
          <button onClick={() => abrirLightbox(0)} className="w-full aspect-video block group" aria-label="Ver foto">
            <img src={imgPrincipal} alt={titulo} className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-200" />
          </button>
        ) : total === 2 ? (
          <div className="grid grid-cols-2 gap-2 aspect-[16/9]">
            {imagenes.slice(0, 2).map((img, i) => (
              <button key={i} onClick={() => abrirLightbox(i)} className="overflow-hidden group h-full">
                <img src={img.url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-200" />
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 grid-rows-2 gap-2" style={{ height: '420px' }}>
            <button onClick={() => abrirLightbox(0)} className="col-span-2 row-span-2 overflow-hidden group relative" aria-label="Ver foto principal">
              <img src={imgPrincipal} alt={titulo} className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-200" />
            </button>
            {imgSecundarias.map((img, i) => {
              const esUltima = i === imgSecundarias.length - 1
              const mostrarBadge = esUltima && total > 5
              return (
                <button key={i} onClick={() => abrirLightbox(i + 1)} className="overflow-hidden group relative" aria-label={`Ver foto ${i + 2}`}>
                  <img src={img.url} alt={`Foto ${i + 2}`} className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-200" />
                  {mostrarBadge && (
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                      <span className="bg-white text-[#1a3c5e] text-xs font-bold px-3 py-1.5 rounded-xl shadow">+{total - 5} fotos</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {total > 1 && (
          <button
            onClick={() => abrirLightbox(0)}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-[#1a3c5e] text-xs font-bold px-3 py-2 rounded-xl shadow-md hover:bg-white transition-all"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
            </svg>
            Ver {total} fotos
          </button>
        )}
      </div>

      {/* ── LIGHTBOX ───────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black flex flex-col"
          style={{ height: '100dvh', top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) cerrar() }}
        >
          {/* Barra superior: contador + cerrar */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
            <span className="text-white/60 text-sm select-none tabular-nums">
              {indiceActual + 1} / {total}
            </span>
            <button
              onClick={cerrar}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Imagen + flechas — ocupa todo el espacio disponible */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden min-h-0">
            {/* Flecha izquierda */}
            {total > 1 && (
              <button
                onClick={anterior}
                className="absolute left-2 sm:left-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                aria-label="Anterior"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Imagen */}
            <img
              key={indiceActual}
              src={imagenes[indiceActual]?.url}
              alt={`${titulo} — foto ${indiceActual + 1}`}
              className="select-none rounded-lg"
              style={{
                maxWidth: 'calc(100vw - 80px)',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                animation: 'fadeIn 0.12s ease',
              }}
              draggable={false}
            />

            {/* Flecha derecha */}
            {total > 1 && (
              <button
                onClick={siguiente}
                className="absolute right-2 sm:right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                aria-label="Siguiente"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Miniaturas inferiores */}
          {total > 1 && (
            <div className="flex-shrink-0 px-4 pb-4 pt-2">
              <div className="flex gap-1.5 overflow-x-auto justify-center scrollbar-hide">
                {imagenes.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setIndiceActual(i)}
                    className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all ${i === indiceActual
                      ? 'ring-2 ring-white opacity-100'
                      : 'opacity-40 hover:opacity-70'
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
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  )
}

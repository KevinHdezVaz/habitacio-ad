'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  imagenes: { url: string }[]
  titulo: string
}

export default function GaleriaImagenes({ imagenes, titulo }: Props) {
  const [lightboxOpen, setLightboxOpen]     = useState(false)
  const [indiceActual, setIndiceActual]     = useState(0)
  const [zoom, setZoom]                     = useState(1)
  const [panX, setPanX]                     = useState(0)
  const [panY, setPanY]                     = useState(0)
  const [isFullscreen, setIsFullscreen]     = useState(false)

  // Touch gesture refs
  const touchStart    = useRef<{ x: number; y: number } | null>(null)
  const pinchStart    = useRef<number | null>(null)
  const pinchZoom     = useRef<number>(1)
  const lastTap       = useRef<number>(0)
  const isPanning     = useRef(false)
  const panStart      = useRef<{ x: number; y: number; px: number; py: number } | null>(null)
  const lightboxRef   = useRef<HTMLDivElement>(null)

  const total        = imagenes.length
  const imgPrincipal = imagenes[0]?.url ?? 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
  const imgSecundarias = imagenes.slice(1, 5)

  // ── Navigation ─────────────────────────────────────────────────────────────
  const resetZoom = () => { setZoom(1); setPanX(0); setPanY(0) }

  const abrirLightbox = (i: number) => {
    setIndiceActual(i)
    resetZoom()
    setLightboxOpen(true)
  }
  const cerrar = useCallback(() => {
    setLightboxOpen(false)
    resetZoom()
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    setIsFullscreen(false)
  }, [])

  const anterior = useCallback(() => {
    resetZoom()
    setIndiceActual((p) => (p - 1 + total) % total)
  }, [total])

  const siguiente = useCallback(() => {
    resetZoom()
    setIndiceActual((p) => (p + 1) % total)
  }, [total])

  // ── Keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      cerrar()
      if (e.key === 'ArrowLeft')   anterior()
      if (e.key === 'ArrowRight')  siguiente()
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.5, 4))
      if (e.key === '-')           setZoom((z) => Math.max(z - 0.5, 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, cerrar, anterior, siguiente])

  // ── Scroll lock ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (lightboxOpen) {
      const y = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top      = `-${y}px`
      document.body.style.width    = '100%'
      // Bajamos el z-index del Navbar para que no tape los controles del lightbox
      const navbar = document.querySelector('header') as HTMLElement | null
      if (navbar) navbar.style.zIndex = '0'
    } else {
      const y = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top      = ''
      document.body.style.width    = ''
      if (y) window.scrollTo(0, -parseInt(y))
      // Restauramos el z-index del Navbar
      const navbar = document.querySelector('header') as HTMLElement | null
      if (navbar) navbar.style.zIndex = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top      = ''
      document.body.style.width    = ''
      const navbar = document.querySelector('header') as HTMLElement | null
      if (navbar) navbar.style.zIndex = ''
    }
  }, [lightboxOpen])

  // ── Fullscreen API ─────────────────────────────────────────────────────────
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && lightboxRef.current) {
      lightboxRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  // ── Touch gesture handlers (swipe + pinch-zoom + double-tap + pan) ─────────
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      isPanning.current = false

      if (zoom > 1) {
        panStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          px: panX,
          py: panY,
        }
      }

      // Double-tap to zoom
      const now = Date.now()
      if (now - lastTap.current < 300) {
        if (zoom > 1) {
          resetZoom()
        } else {
          setZoom(2.5)
        }
        lastTap.current = 0
      } else {
        lastTap.current = now
      }
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      pinchStart.current = Math.sqrt(dx * dx + dy * dy)
      pinchZoom.current  = zoom
      touchStart.current = null
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStart.current !== null) {
      e.preventDefault()
      const dx   = e.touches[0].clientX - e.touches[1].clientX
      const dy   = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const scale = (dist / pinchStart.current) * pinchZoom.current
      setZoom(Math.max(1, Math.min(4, scale)))
    } else if (e.touches.length === 1 && zoom > 1 && panStart.current) {
      e.preventDefault()
      isPanning.current = true
      setPanX(panStart.current.px + e.touches[0].clientX - panStart.current.x)
      setPanY(panStart.current.py + e.touches[0].clientY - panStart.current.y)
    }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    pinchStart.current = null

    if (zoom <= 1 && touchStart.current && !isPanning.current && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - touchStart.current.x
      const dy = e.changedTouches[0].clientY - touchStart.current.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx < 0) siguiente()
        else         anterior()
      }
    }

    touchStart.current = null
    panStart.current   = null
    isPanning.current  = false
  }

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
              const esUltima    = i === imgSecundarias.length - 1
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

      {/* ── LIGHTBOX ───────────────────────────────────────────────────────── */}
      {lightboxOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={lightboxRef}
          className="fixed z-[9999] bg-black flex flex-col select-none"
          style={{ top: 0, left: 0, right: 0, bottom: 0, height: '100dvh', zIndex: 2147483647 }}
        >
          {/* ── Barra superior ── */}
          <div className="flex items-center justify-between px-4 flex-shrink-0" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}>
            <span className="text-white/60 text-sm tabular-nums">
              {indiceActual + 1} / {total}
            </span>

            {/* Controles derecha */}
            <div className="flex items-center gap-2">
              {/* Zoom out */}
              <button
                onClick={() => { setZoom((z) => Math.max(1, z - 0.5)); if (zoom <= 1.5) { setPanX(0); setPanY(0) } }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Alejar"
                disabled={zoom <= 1}
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/>
                </svg>
              </button>

              {/* Zoom level */}
              <span className="text-white/50 text-xs w-8 text-center tabular-nums">{Math.round(zoom * 100)}%</span>

              {/* Zoom in */}
              <button
                onClick={() => setZoom((z) => Math.min(4, z + 0.5))}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Acercar"
                disabled={zoom >= 4}
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
                </svg>
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              >
                {isFullscreen ? (
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                  </svg>
                )}
              </button>

              {/* Reset zoom (solo si hay zoom activo) */}
              {zoom > 1 && (
                <button
                  onClick={resetZoom}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Restablecer zoom"
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M19.418 13A8 8 0 0 1 5.806 18.418L4.582 19M20 20v-5h-.582"/>
                  </svg>
                </button>
              )}

              {/* Cerrar */}
              <button
                onClick={cerrar}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Imagen + flechas ── */}
          <div
            className="flex-1 flex items-center justify-center relative min-h-0 overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
          >
            {/* Flecha izquierda — oculta si hay zoom activo */}
            {total > 1 && zoom === 1 && (
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

            <img
              key={indiceActual}
              src={imagenes[indiceActual]?.url}
              alt={`${titulo} — foto ${indiceActual + 1}`}
              className="block"
              style={{
                maxWidth:    zoom === 1 ? 'calc(100vw - 80px)' : 'none',
                maxHeight:   zoom === 1 ? '100%' : 'none',
                width:       'auto',
                height:      'auto',
                objectFit:   'contain',
                borderRadius: '10px',
                transform:   `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
                transformOrigin: 'center center',
                transition:  zoom === 1 ? 'transform 0.25s ease' : 'none',
                animation:   'lbFade 0.15s ease',
                userSelect:  'none',
                WebkitUserSelect: 'none',
              }}
              draggable={false}
            />

            {/* Flecha derecha — oculta si hay zoom activo */}
            {total > 1 && zoom === 1 && (
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

            {/* Hint doble toque */}
            {zoom === 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/30 text-[10px] pointer-events-none">
                Desliza para cambiar · Doble toque para hacer zoom
              </div>
            )}
          </div>

          {/* ── Miniaturas inferiores ── */}
          {total > 1 && zoom === 1 && (
            <div className="flex-shrink-0 px-4 pb-4 pt-2">
              <div className="flex gap-1.5 overflow-x-auto justify-center scrollbar-hide">
                {imagenes.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setIndiceActual(i); resetZoom() }}
                    className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all ${
                      i === indiceActual ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-70'
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
      , document.body)}

      <style>{`
        @keyframes lbFade { from { opacity: 0 } to { opacity: 1 } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  )
}

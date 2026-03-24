'use client'

import { useState } from 'react'

export default function LaunchBanner({ locale = 'es' }: { locale?: string }) {
  const [visible, setVisible] = useState(true)

  function dismiss() {
    setVisible(false)
  }

  if (!visible) return null

  const isCA = locale === 'ca'

  const texto = isCA
    ? 'Estem ultimant els detalls per al llançament oficial a Andorra.'
    : 'Estamos ultimando los detalles para el lanzamiento oficial en Andorra.'
  const textoCort = isCA ? 'Molt aviat!' : '¡Muy pronto!'
  const textoLarg = isCA ? 'Molt aviat disponible.' : 'Muy pronto disponible.'

  return (
    <div className="w-full bg-gradient-to-r from-[#1a3c5e] to-[#2d5a8e] text-white py-2.5 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0 opacity-90">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
          <p className="text-xs sm:text-sm font-medium leading-snug">
            <span className="font-bold">Habitacio.ad</span>
            {' '}— {texto}{' '}
            <span className="opacity-80 hidden sm:inline">{textoLarg}</span>
          </p>
          <p className="text-xs sm:text-sm font-medium leading-snug sm:hidden opacity-80">{textoCort}</p>
        </div>
        <button
          onClick={dismiss}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white text-xs font-bold"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

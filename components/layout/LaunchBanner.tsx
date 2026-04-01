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
    ? 'encara no està habilitada fins al llançament oficial.'
    : 'todavía no está habilitada hasta el lanzamiento oficial.'

  return (
    <div className="w-full bg-[#b91c1c] text-white py-2.5 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p className="text-xs sm:text-sm font-medium leading-snug">
            <span className="font-bold">Habitacio.ad</span>
            {' '}{texto}
          </p>
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

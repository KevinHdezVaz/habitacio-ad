'use client'

import { useState } from 'react'

interface Pregunta {
  q: string
  a: string
}

export default function FaqAccordion({ preguntas }: { preguntas: Pregunta[] }) {
  const [abierto, setAbierto] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-2">
      {preguntas.map((p, i) => (
        <div
          key={i}
          className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden
            ${abierto === i ? 'border-[#0ea5a0] bg-white' : 'border-gray-100 bg-[#f8fafc] hover:border-gray-200'}`}
        >
          {/* Pregunta visible (para SEO: siempre en el DOM) */}
          <button
            type="button"
            onClick={() => setAbierto(abierto === i ? null : i)}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
            aria-expanded={abierto === i}
          >
            <h3 className={`text-sm font-semibold leading-snug flex-1 ${abierto === i ? 'text-[#1a3c5e]' : 'text-[#374151]'}`}>
              {p.q}
            </h3>
            <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200
              ${abierto === i ? 'bg-[#0ea5a0] text-white rotate-45' : 'bg-gray-200 text-[#6b7280]'}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-3 h-3">
                <path d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </button>

          {/* Respuesta desplegable — siempre en DOM para SEO */}
          <div
            className={`transition-all duration-200 ${abierto === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
            aria-hidden={abierto !== i}
          >
            <p className="px-5 pb-5 text-sm text-[#4b5563] leading-relaxed">
              {p.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

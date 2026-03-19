'use client'

import { useState } from 'react'

export default function DescripcionExpandible({ texto }: { texto: string }) {
  const [expandida, setExpandida] = useState(false)

  // ~5 líneas = aproximadamente 400 caracteres, pero usamos line-clamp CSS
  const esMuyLarga = texto.length > 300

  return (
    <div>
      <p className={`text-[#4b5563] leading-relaxed whitespace-pre-line text-[15px] ${
        !expandida && esMuyLarga ? 'line-clamp-5' : ''
      }`}>
        {texto}
      </p>
      {esMuyLarga && (
        <button
          onClick={() => setExpandida(v => !v)}
          className="mt-2 text-sm font-semibold text-[#1a3c5e] hover:underline"
        >
          {expandida ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </div>
  )
}

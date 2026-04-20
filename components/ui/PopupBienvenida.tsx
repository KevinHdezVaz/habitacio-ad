'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'habitacio_welcome_seen'

export default function PopupBienvenida() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const visto = localStorage.getItem(STORAGE_KEY)
    if (!visto) {
      // Pequeño delay para que no sea agresivo
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  function cerrar() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <>
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={cerrar}
        aria-hidden
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

          {/* Cabecera */}
          <div className="bg-[#1a3c5e] px-6 pt-6 pb-5 relative">
            <button
              onClick={cerrar}
              aria-label="Tancar"
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Icono */}
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>

            {/* Texto en catalán */}
            <p className="text-white font-bold text-lg leading-snug">
              Estàs buscant habitació?
            </p>
            <p className="text-blue-200 text-sm mt-1">
              ¿Estás buscando habitación?
            </p>
          </div>

          {/* Cuerpo */}
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-[#1a3c5e] font-semibold text-sm">
                Crea el teu perfil d&apos;inquilí i que els propietaris et contactin.
              </p>
              <p className="text-[#6b7280] text-xs leading-relaxed">
                Crea tu perfil de inquilino ahora y los propietarios podrán contactarte directamente.
                Una vez lo crees, también puedes ver las habitaciones disponibles.
              </p>
            </div>

            {/* Beneficios */}
            <ul className="flex flex-col gap-2">
              {[
                { ca: 'Gratuït i sense compromís', es: 'Gratis y sin compromiso' },
                { ca: 'Els propietaris et troben a tu', es: 'Los propietarios te encuentran a ti' },
                { ca: 'Accés a totes les habitacions', es: 'Acceso a todas las habitaciones' },
              ].map((item) => (
                <li key={item.ca} className="flex items-start gap-2 text-xs text-[#374151]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#0ea5a0" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span><span className="font-medium">{item.ca}</span> · {item.es}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/buscar-habitacion"
                onClick={cerrar}
                className="w-full bg-[#1a3c5e] text-white text-sm font-bold py-3 rounded-xl text-center hover:bg-[#0ea5a0] transition-colors"
              >
                Crear perfil d&apos;inquilí · Crear perfil
              </Link>
              <Link
                href="/habitaciones"
                onClick={cerrar}
                className="w-full border border-[#e5e7eb] text-[#1a3c5e] text-sm font-semibold py-3 rounded-xl text-center hover:border-[#1a3c5e] transition-colors"
              >
                Veure habitacions · Ver habitaciones
              </Link>
              <button
                onClick={cerrar}
                className="text-xs text-[#9ca3af] hover:text-[#6b7280] transition-colors py-1"
              >
                Ara no · Más tarde
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

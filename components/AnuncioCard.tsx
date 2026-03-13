import Link from 'next/link'
import Image from 'next/image'
import type { Anuncio } from '@/app/lib/types'

const ETIQUETA: Record<string, string> = {
  anual: 'Todo el año',
  temporero: 'Temporero',
  ambos: 'Anual / Temporero',
}

export default function AnuncioCard({ anuncio }: { anuncio: Anuncio }) {
  const imagenes = anuncio.imagenes_anuncio?.slice().sort((a, b) => a.orden - b.orden)
  const imagen = imagenes?.[0]

  return (
    <Link
      href={`/habitaciones/${anuncio.id}`}
      className="block rounded-2xl overflow-hidden bg-gray-200 relative shadow-sm hover:shadow-md transition-shadow"
      style={{ aspectRatio: '3/4' }}
    >
      {imagen ? (
        <Image
          src={imagen.url}
          alt={anuncio.titulo}
          fill
          sizes="(max-width: 640px) 50vw, 220px"
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <svg width="40" height="40" fill="none" stroke="#9CA3AF" strokeWidth="1.5" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      {/* Price badge */}
      <div className="absolute top-2.5 left-2.5 bg-white rounded-lg px-2 py-1 text-sm font-bold text-gray-900 shadow-sm">
        {anuncio.precio} €/mes
      </div>

      {/* Bottom info */}
      {anuncio.parroquia && (
        <div className="absolute bottom-2.5 left-2.5 right-2.5">
          <p className="text-white text-xs font-medium drop-shadow truncate">
            {anuncio.parroquia}
          </p>
          {anuncio.tipo_estancia && (
            <p className="text-white/80 text-xs drop-shadow truncate">
              {ETIQUETA[anuncio.tipo_estancia]}
            </p>
          )}
        </div>
      )}

      {/* Destacado badge */}
      {anuncio.destacado && (
        <div className="absolute top-2.5 right-2.5 bg-[#0EA5A0] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          Destacado
        </div>
      )}
    </Link>
  )
}

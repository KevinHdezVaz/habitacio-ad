import { Anuncio } from '@/types'

interface Props {
  anuncio: Anuncio
}

export default function TarjetaHabitacion({ anuncio }: Props) {
  const imagen = anuncio.imagenes_anuncio?.[0]?.url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'

  const etiquetaTipo: Record<string, string> = {
    anual: 'Todo el año',
    temporero: 'Temporero',
    ambos: 'Anual / Temporero',
  }

  return (
    <a
      href={`/habitacion/${anuncio.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-video">
        <img
          src={imagen}
          alt={anuncio.titulo}
          className="w-full h-full object-cover"
        />
        {anuncio.destacado && (
          <div className="absolute top-2 left-2 bg-[#0ea5a0] text-white text-xs font-bold px-2 py-1 rounded-full">
            Destacado
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-white rounded-full px-3 py-1 text-xs font-bold text-[#1a3c5e] shadow">
          {anuncio.precio} €/mes
        </div>
      </div>
      <div className="p-3 flex flex-col gap-1">
        <p className="font-bold text-[#1a3c5e] text-sm leading-tight line-clamp-1">
          {anuncio.titulo}
        </p>
        <p className="text-[#6b7280] text-xs">{anuncio.parroquia}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="bg-[#e8f4fd] text-[#2980b9] text-xs px-2 py-0.5 rounded-full font-medium">
            {etiquetaTipo[anuncio.tipo_estancia]}
          </span>
          {anuncio.gastos_incluidos && (
            <span className="bg-[#e6f7f7] text-[#0ea5a0] text-xs px-2 py-0.5 rounded-full font-medium">
              Gastos incl.
            </span>
          )}
          {anuncio.bano_privado && (
            <span className="bg-[#f4f5f7] text-[#6b7280] text-xs px-2 py-0.5 rounded-full font-medium">
              Baño privado
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-[#9ca3af]">
          <span>👥 {anuncio.num_personas} personas</span>
          {anuncio.metros_habitacion && (
            <span>📐 {anuncio.metros_habitacion}m²</span>
          )}
          {anuncio.fianza && <span>🔒 Con fianza</span>}
        </div>
      </div>
    </a >
  )
}
import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AccionesAdmin from './AccionesAdmin'

export default async function AdminAnuncioDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: anuncio } = await supabase
    .from('anuncios')
    .select('*, imagenes_anuncio(*), profiles(nombre, telefono)')
    .eq('id', id)
    .single()

  if (!anuncio) notFound()

  const badgeEstado: Record<string, string> = {
    pendiente: 'bg-amber-100 text-amber-700',
    activo:    'bg-emerald-100 text-emerald-700',
    inactivo:  'bg-red-100 text-red-600',
  }

  const imagenPrincipal = anuncio.imagenes_anuncio?.find((i: { orden: number }) => i.orden === 0)
  const imagenesExtra   = anuncio.imagenes_anuncio?.filter((i: { orden: number }) => i.orden > 0) ?? []

  const detalles = [
    { label: 'Parroquia',       value: anuncio.parroquia },
    { label: 'Zona',            value: anuncio.zona || '—' },
    { label: 'Precio',          value: `${anuncio.precio}€/mes` },
    { label: 'Tipo estancia',   value: anuncio.tipo_estancia },
    { label: 'Disponible',      value: anuncio.disponible_desde ? new Date(anuncio.disponible_desde).toLocaleDateString('es-ES') : '—' },
    { label: 'Metros hab.',     value: anuncio.metros_habitacion ? `${anuncio.metros_habitacion} m²` : '—' },
    { label: 'Metros piso',     value: anuncio.metros_piso ? `${anuncio.metros_piso} m²` : '—' },
    { label: 'Personas',        value: anuncio.num_personas ? `${anuncio.num_personas}` : '—' },
    { label: 'Tipo cama',       value: anuncio.tipo_cama || '—' },
    { label: 'Baño privado',    value: anuncio.bano_privado ? 'Sí' : 'No' },
    { label: 'WiFi',            value: anuncio.wifi ? 'Sí' : 'No' },
    { label: 'Fianza',          value: anuncio.fianza ? (anuncio.importe_fianza ? `${anuncio.importe_fianza}€` : 'Sí') : 'No' },
    { label: 'Gastos incluidos', value: anuncio.gastos_incluidos ? 'Sí' : 'No' },
    { label: 'Admite pareja',   value: anuncio.admite_pareja ? 'Sí' : 'No' },
    { label: 'Admite mascotas', value: anuncio.admite_mascotas ? 'Sí' : 'No' },
    { label: 'Fumadores',       value: anuncio.fumadores ? 'Sí' : 'No' },
    { label: 'Empadronamiento', value: anuncio.empadronamiento ? 'Sí' : 'No' },
    { label: 'Preferencia',     value: anuncio.preferencia_sexo || '—' },
    { label: 'Idioma vivienda', value: anuncio.idioma_vivienda || '—' },
  ]

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#6b7280] flex-wrap">
        <Link href="/admin" className="hover:text-[#1a3c5e] transition-colors">Admin</Link>
        <span>·</span>
        <Link href="/admin/anuncios" className="hover:text-[#1a3c5e] transition-colors">Anuncios</Link>
        <span>·</span>
        <span className="text-[#1a3c5e] font-medium truncate max-w-[200px]">{anuncio.titulo}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-[#1a3c5e]">{anuncio.titulo}</h1>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${badgeEstado[anuncio.estado] ?? 'bg-gray-100'}`}>
                {anuncio.estado}
              </span>
              {anuncio.destacado && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 uppercase">⭐ Destacado</span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-[#6b7280]">
              <span>👤 {anuncio.profiles?.nombre ?? 'Desconocido'}</span>
              {anuncio.profiles?.telefono && <span>📞 {anuncio.profiles.telefono}</span>}
              <span>📅 {new Date(anuncio.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Ver anuncio público */}
          {anuncio.estado === 'activo' && (
            <Link
              href={`/habitaciones/${anuncio.id}`}
              target="_blank"
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-[#6b7280] hover:border-[#1a3c5e] hover:text-[#1a3c5e] transition-colors whitespace-nowrap"
            >
              Ver público ↗
            </Link>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <AccionesAdmin
            anuncioId={anuncio.id}
            estadoInicial={anuncio.estado}
            destacadoInicial={anuncio.destacado ?? false}
          />
        </div>
      </div>

      {/* Imágenes */}
      {anuncio.imagenes_anuncio && anuncio.imagenes_anuncio.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#1a3c5e] mb-4">
            Imágenes ({anuncio.imagenes_anuncio.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {imagenPrincipal && (
              <div className="col-span-2 sm:col-span-2 relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={imagenPrincipal.url}
                  alt="Principal"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-[#1a3c5e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Principal
                </span>
              </div>
            )}
            {imagenesExtra.map((img: { id: string; url: string; orden: number }) => (
              <div key={img.id} className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                <img src={img.url} alt={`Imagen ${img.orden}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Descripción */}
      {(anuncio.descripcion || anuncio.normas) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
          {anuncio.descripcion && (
            <div>
              <h2 className="font-bold text-[#1a3c5e] mb-2">Descripción</h2>
              <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-line">{anuncio.descripcion}</p>
            </div>
          )}
          {anuncio.normas && (
            <div className="pt-4 border-t border-gray-100">
              <h2 className="font-bold text-[#1a3c5e] mb-2">Normas de la casa</h2>
              <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-line">{anuncio.normas}</p>
            </div>
          )}
        </div>
      )}

      {/* Detalles */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#1a3c5e] mb-4">Detalles del anuncio</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {detalles.map((d) => (
            <div key={d.label} className="bg-[#f4f5f7] rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-[#9ca3af] font-medium uppercase">{d.label}</p>
              <p className="text-sm font-semibold text-[#1a3c5e] mt-0.5">{d.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ID técnico */}
      <p className="text-[10px] text-[#9ca3af] text-center">ID: {anuncio.id}</p>
    </div>
  )
}

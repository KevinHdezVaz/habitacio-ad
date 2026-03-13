import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Card from '@/components/ui/Card'
import ContactarButton from '@/components/habitaciones/ContactarButton'

const ETIQUETA_TIPO: Record<string, string> = {
  anual: 'Todo el año',
  temporero: 'Temporero',
  ambos: 'Anual / Temporero',
}

// Coordenadas aproximadas de cada parroquia de Andorra
const PARROQUIA_COORDS: Record<string, [number, number]> = {
  'Andorra la Vella':     [42.5063, 1.5218],
  'Escaldes-Engordany':   [42.5060, 1.5370],
  'Encamp':               [42.5349, 1.5831],
  'Canillo':              [42.5670, 1.5977],
  'Ordino':               [42.5562, 1.5333],
  'La Massana':           [42.5453, 1.5148],
  'Sant Julià de Lòria':  [42.4636, 1.4912],
}

function Chip({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-[#6b7280] uppercase tracking-wide font-medium">{label}</span>
      <span className="text-sm font-semibold text-[#1a3c5e]">{value}</span>
    </div>
  )
}

function formatTelefono(tel: string): string {
  // Elimina todo salvo dígitos y +
  const digits = tel.replace(/[^\d+]/g, '')
  // Si ya empieza con + o con 376 lo dejamos; si es número corto andorrano (~6 dígitos) añadimos 376
  if (digits.startsWith('+')) return digits.replace('+', '')
  if (digits.startsWith('376')) return digits
  return `376${digits}`
}

export default async function FichaHabitacionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: anuncio } = await supabase
    .from('anuncios')
    .select('*, imagenes_anuncio(*), profiles(nombre, telefono)')
    .eq('id', id)
    .eq('estado', 'activo')
    .single()

  if (!anuncio) notFound()

  const imagenes = (anuncio.imagenes_anuncio ?? []).sort(
    (a: { orden: number }, b: { orden: number }) => a.orden - b.orden
  )
  const imgPrincipal = imagenes[0]?.url ?? 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
  const imgSecundarias = imagenes.slice(1, 3)

  const isOwner = user?.id === anuncio.user_id

  // Mapa — usar coordenadas exactas si el anunciante las proporcionó, si no la parroquia
  const coordsExactas: [number, number] | null =
    anuncio.latitud && anuncio.longitud ? [anuncio.latitud, anuncio.longitud] : null
  const coordsFallback = PARROQUIA_COORDS[anuncio.parroquia]
  const coords = coordsExactas ?? coordsFallback

  const googleMapsEmbedUrl = coords
    ? `https://maps.google.com/maps?q=${coords[0]},${coords[1]}&z=${coordsExactas ? 17 : 15}&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(`${anuncio.parroquia}, Andorra`)}&z=14&output=embed`
  const googleMapsUrl = coordsExactas
    ? `https://www.google.com/maps/search/?api=1&query=${coordsExactas[0]},${coordsExactas[1]}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${anuncio.parroquia}${anuncio.zona ? `, ${anuncio.zona}` : ''}, Andorra`)}`

  // Teléfono
  const telefono = anuncio.profiles?.telefono ?? null
  const telefonoWA = telefono ? formatTelefono(telefono) : null

  return (
    <div className="flex flex-col gap-8">
      {/* ── Grid principal ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Galería */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <div className="aspect-video rounded-3xl overflow-hidden shadow-sm bg-gray-100">
            <img src={imgPrincipal} alt={anuncio.titulo} className="w-full h-full object-cover" />
          </div>
          {imgSecundarias.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {imgSecundarias.map((img: { url: string }, i: number) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                  <img src={img.url} alt={`Foto ${i + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar sticky */}
        <div>
          <Card className="p-6 flex flex-col gap-5 sticky top-20">
            {/* Precio */}
            <div>
              <p className="text-3xl font-bold text-[#1a3c5e]">
                {anuncio.precio} €<span className="text-sm font-normal text-[#6b7280]">/mes</span>
              </p>
              {anuncio.gastos_incluidos && (
                <span className="text-xs font-bold text-[#0ea5a0] uppercase tracking-wider">Gastos incluidos</span>
              )}
            </div>

            {/* Título y ubicación */}
            <div className="border-t border-gray-100 pt-4">
              <h1 className="font-bold text-[#1a3c5e] text-lg leading-tight">{anuncio.titulo}</h1>
              <p className="text-sm text-[#6b7280] mt-1">📍 {anuncio.parroquia}{anuncio.zona ? `, ${anuncio.zona}` : ''}</p>
              {anuncio.disponible_desde && (
                <p className="text-xs text-[#6b7280] mt-1">
                  Disponible desde: {new Date(anuncio.disponible_desde).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
              {anuncio.tipo_estancia && (
                <span className="inline-block mt-2 bg-[#e8f4fd] text-[#2980b9] text-xs px-3 py-1 rounded-full font-medium">
                  {ETIQUETA_TIPO[anuncio.tipo_estancia]}
                </span>
              )}
            </div>

            {/* Contactar por chat */}
            <div className="border-t border-gray-100 pt-4">
              <ContactarButton
                anuncioId={anuncio.id}
                arrendadorId={anuncio.user_id}
                currentUserId={user?.id ?? null}
                isOwner={isOwner}
              />
            </div>

            {/* Teléfono / WhatsApp — solo si hay número y el usuario está logueado */}
            {telefono && user && !isOwner && (
              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                <a
                  href={`tel:${telefono}`}
                  className="flex items-center justify-center gap-2 w-full border border-[#1a3c5e] text-[#1a3c5e] font-semibold py-2.5 px-4 rounded-2xl hover:bg-[#f0f4f8] transition-colors text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Llamar
                </a>
                <a
                  href={`https://wa.me/${telefonoWA}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25d366] text-white font-semibold py-2.5 px-4 rounded-2xl hover:bg-[#20b958] transition-colors text-sm"
                >
                  {/* WhatsApp icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            )}

            {/* Si no está logueado, invitar a registrarse para ver el teléfono */}
            {telefono && !user && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-[#6b7280] text-center">
                  <a href="/login" className="text-[#0ea5a0] font-semibold hover:underline">Inicia sesión</a> para ver el teléfono de contacto
                </p>
              </div>
            )}

            {/* Anunciante */}
            <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e8edf2] flex items-center justify-center flex-shrink-0">
                <span className="text-[#1a3c5e] font-bold text-sm">
                  {(anuncio.profiles?.nombre ?? 'A')[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs text-[#6b7280]">Anunciante</p>
                <p className="text-sm font-bold text-[#1a3c5e]">{anuncio.profiles?.nombre ?? 'Anónimo'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Detalles completos ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-8">

          {/* Datos clave en grid */}
          <Card className="p-5">
            <h2 className="font-bold text-[#1a3c5e] text-base mb-4">Detalles del anuncio</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
              <Chip label="Precio" value={`${anuncio.precio} €/mes`} />
              <Chip label="Fianza" value={anuncio.fianza ? `Sí${anuncio.importe_fianza ? ` (${anuncio.importe_fianza} €)` : ''}` : 'No'} />
              <Chip label="Gastos incluidos" value={anuncio.gastos_incluidos ? 'Sí' : 'No'} />
              {anuncio.metros_habitacion && <Chip label="Metros habitación" value={`${anuncio.metros_habitacion} m²`} />}
              {anuncio.metros_piso && <Chip label="Metros piso" value={`${anuncio.metros_piso} m²`} />}
              {anuncio.num_personas && <Chip label="Personas viviendo" value={anuncio.num_personas} />}
              <Chip label="Vive el propietario" value={anuncio.vive_propietario ? 'Sí' : 'No'} />
              <Chip label="Admite pareja" value={anuncio.admite_pareja ? 'Sí' : 'No'} />
              <Chip label="Admite mascotas" value={anuncio.admite_mascotas ? 'Sí' : 'No'} />
              <Chip label="Empadronamiento" value={anuncio.empadronamiento ? 'Sí' : 'No'} />
              <Chip label="Fumadores" value={anuncio.fumadores ? 'Sí' : 'No'} />
              {anuncio.preferencia_sexo && (
                <Chip label="Preferencia" value={({ chicas: 'Solo chicas', chicos: 'Solo chicos', indiferente: 'Indiferente' } as Record<string, string>)[anuncio.preferencia_sexo] ?? anuncio.preferencia_sexo} />
              )}
              {anuncio.duracion_minima && <Chip label="Duración mínima" value={anuncio.duracion_minima} />}
              {anuncio.tipo_cama && <Chip label="Tipo de cama" value={anuncio.tipo_cama} />}
              <Chip label="Baño" value={anuncio.bano_privado ? 'Privado' : 'Compartido'} />
              <Chip label="WiFi" value={anuncio.wifi ? 'Sí' : 'No'} />
              {anuncio.idioma_vivienda && <Chip label="Idioma" value={anuncio.idioma_vivienda} />}
            </div>
          </Card>

          {/* Descripción */}
          {anuncio.descripcion && (
            <section>
              <h2 className="text-lg font-bold text-[#1a3c5e] mb-3">Descripción</h2>
              <p className="text-[#6b7280] leading-relaxed whitespace-pre-line">{anuncio.descripcion}</p>
            </section>
          )}

          {/* Normas */}
          {anuncio.normas && (
            <section>
              <h2 className="text-lg font-bold text-[#1a3c5e] mb-3">Normas de convivencia</h2>
              <p className="text-[#6b7280] leading-relaxed whitespace-pre-line">{anuncio.normas}</p>
            </section>
          )}

          {/* ── Mapa ── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-[#1a3c5e]">Ubicación</h2>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#0ea5a0] font-semibold hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Abrir en Google Maps
              </a>
            </div>

            <Card className="overflow-hidden p-0">
              {/* Info de zona */}
              <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100">
                <span className="text-lg">📍</span>
                <div>
                  <p className="font-semibold text-[#1a3c5e] text-sm">{anuncio.parroquia}</p>
                  {anuncio.zona && <p className="text-xs text-[#6b7280]">{anuncio.zona}</p>}
                  <p className="text-xs text-[#9ca3af]">
                    Andorra · {coordsExactas ? 'Ubicación exacta' : 'Zona aproximada'}
                  </p>
                </div>
              </div>

              {/* Google Maps embed */}
              <div className="relative">
                <iframe
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="280"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa de ${anuncio.parroquia}`}
                  allowFullScreen
                />
                {/* Botón flotante para abrir en Google Maps */}
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-white shadow-md rounded-xl px-3 py-1.5 text-xs font-semibold text-[#1a3c5e] flex items-center gap-1.5 hover:shadow-lg transition-shadow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#0ea5a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Abrir en Google Maps
                </a>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

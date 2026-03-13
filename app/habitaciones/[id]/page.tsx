import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Card from '@/components/ui/Card'
import ContactarButton from '@/components/habitaciones/ContactarButton'

const ETIQUETA_TIPO: Record<string, string> = {
  anual: 'Todo el año',
  temporero: 'Temporero',
  ambos: 'Anual / Temporero',
}

function Chip({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-[#6b7280] uppercase tracking-wide font-medium">{label}</span>
      <span className="text-sm font-semibold text-[#1a3c5e]">{value}</span>
    </div>
  )
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
    .select('*, imagenes_anuncio(*), profiles(nombre)')
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

            {/* Contactar */}
            <div className="border-t border-gray-100 pt-4">
              <ContactarButton
                anuncioId={anuncio.id}
                arrendadorId={anuncio.user_id}
                currentUserId={user?.id ?? null}
                isOwner={isOwner}
              />
            </div>

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
        </div>
      </div>
    </div>
  )
}

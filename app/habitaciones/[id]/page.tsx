import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ContactarButton from '@/components/habitaciones/ContactarButton'
import Avatar from '@/components/ui/Avatar'
import GaleriaImagenes from './GaleriaImagenes'

const ETIQUETA_TIPO: Record<string, string> = {
  anual:     'Todo el año',
  temporero: 'Temporero',
  ambos:     'Anual / Temporero',
}

const PARROQUIA_COORDS: Record<string, [number, number]> = {
  'Andorra la Vella':    [42.5063, 1.5218],
  'Escaldes-Engordany':  [42.5060, 1.5370],
  'Encamp':              [42.5349, 1.5831],
  'Canillo':             [42.5670, 1.5977],
  'Ordino':              [42.5562, 1.5333],
  'La Massana':          [42.5453, 1.5148],
  'Sant Julià de Lòria': [42.4636, 1.4912],
}

function formatTelefono(tel: string): string {
  const digits = tel.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return digits.replace('+', '')
  if (digits.startsWith('376')) return digits
  return `376${digits}`
}

// ── Icono SVG inline ─────────────────────────────────────────────────────────
function Icon({ d, className = 'w-5 h-5' }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

// ── Feature pill con icono ───────────────────────────────────────────────────
function FeaturePill({ icon, label, highlight = false }: { icon: string; label: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all
      ${highlight
        ? 'border-[#0ea5a0]/30 bg-gradient-to-r from-[#e6f7f7] to-[#f0fafa] text-[#0a8c88]'
        : 'border-gray-100 bg-[#f8fafc] text-[#374151]'}`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </div>
  )
}

// ── Detalle con icono en grid ────────────────────────────────────────────────
function DetalleItem({ icon, label, value, positive }: { icon: string; label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-gray-50 last:border-0">
      <span className="text-xl w-7 text-center flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#9ca3af] font-medium uppercase tracking-wide">{label}</p>
        <p className={`text-sm font-bold mt-0.5 ${positive === true ? 'text-[#0ea5a0]' : positive === false ? 'text-[#6b7280]' : 'text-[#1a3c5e]'}`}>
          {value}
        </p>
      </div>
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
    .select('*, imagenes_anuncio(*), profiles(nombre, telefono, avatar_url)')
    .eq('id', id)
    .eq('estado', 'activo')
    .single()

  if (!anuncio) notFound()

  const imagenes = (anuncio.imagenes_anuncio ?? []).sort(
    (a: { orden: number }, b: { orden: number }) => a.orden - b.orden
  )

  const isOwner = user?.id === anuncio.user_id

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

  const telefono    = anuncio.profiles?.telefono  ?? null
  const telefonoWA  = telefono ? formatTelefono(telefono) : null
  const nombreAnunciante = anuncio.profiles?.nombre     ?? 'Anónimo'
  const avatarAnunciante = anuncio.profiles?.avatar_url ?? null

  const disponibleDesde = anuncio.disponible_desde
    ? new Date(anuncio.disponible_desde).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="flex flex-col gap-0 -mt-2">

      {/* ── BREADCRUMB + TÍTULO ─────────────────────────────────────────── */}
      <div className="mb-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-[#9ca3af] mb-3">
          <Link href="/habitaciones" className="hover:text-[#1a3c5e] transition-colors font-medium">Habitaciones</Link>
          <span>/</span>
          <span className="text-[#6b7280]">{anuncio.parroquia}</span>
        </div>

        {/* Título */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a3c5e] leading-tight mb-3">
          {anuncio.titulo}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm text-[#6b7280] font-medium">
            <span>📍</span>
            {anuncio.parroquia}{anuncio.zona ? `, ${anuncio.zona}` : ''}
          </span>
          {anuncio.tipo_estancia && (
            <>
              <span className="text-[#d1d5db]">·</span>
              <span className="text-xs font-bold bg-[#e8f4fd] text-[#2980b9] px-3 py-1 rounded-full">
                {ETIQUETA_TIPO[anuncio.tipo_estancia]}
              </span>
            </>
          )}
          {disponibleDesde && (
            <>
              <span className="text-[#d1d5db]">·</span>
              <span className="text-xs text-[#6b7280] font-medium">
                Disponible desde {disponibleDesde}
              </span>
            </>
          )}
          {anuncio.gastos_incluidos && (
            <>
              <span className="text-[#d1d5db]">·</span>
              <span className="text-xs font-bold text-[#0ea5a0] flex items-center gap-1">
                ✓ Gastos incluidos
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── GALERÍA ─────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <GaleriaImagenes imagenes={imagenes} titulo={anuncio.titulo} />
      </div>

      {/* ── LAYOUT PRINCIPAL ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── COLUMNA IZQUIERDA ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* HIGHLIGHTS (pills rápidos) */}
          <div className="flex flex-wrap gap-2">
            {anuncio.wifi          && <FeaturePill icon="📶" label="WiFi incluido"      highlight />}
            {anuncio.bano_privado  && <FeaturePill icon="🚿" label="Baño privado"       highlight />}
            {anuncio.gastos_incluidos && <FeaturePill icon="💡" label="Gastos incluidos" highlight />}
            {anuncio.empadronamiento && <FeaturePill icon="📋" label="Empadronamiento"   highlight />}
            {anuncio.admite_mascotas && <FeaturePill icon="🐾" label="Admite mascotas"   />}
            {anuncio.admite_pareja   && <FeaturePill icon="👫" label="Admite pareja"     />}
            {anuncio.tipo_cama && <FeaturePill icon="🛏️" label={anuncio.tipo_cama} />}
            {!anuncio.fumadores && <FeaturePill icon="🚭" label="No fumadores" />}
          </div>

          {/* ANUNCIANTE ── solo mobile, arriba del contenido */}
          <div className="lg:hidden flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <Avatar nombre={nombreAnunciante} avatarUrl={avatarAnunciante} size="md" />
            <div>
              <p className="text-xs text-[#9ca3af] font-medium">Publicado por</p>
              <p className="font-bold text-[#1a3c5e]">{nombreAnunciante}</p>
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          {anuncio.descripcion && (
            <section>
              <h2 className="text-lg font-bold text-[#1a3c5e] mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#0ea5a0] inline-block" />
                Descripción
              </h2>
              <p className="text-[#4b5563] leading-relaxed whitespace-pre-line text-[15px]">
                {anuncio.descripcion}
              </p>
            </section>
          )}

          {/* DETALLES ── grid con iconos */}
          <section>
            <h2 className="text-lg font-bold text-[#1a3c5e] mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#0ea5a0] inline-block" />
              Detalles de la habitación
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-50">
                {/* Columna 1 */}
                <div className="px-5 divide-y divide-gray-50">
                  <DetalleItem icon="💶" label="Precio" value={`${anuncio.precio} €/mes`} />
                  {anuncio.importe_fianza
                    ? <DetalleItem icon="🔐" label="Fianza" value={`${anuncio.importe_fianza} €`} />
                    : <DetalleItem icon="🔐" label="Fianza" value="Sin fianza" positive />
                  }
                  <DetalleItem icon="💡" label="Gastos" value={anuncio.gastos_incluidos ? 'Incluidos' : 'No incluidos'} positive={!!anuncio.gastos_incluidos} />
                  {anuncio.metros_habitacion && <DetalleItem icon="📐" label="Metros habitación" value={`${anuncio.metros_habitacion} m²`} />}
                  {anuncio.metros_piso       && <DetalleItem icon="🏠" label="Metros piso"       value={`${anuncio.metros_piso} m²`} />}
                  <DetalleItem icon="🚿" label="Baño" value={anuncio.bano_privado ? 'Privado' : 'Compartido'} positive={!!anuncio.bano_privado} />
                  {anuncio.tipo_cama && <DetalleItem icon="🛏️" label="Tipo de cama" value={anuncio.tipo_cama} />}
                </div>
                {/* Columna 2 */}
                <div className="px-5 divide-y divide-gray-50">
                  <DetalleItem icon="📶" label="WiFi" value={anuncio.wifi ? 'Incluido' : 'No incluido'} positive={!!anuncio.wifi} />
                  <DetalleItem icon="🏡" label="Vive el propietario" value={anuncio.vive_propietario ? 'Sí' : 'No'} />
                  <DetalleItem icon="👫" label="Admite pareja"   value={anuncio.admite_pareja  ? 'Sí' : 'No'} positive={!!anuncio.admite_pareja} />
                  <DetalleItem icon="🐾" label="Admite mascotas" value={anuncio.admite_mascotas ? 'Sí' : 'No'} positive={!!anuncio.admite_mascotas} />
                  <DetalleItem icon="🚬" label="Fumadores"       value={anuncio.fumadores       ? 'Permitido' : 'No permitido'} positive={!anuncio.fumadores} />
                  <DetalleItem icon="📋" label="Empadronamiento" value={anuncio.empadronamiento ? 'Posible' : 'No disponible'} positive={!!anuncio.empadronamiento} />
                  {anuncio.num_personas  && <DetalleItem icon="👥" label="Personas en el piso" value={String(anuncio.num_personas)} />}
                  {anuncio.preferencia_sexo && (
                    <DetalleItem icon="💁" label="Preferencia"
                      value={({ chicas: 'Solo chicas', chicos: 'Solo chicos', indiferente: 'Sin preferencia' } as Record<string, string>)[anuncio.preferencia_sexo] ?? anuncio.preferencia_sexo}
                    />
                  )}
                  {anuncio.duracion_minima  && <DetalleItem icon="📅" label="Duración mínima"  value={anuncio.duracion_minima} />}
                  {anuncio.idioma_vivienda  && <DetalleItem icon="🗣️" label="Idioma"            value={anuncio.idioma_vivienda} />}
                </div>
              </div>
            </div>
          </section>

          {/* NORMAS */}
          {anuncio.normas && (
            <section>
              <h2 className="text-lg font-bold text-[#1a3c5e] mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#0ea5a0] inline-block" />
                Normas de convivencia
              </h2>
              <div className="bg-[#f8fafc] rounded-2xl border border-gray-100 p-5">
                <p className="text-[#4b5563] leading-relaxed whitespace-pre-line text-[15px]">
                  {anuncio.normas}
                </p>
              </div>
            </section>
          )}

          {/* MAPA */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1a3c5e] flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#0ea5a0] inline-block" />
                Ubicación
              </h2>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#0ea5a0] font-semibold hover:text-[#0c8e8a] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver en Google Maps
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Zona info */}
              <div className="px-5 py-4 flex items-center gap-3 border-b border-gray-50">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a3c5e] to-[#2d5a8e] flex items-center justify-center text-white text-base flex-shrink-0">
                  📍
                </div>
                <div>
                  <p className="font-bold text-[#1a3c5e] text-sm">{anuncio.parroquia}{anuncio.zona ? ` · ${anuncio.zona}` : ''}</p>
                  <p className="text-xs text-[#9ca3af]">Andorra · {coordsExactas ? 'Ubicación exacta' : 'Zona aproximada'}</p>
                </div>
              </div>
              {/* Mapa embed */}
              <div className="relative">
                <iframe
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa de ${anuncio.parroquia}`}
                  allowFullScreen
                />
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-white shadow-md rounded-xl px-3 py-1.5 text-xs font-semibold text-[#1a3c5e] flex items-center gap-1.5 hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <svg className="w-3.5 h-3.5 text-[#0ea5a0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Abrir en Maps
                </a>
              </div>
            </div>
          </section>

        </div>

        {/* ── SIDEBAR STICKY ────────────────────────────────────────────── */}
        <div className="hidden lg:block">
          <div className="sticky top-20 flex flex-col gap-4">

            {/* Tarjeta principal de precio + contacto */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
              {/* Precio destacado */}
              <div className="bg-gradient-to-br from-[#1a3c5e] to-[#2d5a8e] px-6 pt-6 pb-5">
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-bold text-white">{anuncio.precio}€</span>
                  <span className="text-white/70 text-sm font-medium mb-1">/mes</span>
                </div>
                {anuncio.gastos_incluidos && (
                  <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">
                    ✓ Gastos incluidos
                  </span>
                )}
                {anuncio.importe_fianza && (
                  <p className="text-white/60 text-xs mt-2">
                    Fianza: {anuncio.importe_fianza}€
                  </p>
                )}
              </div>

              {/* Info rápida */}
              <div className="px-6 py-4 border-b border-gray-50 flex flex-wrap gap-2">
                {anuncio.bano_privado  && <span className="text-[11px] font-semibold bg-[#f4f5f7] text-[#374151] px-2.5 py-1.5 rounded-xl">🚿 Baño privado</span>}
                {anuncio.wifi          && <span className="text-[11px] font-semibold bg-[#f4f5f7] text-[#374151] px-2.5 py-1.5 rounded-xl">📶 WiFi</span>}
                {anuncio.tipo_cama     && <span className="text-[11px] font-semibold bg-[#f4f5f7] text-[#374151] px-2.5 py-1.5 rounded-xl">🛏️ {anuncio.tipo_cama}</span>}
                {disponibleDesde && (
                  <span className="text-[11px] font-semibold bg-[#e6f7f7] text-[#0ea5a0] px-2.5 py-1.5 rounded-xl">📅 {disponibleDesde}</span>
                )}
              </div>

              {/* Acciones de contacto */}
              <div className="px-6 py-5 flex flex-col gap-3">
                <ContactarButton
                  anuncioId={anuncio.id}
                  arrendadorId={anuncio.user_id}
                  currentUserId={user?.id ?? null}
                  isOwner={isOwner}
                />

                {telefono && user && !isOwner && (
                  <>
                    <a
                      href={`tel:${telefono}`}
                      className="flex items-center justify-center gap-2 w-full border-2 border-[#1a3c5e] text-[#1a3c5e] font-bold py-3 px-4 rounded-2xl hover:bg-[#f0f4f8] transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Llamar
                    </a>
                    <a
                      href={`https://wa.me/${telefonoWA}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-[#25d366] text-white font-bold py-3 px-4 rounded-2xl hover:bg-[#20b958] transition-colors text-sm shadow-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </>
                )}

                {telefono && !user && (
                  <p className="text-xs text-[#9ca3af] text-center">
                    <Link href="/login" className="text-[#0ea5a0] font-semibold hover:underline">Inicia sesión</Link> para ver el teléfono
                  </p>
                )}
              </div>
            </div>

            {/* Tarjeta anunciante */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3">
              <Avatar nombre={nombreAnunciante} avatarUrl={avatarAnunciante} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#9ca3af] font-medium uppercase tracking-wide">Publicado por</p>
                <p className="font-bold text-[#1a3c5e] truncate">{nombreAnunciante}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── MOBILE: contacto fijo al fondo ──────────────────────────────── */}
      {!isOwner && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xl font-bold text-[#1a3c5e] leading-none">{anuncio.precio}€<span className="text-sm font-normal text-[#9ca3af]">/mes</span></p>
            <p className="text-xs text-[#9ca3af] mt-0.5">{anuncio.parroquia}</p>
          </div>
          <div className="flex gap-2">
            {telefonoWA && user && (
              <a
                href={`https://wa.me/${telefonoWA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 bg-[#25d366] text-white rounded-2xl shadow-sm"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            )}
            <ContactarButton
              anuncioId={anuncio.id}
              arrendadorId={anuncio.user_id}
              currentUserId={user?.id ?? null}
              isOwner={isOwner}
              compact
            />
          </div>
        </div>
      )}
      {/* Espacio para el mobile bar */}
      {!isOwner && <div className="lg:hidden h-20" />}

    </div>
  )
}

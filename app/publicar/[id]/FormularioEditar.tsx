'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import MapaPicker from '@/components/maps/MapaPicker'
import { createClient } from '@/lib/supabase-browser'
import { editarAnuncio } from '@/app/actions/anuncios'
import Link from 'next/link'

const PARROQUIAS = [
  'Andorra la Vella', 'Escaldes-Engordany', 'Encamp',
  'Sant Julià de Lòria', 'La Massana', 'Ordino', 'Canillo',
]

function Seccion({ num, icon, title, subtitle, children }: {
  num: number; icon: string; title: string; subtitle?: string; children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#f8fafc] to-white">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#1a3c5e] text-lg flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">Paso {num}</span>
          <h2 className="font-bold text-[#1a3c5e] text-base leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-[#6b7280] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6 flex flex-col gap-5">{children}</div>
    </div>
  )
}

function Toggle({ checked, onToggle, label, icon }: {
  checked: boolean; onToggle: () => void; label: string; icon: string
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0
          ${checked ? 'bg-[#0ea5a0]' : 'bg-gray-200 group-hover:bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200
          ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
      <span className="text-sm text-[#374151] flex items-center gap-1.5 select-none">
        <span>{icon}</span><span>{label}</span>
      </span>
    </label>
  )
}

function LoadingOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-[#e8edf2]" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1a3c5e] animate-spin" />
          <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-[#0ea5a0] animate-spin"
            style={{ animationDuration: '0.6s', animationDirection: 'reverse' }} />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-[#1a3c5e]">Guardando cambios…</p>
          <p className="text-sm text-[#6b7280] mt-1">Actualizando tu anuncio</p>
        </div>
      </div>
    </div>
  )
}

interface ImagenExistente {
  id: number
  url: string
  orden: number
}

interface Props {
  anuncio: {
    id: string
    titulo: string
    parroquia: string
    zona: string | null
    precio: number
    disponible_desde: string | null
    tipo_estancia: string
    fianza: boolean
    importe_fianza: number | null
    gastos_incluidos: boolean
    duracion_minima: string | null
    metros_habitacion: number | null
    metros_piso: number | null
    num_personas: number | null
    vive_propietario: boolean
    admite_pareja: boolean
    admite_mascotas: boolean
    empadronamiento: boolean
    fumadores: boolean
    preferencia_sexo: string
    tipo_cama: string | null
    bano_privado: boolean
    wifi: boolean
    idioma_vivienda: string | null
    descripcion: string | null
    normas: string | null
    latitud: number | null
    longitud: number | null
    imagenes_anuncio: ImagenExistente[]
  }
}

export default function FormularioEditar({ anuncio }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guardado, setGuardado] = useState(false)

  // Fotos existentes — las que quedan sin eliminar
  const [imagenesExistentes, setImagenesExistentes] = useState<ImagenExistente[]>(anuncio.imagenes_anuncio)
  const [eliminarIds, setEliminarIds] = useState<number[]>([])
  // Nuevas fotos a subir
  const [nuevasPreviews, setNuevasPreviews] = useState<{ file: File; preview: string }[]>([])

  const [coords, setCoords] = useState({
    lat: anuncio.latitud,
    lng: anuncio.longitud,
  })

  const [form, setForm] = useState({
    titulo:            anuncio.titulo,
    parroquia:         anuncio.parroquia,
    zona:              anuncio.zona             ?? '',
    precio:            String(anuncio.precio),
    disponible_desde:  anuncio.disponible_desde ?? '',
    tipo_estancia:     anuncio.tipo_estancia,
    fianza:            anuncio.fianza,
    importe_fianza:    anuncio.importe_fianza   ? String(anuncio.importe_fianza) : '',
    gastos_incluidos:  anuncio.gastos_incluidos,
    duracion_minima:   anuncio.duracion_minima  ?? '',
    metros_habitacion: anuncio.metros_habitacion ? String(anuncio.metros_habitacion) : '',
    metros_piso:       anuncio.metros_piso      ? String(anuncio.metros_piso)       : '',
    num_personas:      anuncio.num_personas     ? String(anuncio.num_personas)      : '',
    vive_propietario:  anuncio.vive_propietario,
    admite_pareja:     anuncio.admite_pareja,
    admite_mascotas:   anuncio.admite_mascotas,
    empadronamiento:   anuncio.empadronamiento,
    fumadores:         anuncio.fumadores,
    preferencia_sexo:  anuncio.preferencia_sexo,
    tipo_cama:         anuncio.tipo_cama        ?? '',
    bano_privado:      anuncio.bano_privado,
    wifi:              anuncio.wifi,
    idioma_vivienda:   anuncio.idioma_vivienda  ?? 'Español',
    descripcion:       anuncio.descripcion      ?? '',
    normas:            anuncio.normas           ?? '',
  })

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }))
  const toggle = (key: string) =>
    set(key, !form[key as keyof typeof form])

  function marcarEliminar(id: number) {
    setImagenesExistentes((prev) => prev.filter((img) => img.id !== id))
    setEliminarIds((prev) => [...prev, id])
  }

  function addFiles(files: FileList | null) {
    if (!files) return
    const total = imagenesExistentes.length + nuevasPreviews.length
    const arr = Array.from(files).slice(0, 8 - total)
    const previews = arr.map((file) => ({ file, preview: URL.createObjectURL(file) }))
    setNuevasPreviews((prev) => [...prev, ...previews])
  }

  function removeNueva(i: number) {
    setNuevasPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.titulo || !form.parroquia || !form.precio) {
      setError('Título, parroquia y precio son obligatorios.')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // Subir nuevas fotos
      const nuevasUrls: string[] = []
      for (const { file } of nuevasPreviews) {
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { data } = await supabase.storage
          .from('habitaciones')
          .upload(path, file, { contentType: file.type, upsert: false })
        if (data) {
          const { data: urlData } = supabase.storage.from('habitaciones').getPublicUrl(data.path)
          nuevasUrls.push(urlData.publicUrl)
        }
      }

      const datos = {
        titulo:            form.titulo,
        parroquia:         form.parroquia,
        zona:              form.zona              || null,
        precio:            Number(form.precio),
        disponible_desde:  form.disponible_desde  || null,
        tipo_estancia:     form.tipo_estancia,
        fianza:            form.fianza,
        importe_fianza:    form.fianza && form.importe_fianza ? Number(form.importe_fianza) : null,
        gastos_incluidos:  form.gastos_incluidos,
        duracion_minima:   form.duracion_minima   || null,
        metros_habitacion: form.metros_habitacion ? Number(form.metros_habitacion) : null,
        metros_piso:       form.metros_piso       ? Number(form.metros_piso)       : null,
        num_personas:      form.num_personas      ? Number(form.num_personas)      : null,
        vive_propietario:  form.vive_propietario,
        admite_pareja:     form.admite_pareja,
        admite_mascotas:   form.admite_mascotas,
        empadronamiento:   form.empadronamiento,
        fumadores:         form.fumadores,
        preferencia_sexo:  form.preferencia_sexo,
        tipo_cama:         form.tipo_cama         || null,
        bano_privado:      form.bano_privado,
        wifi:              form.wifi,
        idioma_vivienda:   form.idioma_vivienda   || null,
        descripcion:       form.descripcion       || null,
        normas:            form.normas            || null,
        latitud:           coords.lat,
        longitud:          coords.lng,
      }

      const result = await editarAnuncio(anuncio.id, datos, nuevasUrls, eliminarIds)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      setGuardado(true)
      setTimeout(() => router.push(`/habitaciones/${anuncio.id}`), 1500)
    } catch {
      setError('Error inesperado. Inténtalo de nuevo.')
      setLoading(false)
    }
  }

  const totalFotos = imagenesExistentes.length + nuevasPreviews.length

  return (
    <>
      <LoadingOverlay visible={loading} />

      <div className="flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/perfil"
            className="w-10 h-10 rounded-2xl bg-[#f4f5f7] hover:bg-gray-200 flex items-center justify-center text-[#374151] transition-colors flex-shrink-0"
          >
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1a3c5e]">Editar anuncio</h1>
            <p className="text-sm text-[#6b7280]">Los cambios se guardan de inmediato · Sin revisión adicional</p>
          </div>
        </div>

        {/* Banner de éxito */}
        {guardado && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3.5">
            <span className="text-xl">✅</span>
            <p className="text-sm font-semibold text-emerald-700">¡Cambios guardados! Redirigiendo…</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* ── 1. Información básica */}
          <Seccion num={1} icon="📋" title="Información básica" subtitle="Título, precio y ubicación">
            <Input
              label="Título del anuncio *"
              placeholder="Ej: Habitación luminosa con balcón en el centro"
              value={form.titulo}
              onChange={(e) => set('titulo', e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">Precio mensual *</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="500"
                    value={form.precio}
                    onChange={(e) => set('precio', e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#6b7280]">€</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">Parroquia *</label>
                <select
                  value={form.parroquia}
                  onChange={(e) => set('parroquia', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                >
                  {PARROQUIAS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Zona / referencia"
                placeholder="Ej: Cerca del centro comercial"
                value={form.zona}
                onChange={(e) => set('zona', e.target.value)}
              />
              <Input
                label="Disponible desde"
                type="date"
                value={form.disponible_desde}
                onChange={(e) => set('disponible_desde', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">Tipo de estancia</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Todo el año', sub: 'Residencia habitual', v: 'anual',     icon: '🏠' },
                  { label: 'Temporero',   sub: 'Esquí, verano…',      v: 'temporero', icon: '⛷️' },
                  { label: 'Ambos',       sub: 'Flexible',            v: 'ambos',     icon: '✅' },
                ].map(({ label, sub, v, icon }) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => set('tipo_estancia', v)}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 transition-all text-center
                      ${form.tipo_estancia === v ? 'border-[#1a3c5e] bg-[#f0f4f8]' : 'border-gray-100 bg-[#f8fafc] hover:border-gray-200'}`}
                  >
                    <span className="text-xl">{icon}</span>
                    <span className={`text-xs font-bold leading-tight ${form.tipo_estancia === v ? 'text-[#1a3c5e]' : 'text-[#374151]'}`}>{label}</span>
                    <span className="text-[10px] text-[#9ca3af]">{sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </Seccion>

          {/* ── 2. Condiciones */}
          <Seccion num={2} icon="✅" title="Condiciones" subtitle="Qué incluye y qué se permite">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Toggle checked={form.fianza}           onToggle={() => toggle('fianza')}           label="Requiere fianza"        icon="🔐" />
              <Toggle checked={form.gastos_incluidos} onToggle={() => toggle('gastos_incluidos')} label="Gastos incluidos"        icon="💡" />
              <Toggle checked={form.admite_pareja}    onToggle={() => toggle('admite_pareja')}    label="Admite pareja"           icon="👫" />
              <Toggle checked={form.admite_mascotas}  onToggle={() => toggle('admite_mascotas')}  label="Admite mascotas"         icon="🐾" />
              <Toggle checked={form.empadronamiento}  onToggle={() => toggle('empadronamiento')}  label="Permite empadronamiento" icon="📄" />
              <Toggle checked={form.fumadores}        onToggle={() => toggle('fumadores')}        label="Se permite fumar"        icon="🚬" />
              <Toggle checked={form.bano_privado}     onToggle={() => toggle('bano_privado')}     label="Baño privado"            icon="🚿" />
              <Toggle checked={form.wifi}             onToggle={() => toggle('wifi')}             label="WiFi incluido"           icon="📶" />
            </div>
            {form.fianza && (
              <Input
                label="Importe de la fianza (€)"
                type="number"
                placeholder="Ej: 600"
                value={form.importe_fianza}
                onChange={(e) => set('importe_fianza', e.target.value)}
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Duración mínima"
                placeholder="Ej: 3 meses"
                value={form.duracion_minima}
                onChange={(e) => set('duracion_minima', e.target.value)}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">Preferencia género</label>
                <select
                  value={form.preferencia_sexo}
                  onChange={(e) => set('preferencia_sexo', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                >
                  <option value="indiferente">Indiferente</option>
                  <option value="chicas">Solo chicas</option>
                  <option value="chicos">Solo chicos</option>
                </select>
              </div>
            </div>
          </Seccion>

          {/* ── 3. Sobre la vivienda */}
          <Seccion num={3} icon="🛋️" title="Sobre la vivienda" subtitle="Detalles del piso y la habitación">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Habitación m²', key: 'metros_habitacion', placeholder: '12',    icon: '🛏️' },
                { label: 'Piso m²',       key: 'metros_piso',       placeholder: '80',    icon: '🏠' },
                { label: 'Convivientes',  key: 'num_personas',      placeholder: '3',     icon: '👥' },
                { label: 'Tipo de cama',  key: 'tipo_cama',         placeholder: 'Doble', icon: '🛌', text: true },
              ].map(({ label, key, placeholder, icon, text }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1a3c5e] ml-1 flex items-center gap-1">{icon} {label}</label>
                  <input
                    type={text ? 'text' : 'number'}
                    placeholder={placeholder}
                    value={form[key as keyof typeof form] as string}
                    onChange={(e) => set(key, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">🌐 Idioma principal</label>
                <select
                  value={form.idioma_vivienda}
                  onChange={(e) => set('idioma_vivienda', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                >
                  {['Español','Catalán','Francés','Portugués','Inglés','Indiferente'].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end pb-1">
                <Toggle checked={form.vive_propietario} onToggle={() => toggle('vive_propietario')} label="Vive el propietario" icon="🏡" />
              </div>
            </div>
          </Seccion>

          {/* ── 4. Ubicación */}
          <Seccion num={4} icon="📍" title="Ubicación en el mapa" subtitle="Opcional · Solo se muestra el pin, no la dirección exacta">
            <MapaPicker
              lat={coords.lat}
              lng={coords.lng}
              onChange={(lat, lng) => setCoords({ lat, lng })}
            />
          </Seccion>

          {/* ── 5. Descripción */}
          <Seccion num={5} icon="✍️" title="Descripción y normas" subtitle="Cuéntanos más sobre la habitación">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => set('descripcion', e.target.value)}
                rows={5}
                placeholder="Cuéntanos sobre la habitación, el piso, la zona…"
                className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none resize-none focus:border-[#1a3c5e] focus:bg-white transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">Normas de convivencia</label>
              <textarea
                value={form.normas}
                onChange={(e) => set('normas', e.target.value)}
                rows={3}
                placeholder="Horarios, limpieza, visitas, ruido…"
                className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none resize-none focus:border-[#1a3c5e] focus:bg-white transition-all"
              />
            </div>
          </Seccion>

          {/* ── 6. Fotos */}
          <Seccion num={6} icon="📸" title="Fotos de la habitación" subtitle={`${totalFotos}/8 fotos · La primera es la portada`}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />

            {totalFotos > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {/* Fotos existentes */}
                {imagenesExistentes.map((img, i) => (
                  <div key={img.id}
                    className={`relative aspect-square rounded-2xl overflow-hidden bg-gray-100
                      ${i === 0 && nuevasPreviews.length === 0 ? 'ring-2 ring-[#0ea5a0] ring-offset-2' : ''}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && nuevasPreviews.length === 0 && (
                      <div className="absolute bottom-0 inset-x-0 bg-[#0ea5a0]/90 text-white text-[9px] font-bold text-center py-1 uppercase tracking-wide">
                        Portada
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => marcarEliminar(img.id)}
                      className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center transition-colors"
                    >✕</button>
                  </div>
                ))}

                {/* Nuevas fotos */}
                {nuevasPreviews.map(({ preview }, i) => (
                  <div key={`new-${i}`}
                    className={`relative aspect-square rounded-2xl overflow-hidden bg-gray-100 ring-2 ring-dashed ring-[#0ea5a0]/40
                      ${imagenesExistentes.length === 0 && i === 0 ? 'ring-2 ring-[#0ea5a0] ring-offset-2 ring-solid' : ''}`}
                  >
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-1.5 left-1.5 bg-[#0ea5a0] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase">
                      Nueva
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNueva(i)}
                      className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center transition-colors"
                    >✕</button>
                  </div>
                ))}

                {/* Botón añadir más */}
                {totalFotos < 8 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#0ea5a0] bg-[#f8fafc] flex flex-col items-center justify-center gap-1 transition-colors group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">➕</span>
                    <span className="text-[10px] text-[#9ca3af]">Añadir</span>
                  </button>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-3xl border-2 border-dashed border-gray-200 bg-[#f8fafc] hover:border-[#0ea5a0] hover:bg-[#f0fafa] p-10 flex flex-col items-center gap-3 transition-all"
              >
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#e8edf2] to-[#f4f5f7] flex items-center justify-center text-3xl">📸</div>
                <div className="text-center">
                  <p className="font-bold text-[#1a3c5e] text-sm">Arrastra fotos aquí o toca para seleccionar</p>
                  <p className="text-xs text-[#9ca3af] mt-1">JPG, PNG · Hasta 8 fotos</p>
                </div>
              </div>
            )}
          </Seccion>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Botón guardar */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1a3c5e]">¿Todo listo?</p>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  Los cambios se aplicarán de inmediato en tu anuncio publicado.
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#0ea5a0] to-[#0c8e8a] text-white font-bold px-8 py-4 rounded-2xl hover:from-[#0c8e8a] transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-sm"
              >
                <span className="text-base">💾</span>
                Guardar cambios
              </button>
            </div>
          </div>

        </form>
      </div>
    </>
  )
}

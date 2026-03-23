'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Input from '@/components/ui/Input'
import MapaPicker from '@/components/maps/MapaPicker'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

const PARROQUIAS = [
  'Andorra la Vella', 'Escaldes-Engordany', 'Encamp',
  'Sant Julià de Lòria', 'La Massana', 'Ordino', 'Canillo',
]

function Seccion({ num, title, subtitle, children }: {
  num: number; icon?: string; title: string; subtitle?: string; children: React.ReactNode
}) {
  const t = useTranslations('editarAnuncio')
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#f8fafc] to-white">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#1a3c5e] text-white font-bold text-sm flex-shrink-0">
          {num}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">{t('paso')} {num}</span>
          <h2 className="font-bold text-[#1a3c5e] text-base leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-[#6b7280] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6 flex flex-col gap-5">{children}</div>
    </div>
  )
}

function Toggle({ checked, onToggle, label }: {
  checked: boolean; onToggle: () => void; label: string; icon?: string
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 focus:outline-none overflow-hidden
          ${checked ? 'bg-[#0ea5a0]' : 'bg-gray-200 group-hover:bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200
          ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
      <span className="text-sm text-[#374151] select-none">{label}</span>
    </label>
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
    estancia_minima: number | null
    estancia_maxima: number | null
    amueblada: boolean | null
    armario: boolean | null
    escritorio: boolean | null
    exterior: boolean | null
    balcon_ventana: boolean | null
    num_habitaciones: number | null
    num_banos: number | null
    ascensor: boolean | null
    parking: boolean | null
    calefaccion: string | null
    terraza: boolean | null
    imagenes_anuncio: ImagenExistente[]
  }
}

export default function FormularioEditar({ anuncio }: Props) {
  const router = useRouter()
  const t = useTranslations('editarAnuncio')
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guardado, setGuardado] = useState(false)

  const [imagenesExistentes, setImagenesExistentes] = useState<ImagenExistente[]>(anuncio.imagenes_anuncio)
  const [eliminarIds, setEliminarIds] = useState<number[]>([])
  const [nuevasPreviews, setNuevasPreviews] = useState<{ file: File; preview: string }[]>([])

  const [coords, setCoords] = useState({
    lat: anuncio.latitud,
    lng: anuncio.longitud,
  })

  const [form, setForm] = useState({
    titulo:            anuncio.titulo,
    parroquia:         anuncio.parroquia,
    zona:              anuncio.zona              ?? '',
    precio:            String(anuncio.precio),
    disponible_desde:  anuncio.disponible_desde  ?? '',
    tipo_estancia:     anuncio.tipo_estancia,
    fianza:            anuncio.fianza,
    importe_fianza:    anuncio.importe_fianza    ? String(anuncio.importe_fianza) : '',
    gastos_incluidos:  anuncio.gastos_incluidos,
    duracion_minima:   anuncio.duracion_minima   ?? '',
    metros_habitacion: anuncio.metros_habitacion ? String(anuncio.metros_habitacion) : '',
    metros_piso:       anuncio.metros_piso       ? String(anuncio.metros_piso)       : '',
    num_personas:      anuncio.num_personas      ? String(anuncio.num_personas)      : '',
    vive_propietario:  anuncio.vive_propietario,
    admite_pareja:     anuncio.admite_pareja,
    admite_mascotas:   anuncio.admite_mascotas,
    empadronamiento:   anuncio.empadronamiento,
    fumadores:         anuncio.fumadores,
    preferencia_sexo:  anuncio.preferencia_sexo,
    tipo_cama:         anuncio.tipo_cama         ?? '',
    bano_privado:      anuncio.bano_privado,
    wifi:              anuncio.wifi,
    idioma_vivienda:   anuncio.idioma_vivienda   ?? 'Español',
    descripcion:       anuncio.descripcion       ?? '',
    normas:            anuncio.normas            ?? '',
    estancia_minima:   anuncio.estancia_minima   ? String(anuncio.estancia_minima)   : '',
    estancia_maxima:   anuncio.estancia_maxima   ? String(anuncio.estancia_maxima)   : '',
    amueblada:         anuncio.amueblada         ?? false,
    armario:           anuncio.armario           ?? false,
    escritorio:        anuncio.escritorio        ?? false,
    exterior:          anuncio.exterior          ?? true,
    balcon_ventana:    anuncio.balcon_ventana     ?? false,
    num_habitaciones:  anuncio.num_habitaciones  ? String(anuncio.num_habitaciones)  : '',
    num_banos:         anuncio.num_banos         ? String(anuncio.num_banos)         : '',
    ascensor:          anuncio.ascensor          ?? false,
    parking:           anuncio.parking           ?? false,
    calefaccion:       anuncio.calefaccion       ?? 'no',
    terraza:           anuncio.terraza           ?? false,
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
      setError(t('requiredError'))
      return
    }
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

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
        estancia_minima:   form.estancia_minima   ? Number(form.estancia_minima)   : null,
        estancia_maxima:   form.estancia_maxima   ? Number(form.estancia_maxima)   : null,
        amueblada:         form.amueblada,
        armario:           form.armario,
        escritorio:        form.escritorio,
        exterior:          form.exterior,
        balcon_ventana:    form.balcon_ventana,
        num_habitaciones:  form.num_habitaciones  ? Number(form.num_habitaciones)  : null,
        num_banos:         form.num_banos         ? Number(form.num_banos)         : null,
        ascensor:          form.ascensor,
        parking:           form.parking,
        calefaccion:       form.calefaccion,
        terraza:           form.terraza,
      }

      const { error: updateError } = await supabase
        .from('anuncios')
        .update(datos)
        .eq('id', anuncio.id)
        .eq('user_id', user.id)

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      if (eliminarIds.length > 0) {
        await supabase.from('imagenes_anuncio').delete().in('id', eliminarIds)
      }

      if (nuevasUrls.length > 0) {
        const { data: existentes } = await supabase
          .from('imagenes_anuncio')
          .select('orden')
          .eq('anuncio_id', anuncio.id)
          .order('orden', { ascending: false })
          .limit(1)
        const baseOrden = (existentes?.[0]?.orden ?? -1) + 1
        await supabase.from('imagenes_anuncio').insert(
          nuevasUrls.map((url, i) => ({ anuncio_id: anuncio.id, url, orden: baseOrden + i }))
        )
      }

      setGuardado(true)
      setLoading(false)
      setTimeout(() => router.push(`/habitaciones/${anuncio.id}`), 1500)
    } catch {
      setError(t('unexpectedError'))
      setLoading(false)
    }
  }

  const totalFotos = imagenesExistentes.length + nuevasPreviews.length

  return (
    <>
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
            <h1 className="text-2xl font-bold text-[#1a3c5e]">{t('title')}</h1>
            <p className="text-sm text-[#6b7280]">{t('subtitle')}</p>
          </div>
        </div>

        {guardado && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-600 flex-shrink-0">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <p className="text-sm font-semibold text-emerald-700">{t('saved')}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* ── 1. Información básica ── */}
          <Seccion num={1} title={t('sec1Title')} subtitle={t('sec1Sub')}>
            <Input
              label={t('titleLabel')}
              placeholder={t('titlePlaceholder')}
              value={form.titulo}
              onChange={(e) => set('titulo', e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('priceLabel')}</label>
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
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('parishLabel')}</label>
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
                label={t('zoneLabel')}
                placeholder={t('zonePlaceholder')}
                value={form.zona}
                onChange={(e) => set('zona', e.target.value)}
              />
              <Input
                label={t('availableFrom')}
                type="date"
                value={form.disponible_desde}
                onChange={(e) => set('disponible_desde', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('stayType')}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: t('stayAnnual'),   sub: t('stayAnnualSub'),   v: 'anual' },
                  { label: t('staySeasonal'),  sub: t('staySeasonalSub'), v: 'temporero' },
                  { label: t('stayFlexible'),  sub: t('stayFlexibleSub'), v: 'ambos' },
                ].map(({ label, sub, v }) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => set('tipo_estancia', v)}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 transition-all text-center
                      ${form.tipo_estancia === v ? 'border-[#1a3c5e] bg-[#f0f4f8]' : 'border-gray-100 bg-[#f8fafc] hover:border-gray-200'}`}
                  >
                    <span className={`text-xs font-bold leading-tight ${form.tipo_estancia === v ? 'text-[#1a3c5e]' : 'text-[#374151]'}`}>{label}</span>
                    <span className="text-[10px] text-[#9ca3af]">{sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </Seccion>

          {/* ── 2. La habitación ── */}
          <Seccion num={2} title={t('sec2Title')} subtitle={t('sec2Sub')}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('surface')}</label>
                <input
                  type="number"
                  placeholder="12"
                  value={form.metros_habitacion}
                  onChange={(e) => set('metros_habitacion', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('bedType')}</label>
                <select
                  value={form.tipo_cama}
                  onChange={(e) => set('tipo_cama', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                >
                  <option value="">{t('bedSelect')}</option>
                  <option value="Individual">{t('bedSingle')}</option>
                  <option value="Doble">{t('bedDouble')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('minStay')}</label>
                <input
                  type="number"
                  placeholder="1"
                  min="1"
                  value={form.estancia_minima}
                  onChange={(e) => set('estancia_minima', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('maxStay')}</label>
                <input
                  type="number"
                  placeholder="12"
                  min="1"
                  value={form.estancia_maxima}
                  onChange={(e) => set('estancia_maxima', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Toggle checked={form.amueblada}      onToggle={() => toggle('amueblada')}      label={t('furnished')} />
              <Toggle checked={form.exterior}       onToggle={() => toggle('exterior')}       label={t('exterior')} />
              <Toggle checked={form.armario}        onToggle={() => toggle('armario')}        label={t('wardrobe')} />
              <Toggle checked={form.escritorio}     onToggle={() => toggle('escritorio')}     label={t('desk')} />
              <Toggle checked={form.balcon_ventana} onToggle={() => toggle('balcon_ventana')} label={t('balcony')} />
              <Toggle checked={form.bano_privado}   onToggle={() => toggle('bano_privado')}   label={t('privateBath')} />
            </div>
          </Seccion>

          {/* ── 3. La vivienda ── */}
          <Seccion num={3} title={t('sec3Title')} subtitle={t('sec3Sub')}>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1a3c5e] ml-1">{t('rooms')}</label>
                <input
                  type="number"
                  placeholder="3"
                  min="1"
                  value={form.num_habitaciones}
                  onChange={(e) => set('num_habitaciones', e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1a3c5e] ml-1">{t('baths')}</label>
                <input
                  type="number"
                  placeholder="1"
                  min="1"
                  value={form.num_banos}
                  onChange={(e) => set('num_banos', e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1a3c5e] ml-1">{t('cohabitants')}</label>
                <input
                  type="number"
                  placeholder="3"
                  min="1"
                  value={form.num_personas}
                  onChange={(e) => set('num_personas', e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('heating')}</label>
              <select
                value={form.calefaccion}
                onChange={(e) => set('calefaccion', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
              >
                <option value="no">{t('heatingNo')}</option>
                <option value="si">{t('heatingYes')}</option>
                <option value="incluida">{t('heatingIncluded')}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Toggle checked={form.ascensor}         onToggle={() => toggle('ascensor')}         label={t('elevator')} />
              <Toggle checked={form.parking}          onToggle={() => toggle('parking')}          label={t('parking')} />
              <Toggle checked={form.terraza}          onToggle={() => toggle('terraza')}          label={t('terrace')} />
              <Toggle checked={form.vive_propietario} onToggle={() => toggle('vive_propietario')} label={t('ownerLives')} />
            </div>
          </Seccion>

          {/* ── 4. Condiciones ── */}
          <Seccion num={4} title={t('sec4Title')} subtitle={t('sec4Sub')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Toggle checked={form.fianza}           onToggle={() => toggle('fianza')}           label={t('deposit')} />
              <Toggle checked={form.gastos_incluidos} onToggle={() => toggle('gastos_incluidos')} label={t('expensesIncluded')} />
              <Toggle checked={form.wifi}             onToggle={() => toggle('wifi')}             label={t('wifi')} />
              <Toggle checked={form.admite_pareja}    onToggle={() => toggle('admite_pareja')}    label={t('couples')} />
              <Toggle checked={form.admite_mascotas}  onToggle={() => toggle('admite_mascotas')}  label={t('pets')} />
              <Toggle checked={form.fumadores}        onToggle={() => toggle('fumadores')}        label={t('smoking')} />
              <Toggle checked={form.empadronamiento}  onToggle={() => toggle('empadronamiento')}  label={t('empadronamiento')} />
            </div>

            {form.fianza && (
              <Input
                label={t('depositAmount')}
                type="number"
                placeholder="600"
                value={form.importe_fianza}
                onChange={(e) => set('importe_fianza', e.target.value)}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('minDuration')}
                placeholder={t('minDurationPlaceholder')}
                value={form.duracion_minima}
                onChange={(e) => set('duracion_minima', e.target.value)}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('preferredProfile')}</label>
                <select
                  value={form.preferencia_sexo}
                  onChange={(e) => set('preferencia_sexo', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                >
                  <option value="indiferente">{t('profileAny')}</option>
                  <option value="chicas">{t('profileGirls')}</option>
                  <option value="chicos">{t('profileBoys')}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('language')}</label>
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
          </Seccion>

          {/* ── 5. Ubicación ── */}
          <Seccion num={5} title={t('sec5Title')} subtitle={t('sec5Sub')}>
            <MapaPicker
              lat={coords.lat}
              lng={coords.lng}
              onChange={(lat, lng) => setCoords({ lat, lng })}
            />
          </Seccion>

          {/* ── 6. Descripción ── */}
          <Seccion num={6} title={t('sec6Title')} subtitle={t('sec6Sub')}>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('description')}</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => set('descripcion', e.target.value)}
                rows={5}
                placeholder={t('descPlaceholder')}
                className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none resize-none focus:border-[#1a3c5e] focus:bg-white transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('rules')}</label>
              <textarea
                value={form.normas}
                onChange={(e) => set('normas', e.target.value)}
                rows={3}
                placeholder={t('rulesPlaceholder')}
                className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none resize-none focus:border-[#1a3c5e] focus:bg-white transition-all"
              />
            </div>
          </Seccion>

          {/* ── 7. Fotos ── */}
          <Seccion num={7} title={t('sec7Title')} subtitle={t('sec7Sub', { n: totalFotos })}>
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
                {imagenesExistentes.map((img, i) => (
                  <div key={img.id}
                    className={`relative aspect-square rounded-2xl overflow-hidden bg-gray-100
                      ${i === 0 && nuevasPreviews.length === 0 ? 'ring-2 ring-[#0ea5a0] ring-offset-2' : ''}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && nuevasPreviews.length === 0 && (
                      <div className="absolute bottom-0 inset-x-0 bg-[#0ea5a0]/90 text-white text-[9px] font-bold text-center py-1 uppercase tracking-wide">
                        {t('cover')}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => marcarEliminar(img.id)}
                      className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center transition-colors"
                    >✕</button>
                  </div>
                ))}

                {nuevasPreviews.map(({ preview }, i) => (
                  <div key={`new-${i}`}
                    className={`relative aspect-square rounded-2xl overflow-hidden bg-gray-100 ring-2 ring-dashed ring-[#0ea5a0]/40
                      ${imagenesExistentes.length === 0 && i === 0 ? 'ring-2 ring-[#0ea5a0] ring-offset-2 ring-solid' : ''}`}
                  >
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-1.5 left-1.5 bg-[#0ea5a0] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase">
                      {t('newPhoto')}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNueva(i)}
                      className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center transition-colors"
                    >✕</button>
                  </div>
                ))}

                {totalFotos < 8 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#0ea5a0] bg-[#f8fafc] flex flex-col items-center justify-center gap-1 transition-colors group"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-5 h-5 text-[#9ca3af] group-hover:text-[#0ea5a0] transition-colors">
                      <path d="M12 4v16m8-8H4"/>
                    </svg>
                    <span className="text-[10px] text-[#9ca3af]">{t('addPhoto')}</span>
                  </button>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-3xl border-2 border-dashed border-gray-200 bg-[#f8fafc] hover:border-[#0ea5a0] hover:bg-[#f0fafa] p-10 flex flex-col items-center gap-3 transition-all"
              >
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#e8edf2] to-[#f4f5f7] flex items-center justify-center text-[#9ca3af]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#1a3c5e] text-sm">{t('dragPhotos')}</p>
                  <p className="text-xs text-[#9ca3af] mt-1">{t('photoFormats')}</p>
                </div>
              </div>
            )}
          </Seccion>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-500 flex-shrink-0">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Botón guardar */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1a3c5e]">{t('readyTitle')}</p>
                <p className="text-xs text-[#6b7280] mt-0.5">{t('readyDesc')}</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#0ea5a0] to-[#0c8e8a] text-white font-bold px-8 py-4 rounded-2xl hover:from-[#0c8e8a] transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-sm"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                    </svg>
                    {t('saving')}
                  </>
                ) : (
                  t('save')
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </>
  )
}

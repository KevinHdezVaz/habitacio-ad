'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Input from '@/components/ui/Input'
import MapaPicker from '@/components/maps/MapaPicker'
import { createClient } from '@/lib/supabase-browser'
import { publicarAnuncio } from '@/app/actions/anuncios'
import Link from 'next/link'

const PARROQUIAS = [
  'Andorra la Vella', 'Escaldes-Engordany', 'Encamp',
  'Sant Julià de Lòria', 'La Massana', 'Ordino', 'Canillo',
]

// ─── Componentes auxiliares ────────────────────────────────────────────────

function Seccion({
  num, icon, title, subtitle, children, stepLabel,
}: {
  num: number; icon?: string; title: string; subtitle?: string; children: React.ReactNode; stepLabel: string
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#f8fafc] to-white">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#1a3c5e] text-white font-bold text-sm flex-shrink-0">
          {num}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">{stepLabel}</span>
          <h2 className="font-bold text-[#1a3c5e] text-base leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-[#6b7280] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6 flex flex-col gap-5">
        {children}
      </div>
    </div>
  )
}

function Toggle({
  checked, onToggle, label,
}: {
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
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
      <span className="text-sm text-[#374151] select-none">{label}</span>
    </label>
  )
}

function LoadingOverlay({ visible, title, subtitle }: { visible: boolean; title: string; subtitle: string }) {
  if (!visible) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-[#e8edf2]" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1a3c5e] animate-spin" />
          <div
            className="absolute inset-3 rounded-full border-4 border-transparent border-t-[#0ea5a0] animate-spin"
            style={{ animationDuration: '0.6s', animationDirection: 'reverse' }}
          />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-[#1a3c5e]">{title}</p>
          <p className="text-sm text-[#6b7280] mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Componente principal ──────────────────────────────────────────────────

export default function FormularioPublicar({ hasPhone }: { hasPhone: boolean }) {
  const t = useTranslations('publish')
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreviews, setImagePreviews] = useState<{ file: File; preview: string }[]>([])
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null })
  const [dragOver, setDragOver] = useState(false)

  const [form, setForm] = useState({
    titulo: '', parroquia: '', zona: '', precio: '',
    disponible_desde: '', tipo_estancia: 'anual',
    fianza: false, importe_fianza: '',
    gastos_incluidos: false, duracion_minima: '',
    metros_habitacion: '', metros_piso: '',
    num_personas: '', vive_propietario: false,
    admite_pareja: false, admite_mascotas: false,
    empadronamiento: false, fumadores: false,
    preferencia_sexo: 'indiferente',
    tipo_cama: '', bano_privado: false, wifi: true,
    idioma_vivienda: 'Español',
    descripcion: '', normas: '',
    // La habitación (nuevos campos)
    estancia_minima: '',
    estancia_maxima: '',
    amueblada: false,
    armario: false,
    escritorio: false,
    exterior: true,
    balcon_ventana: false,
    // La vivienda (nuevos campos)
    num_habitaciones: '',
    num_banos: '',
    ascensor: false,
    parking: false,
    calefaccion: 'no',
    terraza: false,
  })

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }
  const toggle = (key: string) => set(key, !form[key as keyof typeof form])

  function addFiles(files: FileList | null) {
    if (!files) return
    const arr = Array.from(files).slice(0, 8 - imagePreviews.length)
    const previews = arr.map((file) => ({ file, preview: URL.createObjectURL(file) }))
    setImagePreviews((prev) => [...prev, ...previews].slice(0, 8))
  }

  function removeImage(index: number) {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.titulo || !form.parroquia || !form.precio) {
      setError(t('errorRequired'))
      return
    }
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?next=/publicar'); return }

      const imageUrls: string[] = []
      for (const { file } of imagePreviews) {
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { data, error: uploadError } = await supabase.storage
          .from('habitaciones')
          .upload(path, file, { contentType: file.type, upsert: false })
        if (data) {
          const { data: urlData } = supabase.storage.from('habitaciones').getPublicUrl(data.path)
          imageUrls.push(urlData.publicUrl)
        } else {
          console.error('Upload error:', uploadError)
        }
      }

      const datos = {
        titulo: form.titulo,
        parroquia: form.parroquia,
        zona: form.zona || null,
        precio: Number(form.precio),
        disponible_desde: form.disponible_desde || null,
        tipo_estancia: form.tipo_estancia,
        fianza: form.fianza,
        importe_fianza: form.fianza && form.importe_fianza ? Number(form.importe_fianza) : null,
        gastos_incluidos: form.gastos_incluidos,
        duracion_minima: form.duracion_minima || null,
        metros_habitacion: form.metros_habitacion ? Number(form.metros_habitacion) : null,
        metros_piso: form.metros_piso ? Number(form.metros_piso) : null,
        num_personas: form.num_personas ? Number(form.num_personas) : null,
        vive_propietario: form.vive_propietario,
        admite_pareja: form.admite_pareja,
        admite_mascotas: form.admite_mascotas,
        empadronamiento: form.empadronamiento,
        fumadores: form.fumadores,
        preferencia_sexo: form.preferencia_sexo,
        tipo_cama: form.tipo_cama || null,
        bano_privado: form.bano_privado,
        wifi: form.wifi,
        idioma_vivienda: form.idioma_vivienda || null,
        descripcion: form.descripcion || null,
        normas: form.normas || null,
        latitud: coords.lat && coords.lat !== 0 ? coords.lat : null,
        longitud: coords.lng && coords.lng !== 0 ? coords.lng : null,
        // Nuevos campos
        estancia_minima: form.estancia_minima ? Number(form.estancia_minima) : null,
        estancia_maxima: form.estancia_maxima ? Number(form.estancia_maxima) : null,
        amueblada: form.amueblada,
        armario: form.armario,
        escritorio: form.escritorio,
        exterior: form.exterior,
        balcon_ventana: form.balcon_ventana,
        num_habitaciones: form.num_habitaciones ? Number(form.num_habitaciones) : null,
        num_banos: form.num_banos ? Number(form.num_banos) : null,
        ascensor: form.ascensor,
        parking: form.parking,
        calefaccion: form.calefaccion,
        terraza: form.terraza,
      }

      const result = await publicarAnuncio(datos, imageUrls)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
        return
      }
      router.push('/publicar/enviado')
    } catch {
      setError(t('errorGeneric'))
      setLoading(false)
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <LoadingOverlay visible={loading} title={t('publishingAd')} subtitle={t('uploadingImages')} />

      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Hero header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a3c5e] to-[#0ea5a0] flex items-center justify-center text-2xl shadow-md">
              🏠
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a3c5e]">{t('publishYourRoom')}</h1>
              <p className="text-sm text-[#6b7280]">{t('completeDetails')}</p>
            </div>
          </div>
          {/* Barra decorativa de pasos */}
          <div className="flex items-center gap-1">
            {[1,2,3,4,5,6,7].map((n) => (
              <div key={n} className="flex-1 h-1 rounded-full bg-gradient-to-r from-[#1a3c5e] to-[#0ea5a0] opacity-15" />
            ))}
          </div>
        </div>

        {/* Aviso teléfono */}
        {!hasPhone && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-base">📞</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800">{t('addPhonePrompt')}</p>
              <p className="text-xs text-amber-700 mt-0.5">
                {t('addPhoneDesc')}{' '}
                <Link href="/perfil" className="font-bold underline underline-offset-2 hover:text-amber-900">
                  {t('addPhoneLink')}
                </Link>
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* ── 1. Información básica ── */}
          <Seccion num={1} title={t('basicInfo')} subtitle={t('basicInfoSubtitle')} stepLabel={t('step', { num: 1 })}>
            <Input
              label={t('adTitle')}
              placeholder={t('titlePlaceholder')}
              value={form.titulo}
              onChange={(e) => set('titulo', e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('monthlyPriceLabel')}</label>
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
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('parish')}</label>
                <select
                  value={form.parroquia}
                  onChange={(e) => set('parroquia', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                >
                  <option value="">{t('selectParish')}</option>
                  {PARROQUIAS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('zoneLabel')}
                placeholder={t('zonePlaceholder2')}
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

            {/* Tipo estancia — cards visuales */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('stayType')}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: t('stayTypeAnnual'),   sub: t('stayTypeAnnualDesc'),   v: 'anual' },
                  { label: t('stayTypeSeasonal'),  sub: t('stayTypeSeasonalDesc'), v: 'temporero' },
                  { label: t('stayTypeBoth'),      sub: t('stayTypeBothDesc'),     v: 'ambos' },
                ].map(({ label, sub, v }) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => set('tipo_estancia', v)}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 transition-all text-center
                      ${form.tipo_estancia === v
                        ? 'border-[#1a3c5e] bg-[#f0f4f8]'
                        : 'border-gray-100 bg-[#f8fafc] hover:border-gray-200'}`}
                  >
                    <span className={`text-xs font-bold leading-tight ${form.tipo_estancia === v ? 'text-[#1a3c5e]' : 'text-[#374151]'}`}>{label}</span>
                    <span className="text-[10px] text-[#9ca3af]">{sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </Seccion>

          {/* ── 2. La habitación ── */}
          <Seccion num={2} title={t('roomSectionTitle')} subtitle={t('roomSectionSubtitle')} stepLabel={t('step', { num: 2 })}>
            {/* Row 1: metros + tipo cama */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('surfaceLabel')}</label>
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
                  <option value="">{t('selectParish').replace('...', '…')}</option>
                  <option value="Individual">{t('bedTypeIndividual')}</option>
                  <option value="Doble">{t('bedTypeDouble')}</option>
                </select>
              </div>
            </div>

            {/* Row 2: estancia mínima + máxima */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('minStayLabel')}</label>
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
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('maxStayLabel')}</label>
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

            {/* Toggles grid 2 por fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Toggle checked={form.amueblada}     onToggle={() => toggle('amueblada')}     label={t('toggleFurnished')} />
              <Toggle checked={form.exterior}      onToggle={() => toggle('exterior')}      label={t('toggleExterior')} />
              <Toggle checked={form.armario}       onToggle={() => toggle('armario')}       label={t('toggleWardrobe')} />
              <Toggle checked={form.escritorio}    onToggle={() => toggle('escritorio')}    label={t('toggleDesk')} />
              <Toggle checked={form.balcon_ventana} onToggle={() => toggle('balcon_ventana')} label={t('toggleBalcony')} />
              <Toggle checked={form.bano_privado}  onToggle={() => toggle('bano_privado')}  label={t('togglePrivateBath')} />
            </div>
          </Seccion>

          {/* ── 3. La vivienda ── */}
          <Seccion num={3} title={t('houseSectionTitle')} subtitle={t('houseSectionSubtitle')} stepLabel={t('step', { num: 3 })}>
            {/* Row: habitaciones + baños + personas */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1a3c5e] ml-1">{t('roomsLabel')}</label>
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
                <label className="text-xs font-bold text-[#1a3c5e] ml-1">{t('bathroomsLabel')}</label>
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
                <label className="text-xs font-bold text-[#1a3c5e] ml-1">{t('housemates')}</label>
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

            {/* Calefacción */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('heatingLabel')}</label>
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

            {/* Toggles 2 por fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Toggle checked={form.ascensor}        onToggle={() => toggle('ascensor')}        label={t('toggleElevator')} />
              <Toggle checked={form.parking}         onToggle={() => toggle('parking')}         label={t('toggleParking')} />
              <Toggle checked={form.terraza}         onToggle={() => toggle('terraza')}         label={t('toggleTerrace')} />
              <Toggle checked={form.vive_propietario} onToggle={() => toggle('vive_propietario')} label={t('toggleOwnerLives')} />
            </div>
          </Seccion>

          {/* ── 4. Condiciones ── */}
          <Seccion num={4} title={t('conditionsSectionTitle')} subtitle={t('conditionsSectionSubtitle')} stepLabel={t('step', { num: 4 })}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Toggle checked={form.fianza}           onToggle={() => toggle('fianza')}           label={t('toggleDeposit')} />
              <Toggle checked={form.gastos_incluidos} onToggle={() => toggle('gastos_incluidos')} label={t('toggleExpenses')} />
              <Toggle checked={form.wifi}             onToggle={() => toggle('wifi')}             label={t('toggleWifi')} />
              <Toggle checked={form.admite_pareja}    onToggle={() => toggle('admite_pareja')}    label={t('toggleCouples')} />
              <Toggle checked={form.admite_mascotas}  onToggle={() => toggle('admite_mascotas')}  label={t('togglePets')} />
              <Toggle checked={form.fumadores}        onToggle={() => toggle('fumadores')}        label={t('toggleSmoking')} />
              <Toggle checked={form.empadronamiento}  onToggle={() => toggle('empadronamiento')}  label={t('toggleRegistration')} />
            </div>

            {form.fianza && (
              <Input
                label={t('depositAmountLabel')}
                type="number"
                placeholder={t('depositAmountPlaceholder2')}
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
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('profileLabel')}</label>
                <select
                  value={form.preferencia_sexo}
                  onChange={(e) => set('preferencia_sexo', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                >
                  <option value="indiferente">{t('profileIndifferent')}</option>
                  <option value="chicas">{t('profileGirls')}</option>
                  <option value="chicos">{t('profileBoys')}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('languagesLabel')}</label>
              <select
                value={form.idioma_vivienda}
                onChange={(e) => set('idioma_vivienda', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
              >
                {[
                  { val: 'Español',    label: t('langSpanish') },
                  { val: 'Catalán',    label: t('langCatalan') },
                  { val: 'Francés',    label: t('langFrench') },
                  { val: 'Portugués',  label: t('langPortuguese') },
                  { val: 'Inglés',     label: t('langEnglish') },
                  { val: 'Indiferente', label: t('langIndifferent') },
                ].map(({ val, label }) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </Seccion>

          {/* ── 5. Ubicación ── */}
          <Seccion num={5} title={t('mapSectionTitle')} subtitle={t('mapSectionSubtitle')} stepLabel={t('step', { num: 5 })}>
            <MapaPicker
              lat={coords.lat}
              lng={coords.lng}
              onChange={(lat, lng) => setCoords({ lat, lng })}
            />
          </Seccion>

          {/* ── 6. Descripción y normas ── */}
          <Seccion num={6} title={t('descSectionTitle')} subtitle={t('descSectionSubtitle')} stepLabel={t('step', { num: 6 })}>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('descLabel2')}</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => set('descripcion', e.target.value)}
                rows={5}
                placeholder={t('descPlaceholder2')}
                className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none resize-none focus:border-[#1a3c5e] focus:bg-white transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">{t('rulesLabel2')}</label>
              <textarea
                value={form.normas}
                onChange={(e) => set('normas', e.target.value)}
                rows={3}
                placeholder={t('rulesPlaceholder2')}
                className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none resize-none focus:border-[#1a3c5e] focus:bg-white transition-all"
              />
            </div>
          </Seccion>

          {/* ── 7. Fotos ── */}
          <Seccion num={7} title={t('photosSectionTitle')} subtitle={t('photosSectionSubtitle')} stepLabel={t('step', { num: 7 })}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {imagePreviews.map(({ preview }, i) => (
                  <div
                    key={i}
                    className={`relative aspect-square rounded-2xl overflow-hidden bg-gray-100
                      ${i === 0 ? 'ring-2 ring-[#0ea5a0] ring-offset-2' : ''}`}
                  >
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute bottom-0 inset-x-0 bg-[#0ea5a0]/90 text-white text-[9px] font-bold text-center py-1 uppercase tracking-wide">
                        {t('coverLabel')}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {imagePreviews.length < 8 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#0ea5a0] bg-[#f8fafc] flex flex-col items-center justify-center gap-1 transition-colors group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">➕</span>
                    <span className="text-[10px] text-[#9ca3af]">{t('addPhotoBtn')}</span>
                  </button>
                )}
              </div>
            )}

            {imagePreviews.length === 0 && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
                onClick={() => fileRef.current?.click()}
                className={`cursor-pointer rounded-3xl border-2 border-dashed transition-all p-10 flex flex-col items-center gap-3
                  ${dragOver
                    ? 'border-[#0ea5a0] bg-[#e6f7f7]'
                    : 'border-gray-200 bg-[#f8fafc] hover:border-[#0ea5a0] hover:bg-[#f0fafa]'}`}
              >
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#e8edf2] to-[#f4f5f7] flex items-center justify-center text-3xl">
                  📸
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#1a3c5e] text-sm">{t('dropzoneText')}</p>
                  <p className="text-xs text-[#9ca3af] mt-1">{t('dropzoneHint')}</p>
                </div>
              </div>
            )}

            {imagePreviews.length > 0 && (
              <p className="text-xs text-[#9ca3af] text-center">
                {t('photoCount', { n: imagePreviews.length })}
              </p>
            )}
          </Seccion>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* ── Botón de envío ── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1a3c5e]">{t('readyTitle')}</p>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  {t('readyDesc')}
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a3c5e] to-[#1e4a72] text-white font-bold px-8 py-4 rounded-2xl hover:from-[#152e4a] hover:to-[#193d5e] transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-sm"
              >
                <span className="text-base">🚀</span>
                {t('submitBtn')}
              </button>
            </div>
          </div>

        </form>
      </div>
    </>
  )
}

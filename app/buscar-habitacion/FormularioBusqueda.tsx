'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { publicarPerfilInquilino } from '@/app/actions/perfiles-inquilino'
import Avatar from '@/components/ui/Avatar'
import type { TipoBusqueda, SituacionLaboral, SexoPerfil } from '@/types'

const PARROQUIAS = [
  'Andorra la Vella', 'Escaldes-Engordany', 'Encamp',
  'Canillo', 'Ordino', 'La Massana', 'Sant Julià de Lòria',
]

const PRESUPUESTOS = [300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500]

type FormState = {
  tipo_busqueda: TipoBusqueda | null
  parroquias: string[]
  presupuesto_max: number
  fecha_entrada: string
  fecha_salida: string
  nombre: string
  edad: string
  sexo: SexoPerfil | null
  situacion: SituacionLaboral | ''
  sector: string
  fumador: boolean
  mascotas: boolean
  acompanado: boolean
  descripcion: string
}

const INITIAL: FormState = {
  tipo_busqueda: null, parroquias: [], presupuesto_max: 700,
  fecha_entrada: '', fecha_salida: '', nombre: '', edad: '',
  sexo: null, situacion: '', sector: '', fumador: false, mascotas: false,
  acompanado: false, descripcion: '',
}

const TOTAL_STEPS = 4

// ─── Barra de progreso mejorada ──────────────────────────────────────────────
function ProgressBar({ step, labels }: { step: number; labels: string[] }) {
  return (
    <div className="flex items-center gap-0">
      {labels.map((label, i) => (
        <div key={i} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2
              ${i < step  ? 'bg-[#0ea5a0] border-[#0ea5a0] text-white shadow-md shadow-[#0ea5a0]/30'
              : i === step ? 'bg-[#1a3c5e] border-[#1a3c5e] text-white shadow-md shadow-[#1a3c5e]/30'
              : 'bg-white border-gray-200 text-gray-300'}`}
            >
              {i < step ? (
                <svg viewBox="0 0 12 12" fill="none" className="w-4 h-4">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (i + 1)}
            </div>
            <span className={`text-[10px] font-semibold whitespace-nowrap transition-colors
              ${i === step ? 'text-[#1a3c5e]' : i < step ? 'text-[#0ea5a0]' : 'text-gray-300'}`}>
              {label}
            </span>
          </div>
          {i < TOTAL_STEPS - 1 && (
            <div className={`flex-1 h-0.5 mx-1 rounded-full transition-all duration-500
              ${i < step ? 'bg-[#0ea5a0]' : 'bg-gray-200'}`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Toggle mejorado ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; icon?: string
}) {
  return (
    <label className={`flex items-center justify-between w-full px-4 py-3.5 rounded-2xl border-2 transition-all cursor-pointer
      ${checked ? 'border-[#0ea5a0] bg-gradient-to-r from-[#e6f7f7] to-[#f0fafa]' : 'border-gray-100 bg-[#f8fafc] hover:border-gray-200'}`}
    >
      <span className="text-sm font-semibold text-[#374151]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 focus:outline-none overflow-hidden
          ${checked ? 'bg-[#0ea5a0]' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200
          ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </label>
  )
}

// ─── Vista previa ────────────────────────────────────────────────────────────
function VistaPrevia({ data, avatarUrl, t }: { data: FormState; avatarUrl?: string | null; t: ReturnType<typeof useTranslations> }) {
  const labelTipo: Record<TipoBusqueda, string> = {
    anual: t('annual'), temporero: t('seasonal'), ambos: t('both'),
  }
  const labelSituacion: Record<SituacionLaboral, string> = {
    trabajador: t('workerCard'), estudiante: t('studentCard'), temporero: t('temporaryCard'),
  }
  const hoy = new Date()
  const entrada = data.fecha_entrada ? new Date(data.fecha_entrada) : null
  const esInmediata = entrada && Math.abs(entrada.getTime() - hoy.getTime()) < 7 * 24 * 60 * 60 * 1000

  const chips = [
    data.tipo_busqueda ? labelTipo[data.tipo_busqueda] : null,
    esInmediata ? t('immediateEntry') : data.fecha_entrada ? new Date(data.fecha_entrada).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : null,
    data.situacion ? labelSituacion[data.situacion as SituacionLaboral] : null,
  ].filter(Boolean)

  const caracteristicas = [
    data.fumador ? t('toggleSmoker') : t('nonSmoker2'),
    data.mascotas ? t('withPets2') : null,
    data.acompanado ? t('accompanied') : null,
  ].filter(Boolean)

  return (
    <div className="bg-white rounded-3xl border-2 border-[#1a3c5e]/10 overflow-hidden shadow-sm">
      {/* Header de la card */}
      <div className="bg-gradient-to-r from-[#1a3c5e] to-[#2d5a8e] p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white/30 shadow-md">
          <Avatar
            nombre={data.nombre || '?'}
            avatarUrl={avatarUrl}
            size="lg"
            rounded="2xl"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-lg leading-tight">
            {data.nombre || t('namePlaceholder2')}{data.edad ? `, ${data.edad} años` : ''}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {chips.map((c, i) => (
              <span key={i} className="text-[10px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="p-5 flex flex-col gap-4">
        {/* Presupuesto + zonas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#f8fafc] rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-[#0ea5a0]">{data.presupuesto_max}€</p>
            <p className="text-[10px] text-[#6b7280] font-medium mt-0.5">{t('previewBudget')}</p>
          </div>
          <div className="bg-[#f8fafc] rounded-2xl p-3 text-center">
            <p className="text-lg font-bold text-[#1a3c5e] leading-tight">
              {data.parroquias.length === 0 ? '—'
                : data.parroquias.length === 1 ? data.parroquias[0].split(' ')[0]
                : t('previewZones', { n: data.parroquias.length })}
            </p>
            <p className="text-[10px] text-[#6b7280] font-medium mt-0.5">
              {data.parroquias.length > 1 ? data.parroquias.slice(0, 2).join(', ') : t('previewZone')}
            </p>
          </div>
        </div>

        {/* Características */}
        {caracteristicas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {caracteristicas.map((c, i) => (
              <span key={i} className="text-xs bg-[#f4f5f7] text-[#374151] px-3 py-1 rounded-full font-medium">
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Descripción */}
        {data.descripcion && (
          <div className="bg-[#f8fafc] rounded-2xl p-4 border-l-4 border-[#0ea5a0]">
            <p className="text-sm text-[#374151] italic leading-relaxed">"{data.descripcion}"</p>
          </div>
        )}

        {/* Sector */}
        {data.sector && (
          <p className="text-xs text-[#6b7280]">{data.sector}</p>
        )}
      </div>
    </div>
  )
}

// ─── Loading overlay ─────────────────────────────────────────────────────────
function LoadingOverlay({ visible, title, subtitle }: { visible: boolean; title: string; subtitle: string }) {
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
          <p className="text-xl font-bold text-[#1a3c5e]">{title}</p>
          <p className="text-sm text-[#6b7280] mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function FormularioBusqueda({ avatarUrl }: { avatarUrl?: string | null }) {
  const t = useTranslations('buscar')
  const router  = useRouter()
  const [step, setStep]       = useState(0)
  const [preview, setPreview] = useState(false)
  const [data, setData]       = useState<FormState>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const topRef = useRef<HTMLDivElement>(null)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setData((prev) => ({ ...prev, [key]: value }))

  function irAlPaso(n: number) {
    setStep(n)
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function toggleParroquia(p: string) {
    setData((prev) => ({
      ...prev,
      parroquias: prev.parroquias.includes(p)
        ? prev.parroquias.filter((x) => x !== p)
        : [...prev.parroquias, p],
    }))
  }

  async function handlePublicar() {
    if (!data.tipo_busqueda || !data.situacion) return
    setLoading(true)
    setError(null)
    const res = await publicarPerfilInquilino({
      tipo_busqueda:   data.tipo_busqueda,
      parroquias:      data.parroquias,
      presupuesto_max: data.presupuesto_max,
      fecha_entrada:   data.fecha_entrada,
      fecha_salida:    data.fecha_salida || null,
      nombre:          data.nombre,
      edad:            parseInt(data.edad),
      sexo:            data.sexo,
      situacion:       data.situacion as SituacionLaboral,
      sector:          data.sector,
      fumador:         data.fumador,
      mascotas:        data.mascotas,
      acompanado:      data.acompanado,
      descripcion:     data.descripcion,
    })
    setLoading(false)
    if (res.error) setError(res.error)
    else router.push('/buscar-habitacion/publicado')
  }

  const canNext = [
    !!data.tipo_busqueda,
    data.parroquias.length > 0 && data.presupuesto_max > 0,
    !!data.fecha_entrada,
    !!data.nombre && !!data.edad && !!data.situacion,
  ][step]

  const progressLabels = [
    t('stepType'),
    t('stepZone'),
    t('stepDates'),
    t('stepAbout'),
  ]

  const STEP_META = [
    { title: t('step1Title'), subtitle: t('step1Subtitle') },
    { title: t('step2Title2'), subtitle: t('step2Subtitle') },
    { title: t('step3Title2'), subtitle: t('step3Subtitle') },
    { title: t('step4Title'), subtitle: t('step4Subtitle') },
  ]

  // ── Vista previa ─────────────────────────────────────────────────────────
  if (preview) {
    return (
      <>
        <LoadingOverlay visible={loading} title={t('publishingProfile')} subtitle={t('publishingDesc')} />
        <div className="max-w-xl mx-auto flex flex-col gap-6">
          <div>
            <button
              onClick={() => setPreview(false)}
              className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#1a3c5e] transition-colors mb-4 font-medium"
            >
              {t('editBtn')}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0ea5a0] to-[#0c8e8a] flex items-center justify-center shadow-md text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1a3c5e]">{t('previewTitle2')}</h1>
                <p className="text-xs text-[#6b7280]">{t('previewSubtitle2')}</p>
              </div>
            </div>
          </div>

          <VistaPrevia data={data} avatarUrl={avatarUrl} t={t} />

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-500 flex-shrink-0">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="font-bold text-[#1a3c5e] text-sm">{t('confirmTitle')}</p>
              <p className="text-xs text-[#6b7280] mt-0.5">
                {t('profileVisibleDesc')}
              </p>
            </div>
            <button
              onClick={handlePublicar}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#0ea5a0] to-[#0c8e8a] text-white font-bold px-8 py-4 rounded-2xl hover:from-[#0c8e8a] hover:to-[#0a7a76] transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-sm"
            >
              {t('publishBtn')}
            </button>
          </div>
        </div>
      </>
    )
  }

  // ── Form principal ────────────────────────────────────────────────────────

  return (
    <>
      <div ref={topRef} className="max-w-xl mx-auto flex flex-col gap-6">

        {/* Hero header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0ea5a0] to-[#0c8e8a] flex items-center justify-center shadow-md text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a3c5e]">{t('heroTitle2')}</h1>
              <p className="text-sm text-[#6b7280]">{t('heroSubtitle2')}</p>
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-5 py-4">
          <ProgressBar step={step} labels={progressLabels} />
        </div>

        {/* Card del paso actual */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header del paso */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#f8fafc] to-white">
            <div className="w-10 h-10 rounded-2xl bg-[#1a3c5e] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {step + 1}
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">{t('stepOf2', { n: step + 1, total: TOTAL_STEPS })}</p>
              <h2 className="font-bold text-[#1a3c5e] text-base leading-tight">{STEP_META[step].title}</h2>
              <p className="text-xs text-[#6b7280]">{STEP_META[step].subtitle}</p>
            </div>
          </div>

          <div className="p-6">

            {/* ── PASO 1: Tipo ──────────────────────────────────────── */}
            {step === 0 && (
              <div className="flex flex-col gap-3">
                {([
                  { key: 'anual',     emoji: '🏠', titulo: t('annual'),   sub: t('stayTypeAnnualDesc2'),   color: 'from-blue-50 to-indigo-50', border: 'border-blue-200' },
                  { key: 'temporero', emoji: '⛷️', titulo: t('seasonal'), sub: t('stayTypeSeasonalDesc2'), color: 'from-sky-50 to-cyan-50',    border: 'border-sky-200' },
                  { key: 'ambos',     emoji: '✅', titulo: t('both'),      sub: t('stayTypeBothDesc2'),    color: 'from-teal-50 to-emerald-50', border: 'border-teal-200' },
                ] as const).map(({ key, emoji, titulo, sub, color, border }) => {
                  const selected = data.tipo_busqueda === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => set('tipo_busqueda', key)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200
                        ${selected
                          ? `${border} bg-gradient-to-r ${color} shadow-sm`
                          : 'border-gray-100 bg-[#f8fafc] hover:border-gray-200'}`}
                    >
                      <span className={`text-3xl transition-transform duration-200 ${selected ? 'scale-110' : ''}`}>{emoji}</span>
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${selected ? 'text-[#1a3c5e]' : 'text-[#374151]'}`}>{titulo}</p>
                        <p className="text-xs text-[#6b7280] mt-0.5">{sub}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0
                        ${selected ? 'border-[#0ea5a0] bg-[#0ea5a0]' : 'border-gray-300'}`}>
                        {selected && <span className="text-white text-[10px] font-bold">✓</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* ── PASO 2: Zona + presupuesto ──────────────────────── */}
            {step === 1 && (
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-sm font-bold text-[#1a3c5e] mb-3">
                    {t('parishesLabel')}
                    <span className="text-xs font-normal text-[#9ca3af] ml-2">{t('parishesHint')}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PARROQUIAS.map((p) => {
                      const sel = data.parroquias.includes(p)
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => toggleParroquia(p)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border-2 transition-all
                            ${sel
                              ? 'border-[#0ea5a0] bg-gradient-to-r from-[#e6f7f7] to-[#f0fafa] text-[#0ea5a0] shadow-sm'
                              : 'border-gray-100 bg-[#f8fafc] text-[#374151] hover:border-gray-200'}`}
                        >
                          {sel && <span className="text-[#0ea5a0] text-xs">✓</span>}
                          {p}
                        </button>
                      )
                    })}
                  </div>
                  {data.parroquias.length > 0 && (
                    <p className="text-xs text-[#0ea5a0] font-medium mt-2">
                      {t('selectedZones', { n: data.parroquias.length })}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-[#1a3c5e] mb-3">
                    {t('budgetLabel')}
                  </p>
                  {/* Precio destacado */}
                  <div className="text-center mb-4 py-3 bg-gradient-to-r from-[#f0f4f8] to-[#f8fafc] rounded-2xl">
                    <p className="text-4xl font-bold text-[#1a3c5e]">{data.presupuesto_max}€</p>
                    <p className="text-xs text-[#6b7280] mt-0.5">{t('perMonth2')}</p>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {PRESUPUESTOS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => set('presupuesto_max', p)}
                        className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all
                          ${data.presupuesto_max === p
                            ? 'border-[#0ea5a0] bg-[#0ea5a0] text-white shadow-sm shadow-[#0ea5a0]/30'
                            : 'border-gray-100 bg-[#f8fafc] text-[#374151] hover:border-gray-200'}`}
                      >
                        {p}€
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── PASO 3: Fechas ───────────────────────────────────── */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1a3c5e] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#1a3c5e] text-white flex items-center justify-center text-xs">→</span>
                    {t('entryDateLabel')}
                  </label>
                  <input
                    type="date"
                    value={data.fecha_entrada}
                    onChange={(e) => set('fecha_entrada', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="px-4 py-3.5 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#0ea5a0] focus:bg-white transition-all font-medium"
                  />
                </div>

                {(data.tipo_busqueda === 'temporero' || data.tipo_busqueda === 'ambos') && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#1a3c5e] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#6b7280] text-white flex items-center justify-center text-xs">←</span>
                      {t('exitDateLabel')}
                      {data.tipo_busqueda === 'ambos' && <span className="text-xs font-normal text-[#9ca3af]">{t('exitOptional')}</span>}
                    </label>
                    <input
                      type="date"
                      value={data.fecha_salida}
                      onChange={(e) => set('fecha_salida', e.target.value)}
                      min={data.fecha_entrada || new Date().toISOString().split('T')[0]}
                      className="px-4 py-3.5 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#0ea5a0] focus:bg-white transition-all font-medium"
                    />
                  </div>
                )}

                {data.fecha_entrada && (
                  <div className="bg-gradient-to-r from-[#e6f7f7] to-[#f0fafa] border border-[#0ea5a0]/20 rounded-2xl p-4">
                    <p className="text-sm font-semibold text-[#0ea5a0]">
                      {t('entryConfirm', { date: new Date(data.fecha_entrada).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) })}
                    </p>
                    {data.fecha_salida && (
                      <p className="text-xs text-[#6b7280] mt-1">
                        {t('exitConfirm', { date: new Date(data.fecha_salida).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) })}
                      </p>
                    )}
                  </div>
                )}

                {data.tipo_busqueda === 'anual' && (
                  <div className="bg-[#f0f4f8] rounded-2xl p-4">
                    <p className="text-xs text-[#6b7280] leading-relaxed">
                      {t('annualOnlyEntry')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── PASO 4: Datos personales ─────────────────────────── */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#1a3c5e] ml-1">{t('nameLabel')}</label>
                    <input
                      type="text"
                      value={data.nombre}
                      onChange={(e) => set('nombre', e.target.value)}
                      placeholder={t('namePlaceholder2')}
                      className="px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#1a3c5e] ml-1">{t('ageLabel')}</label>
                    <input
                      type="number"
                      value={data.edad}
                      onChange={(e) => set('edad', e.target.value)}
                      placeholder="23"
                      min={16}
                      max={99}
                      className="px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Sexo */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#1a3c5e] ml-1">{t('sexoLabel')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { key: 'hombre',  label: t('sexoHombre') },
                      { key: 'mujer',   label: t('sexoMujer') },
                      { key: 'no_dice', label: t('sexoNoDice') },
                    ] as const).map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => set('sexo', key)}
                        className={`flex items-center justify-center py-3 px-2 rounded-2xl border-2 transition-all text-center
                          ${data.sexo === key
                            ? 'border-[#1a3c5e] bg-[#f0f4f8]'
                            : 'border-gray-100 bg-[#f8fafc] hover:border-gray-200'}`}
                      >
                        <span className={`text-[11px] font-bold leading-tight ${data.sexo === key ? 'text-[#1a3c5e]' : 'text-[#374151]'}`}>
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Situación laboral */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#1a3c5e] ml-1">{t('situationLabel')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { key: 'trabajador', icon: '💼', label: t('workerCard') },
                      { key: 'estudiante', icon: '🎓', label: t('studentCard') },
                      { key: 'temporero',  icon: '⛷️', label: t('temporaryCard') },
                    ] as const).map(({ key, icon, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => set('situacion', key)}
                        className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all text-center
                          ${data.situacion === key
                            ? 'border-[#1a3c5e] bg-[#f0f4f8]'
                            : 'border-gray-100 bg-[#f8fafc] hover:border-gray-200'}`}
                      >
                        <span className="text-xl">{icon}</span>
                        <span className={`text-[11px] font-bold leading-tight ${data.situacion === key ? 'text-[#1a3c5e]' : 'text-[#374151]'}`}>
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1a3c5e] ml-1">
                    {t('sectorLabel')}
                    <span className="text-[#9ca3af] font-normal ml-1">{t('sectorOptional')}</span>
                  </label>
                  <input
                    type="text"
                    value={data.sector}
                    onChange={(e) => set('sector', e.target.value)}
                    placeholder={t('sectorPlaceholder')}
                    className="px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                  />
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-2">
                  <Toggle checked={data.fumador}    onChange={(v) => set('fumador', v)}    label={t('toggleSmoker')} />
                  <Toggle checked={data.mascotas}   onChange={(v) => set('mascotas', v)}   label={t('togglePets2')} />
                  <Toggle checked={data.acompanado} onChange={(v) => set('acompanado', v)} label={t('toggleAccompanied')} />
                </div>

                {/* Descripción libre */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1a3c5e] ml-1">
                    {t('bioLabel')}
                    <span className="text-[#9ca3af] font-normal ml-1">{t('bioOptional')}</span>
                  </label>
                  <textarea
                    value={data.descripcion}
                    onChange={(e) => set('descripcion', e.target.value)}
                    placeholder={t('bioPlaceholder')}
                    rows={4}
                    className="px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none resize-none focus:border-[#1a3c5e] focus:bg-white transition-all"
                  />
                  {data.descripcion.length > 0 && (
                    <p className="text-[10px] text-[#9ca3af] text-right mr-1">{t('charCount', { n: data.descripcion.length })}</p>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Navegación */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => irAlPaso(step - 1)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-[#374151] hover:border-gray-300 bg-white transition-all"
            >
              {t('backBtn')}
            </button>
          )}

          {step < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={() => irAlPaso(step + 1)}
              disabled={!canNext}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#1a3c5e] to-[#1e4a72] text-white font-bold text-sm hover:from-[#152e4a] transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              {t('continueBtn')}
              <span>→</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPreview(true)}
              disabled={!canNext}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#0ea5a0] to-[#0c8e8a] text-white font-bold text-sm hover:from-[#0c8e8a] transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              {t('viewProfileBtn')}
            </button>
          )}
        </div>

        {/* Indicador de progreso textual */}
        {!canNext && (
          <p className="text-xs text-center text-[#9ca3af]">
            {[
              t('blockStep1'),
              t('blockStep2'),
              t('blockStep3'),
              t('blockStep4'),
            ][step]}
          </p>
        )}

      </div>
    </>
  )
}

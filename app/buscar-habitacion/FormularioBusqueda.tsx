'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/ui/Spinner'
import { publicarPerfilInquilino } from '@/app/actions/perfiles-inquilino'
import type { TipoBusqueda, SituacionLaboral } from '@/types'

const PARROQUIAS = [
  'Andorra la Vella',
  'Escaldes-Engordany',
  'Encamp',
  'Canillo',
  'Ordino',
  'La Massana',
  'Sant Julià de Lòria',
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
  situacion: SituacionLaboral | ''
  sector: string
  fumador: boolean
  mascotas: boolean
  acompanado: boolean
  descripcion: string
}

const INITIAL: FormState = {
  tipo_busqueda: null,
  parroquias: [],
  presupuesto_max: 700,
  fecha_entrada: '',
  fecha_salida: '',
  nombre: '',
  edad: '',
  situacion: '',
  sector: '',
  fumador: false,
  mascotas: false,
  acompanado: false,
  descripcion: '',
}

const TOTAL_STEPS = 4

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`h-1.5 w-full rounded-full transition-all duration-300 ${
              i < step ? 'bg-[#0ea5a0]' : i === step ? 'bg-[#1a3c5e]' : 'bg-gray-200'
            }`}
          />
        </div>
      ))}
      <span className="text-xs text-[#9ca3af] whitespace-nowrap ml-1">
        {step + 1}/{TOTAL_STEPS}
      </span>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-colors ${
        checked
          ? 'border-[#0ea5a0] bg-[#e6f7f7]'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <span className="text-sm font-medium text-[#374151]">{label}</span>
      <div
        className={`w-11 h-6 rounded-full transition-colors relative ${
          checked ? 'bg-[#0ea5a0]' : 'bg-gray-200'
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5.5 left-0.5' : 'left-0.5'
          }`}
        />
      </div>
    </button>
  )
}

// ─── Vista previa del anuncio ────────────────────────────────────────────────
function VistaPrevia({ data }: { data: FormState }) {
  const labelTipo: Record<TipoBusqueda, string> = {
    anual: 'Todo el año',
    temporero: 'Temporada',
    ambos: 'Flexible',
  }
  const labelSituacion: Record<SituacionLaboral, string> = {
    trabajador: 'Trabajador/a',
    estudiante: 'Estudiante',
    temporero: 'Temporero/a',
  }
  const hoy = new Date()
  const entrada = data.fecha_entrada ? new Date(data.fecha_entrada) : null
  const esInmediata =
    entrada &&
    Math.abs(entrada.getTime() - hoy.getTime()) < 7 * 24 * 60 * 60 * 1000

  const etiquetas = [
    data.tipo_busqueda ? labelTipo[data.tipo_busqueda] : null,
    esInmediata ? 'Entrada inmediata' : data.fecha_entrada ? `Entrada ${data.fecha_entrada}` : null,
    data.situacion ? labelSituacion[data.situacion as SituacionLaboral] : null,
  ].filter(Boolean)

  const caracteristicas = [
    data.fumador ? 'Fumador' : 'No fumador',
    data.mascotas ? 'Con mascotas' : null,
    data.acompanado ? 'Viene acompañado' : 'Viene solo',
  ].filter(Boolean)

  return (
    <div className="bg-white border-2 border-[#1a3c5e]/10 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-[#1a3c5e] text-lg">
            {data.nombre || 'Tu nombre'}{data.edad ? `, ${data.edad} años` : ''}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {etiquetas.map((e) => (
              <span key={e} className="text-[10px] font-bold bg-[#e6f7f7] text-[#0ea5a0] px-2 py-0.5 rounded-full uppercase">
                {e}
              </span>
            ))}
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#1a3c5e] flex items-center justify-center text-white font-bold text-lg shrink-0">
          {(data.nombre || 'T').charAt(0).toUpperCase()}
        </div>
      </div>

      {data.parroquias.length > 0 && (
        <p className="text-sm text-[#374151]">
          Busca habitación en{' '}
          <strong>{data.parroquias.slice(0, 2).join(' o ')}{data.parroquias.length > 2 ? ` +${data.parroquias.length - 2}` : ''}</strong>
        </p>
      )}

      <p className="text-base font-bold text-[#0ea5a0]">
        Hasta {data.presupuesto_max}€/mes
      </p>

      {caracteristicas.length > 0 && (
        <p className="text-xs text-[#6b7280]">
          {caracteristicas.join(' · ')}
        </p>
      )}

      {data.descripcion && (
        <p className="text-sm text-[#374151] italic border-t border-gray-100 pt-3">
          "{data.descripcion}"
        </p>
      )}
    </div>
  )
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function FormularioBusqueda() {
  const router = useRouter()
  const [step, setStep]       = useState(0)
  const [preview, setPreview] = useState(false)
  const [data, setData]       = useState<FormState>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setData((prev) => ({ ...prev, [key]: value }))

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
      tipo_busqueda:  data.tipo_busqueda,
      parroquias:     data.parroquias,
      presupuesto_max: data.presupuesto_max,
      fecha_entrada:  data.fecha_entrada,
      fecha_salida:   data.fecha_salida || null,
      nombre:         data.nombre,
      edad:           parseInt(data.edad),
      situacion:      data.situacion as SituacionLaboral,
      sector:         data.sector,
      fumador:        data.fumador,
      mascotas:       data.mascotas,
      acompanado:     data.acompanado,
      descripcion:    data.descripcion,
    })

    setLoading(false)
    if (res.error) {
      setError(res.error)
    } else {
      router.push('/buscar-habitacion/publicado')
    }
  }

  // ── Validación por paso ──────────────────────────────────────────────────
  const canNext = [
    !!data.tipo_busqueda,
    data.parroquias.length > 0 && data.presupuesto_max > 0,
    !!data.fecha_entrada,
    !!data.nombre && !!data.edad && !!data.situacion,
  ][step]

  const STEP_TITLES = [
    '¿Qué tipo de habitación buscas?',
    '¿Dónde la buscas y cuál es tu presupuesto?',
    '¿En qué fecha quieres mudarte?',
    'Cuéntanos sobre ti',
  ]

  // ── Vista previa ─────────────────────────────────────────────────────────
  if (preview) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <button
            onClick={() => setPreview(false)}
            className="text-sm text-[#6b7280] hover:text-[#1a3c5e] transition-colors mb-4 flex items-center gap-1"
          >
            ← Editar
          </button>
          <h1 className="text-2xl font-bold text-[#1a3c5e]">Vista previa</h1>
          <p className="text-[#6b7280] text-sm mt-1">Así verán tu perfil los propietarios.</p>
        </div>

        <VistaPrevia data={data} />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
        )}

        <button
          onClick={handlePublicar}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-[#1a3c5e] text-white font-bold text-base hover:bg-[#0ea5a0] transition-colors disabled:opacity-60"
        >
          {loading ? <><Spinner size="sm" color="white" /> Publicando…</> : 'Publicar perfil'}
        </button>

        <p className="text-xs text-center text-[#9ca3af]">
          Tu perfil será visible para propietarios con habitaciones disponibles.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-[#1a3c5e]">Encuéntrame habitación</h1>
        <p className="text-[#6b7280] text-sm mt-1">
          Cuéntanos qué buscas y deja que propietarios te contacten.
        </p>
      </div>

      <ProgressBar step={step} />

      <h2 className="text-lg font-bold text-[#1a3c5e] mb-4">{STEP_TITLES[step]}</h2>

      {/* ── PASO 1: Tipo ─────────────────────────────────────────────── */}
      {step === 0 && (
        <div className="flex flex-col gap-3">
          {([
            { key: 'anual',     emoji: '📅', titulo: 'Todo el año',  sub: 'Residencia estable en Andorra' },
            { key: 'temporero', emoji: '⛷️', titulo: 'Temporada',    sub: 'Trabajo o estancia de temporada' },
            { key: 'ambos',     emoji: '🔄', titulo: 'Me adapto',     sub: 'Flexible, acepto ambas opciones' },
          ] as const).map(({ key, emoji, titulo, sub }) => (
            <button
              key={key}
              type="button"
              onClick={() => set('tipo_busqueda', key)}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                data.tipo_busqueda === key
                  ? 'border-[#0ea5a0] bg-[#e6f7f7]'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className="text-3xl">{emoji}</span>
              <div>
                <p className="font-bold text-[#1a3c5e]">{titulo}</p>
                <p className="text-xs text-[#6b7280] mt-0.5">{sub}</p>
              </div>
              {data.tipo_busqueda === key && (
                <span className="ml-auto text-[#0ea5a0] text-xl">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── PASO 2: Ubicación + presupuesto ──────────────────────────── */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-semibold text-[#374151] mb-2">
              Parroquias de interés <span className="text-[#9ca3af] font-normal">(puedes elegir varias)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {PARROQUIAS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleParroquia(p)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                    data.parroquias.includes(p)
                      ? 'border-[#0ea5a0] bg-[#e6f7f7] text-[#0ea5a0]'
                      : 'border-gray-200 text-[#374151] hover:border-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#374151] mb-2">Presupuesto máximo</p>
            <div className="grid grid-cols-3 gap-2">
              {PRESUPUESTOS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set('presupuesto_max', p)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    data.presupuesto_max === p
                      ? 'border-[#0ea5a0] bg-[#e6f7f7] text-[#0ea5a0]'
                      : 'border-gray-200 text-[#374151] hover:border-gray-300'
                  }`}
                >
                  {p}€
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PASO 3: Fechas ───────────────────────────────────────────── */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#374151]">Fecha de entrada</label>
            <input
              type="date"
              value={data.fecha_entrada}
              onChange={(e) => set('fecha_entrada', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0ea5a0] bg-white"
            />
          </div>

          {(data.tipo_busqueda === 'temporero' || data.tipo_busqueda === 'ambos') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#374151]">
                {data.tipo_busqueda === 'temporero' ? 'Fecha de salida' : 'Fecha aproximada de salida'}
                {data.tipo_busqueda === 'ambos' && (
                  <span className="text-[#9ca3af] font-normal"> (opcional)</span>
                )}
              </label>
              <input
                type="date"
                value={data.fecha_salida}
                onChange={(e) => set('fecha_salida', e.target.value)}
                min={data.fecha_entrada || new Date().toISOString().split('T')[0]}
                className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0ea5a0] bg-white"
              />
            </div>
          )}

          {data.tipo_busqueda === 'anual' && (
            <p className="text-xs text-[#6b7280] bg-[#f4f5f7] rounded-xl px-4 py-3">
              💡 Para estancias de todo el año solo necesitamos la fecha de entrada.
            </p>
          )}
        </div>
      )}

      {/* ── PASO 4: Datos personales ──────────────────────────────────── */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#374151]">Nombre</label>
              <input
                type="text"
                value={data.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                placeholder="Tu nombre"
                className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0ea5a0]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#374151]">Edad</label>
              <input
                type="number"
                value={data.edad}
                onChange={(e) => set('edad', e.target.value)}
                placeholder="23"
                min={16}
                max={99}
                className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0ea5a0]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#374151]">Situación</label>
            <div className="flex gap-2">
              {([
                { key: 'trabajador', label: '💼 Trabajador/a' },
                { key: 'estudiante', label: '🎓 Estudiante' },
                { key: 'temporero',  label: '⛷️ Temporero/a' },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set('situacion', key)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    data.situacion === key
                      ? 'border-[#0ea5a0] bg-[#e6f7f7] text-[#0ea5a0]'
                      : 'border-gray-200 text-[#374151] hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#374151]">
              Sector / campo profesional <span className="text-[#9ca3af] font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={data.sector}
              onChange={(e) => set('sector', e.target.value)}
              placeholder="Ej: Banca, hostelería, retail…"
              className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0ea5a0]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Toggle
              checked={data.fumador}
              onChange={(v) => set('fumador', v)}
              label="🚬 Fumador/a"
            />
            <Toggle
              checked={data.mascotas}
              onChange={(v) => set('mascotas', v)}
              label="🐾 Tengo mascotas"
            />
            <Toggle
              checked={data.acompanado}
              onChange={(v) => set('acompanado', v)}
              label="👫 Vengo acompañado/a"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#374151]">
              Preséntate <span className="text-[#9ca3af] font-normal">(opcional pero recomendado)</span>
            </label>
            <textarea
              value={data.descripcion}
              onChange={(e) => set('descripcion', e.target.value)}
              placeholder="Cuéntanos quién eres, cómo eres como inquilino/a, qué horarios tienes…"
              rows={4}
              className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0ea5a0] resize-none"
            />
          </div>
        </div>
      )}

      {/* ── Navegación ───────────────────────────────────────────────── */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-[#374151] hover:border-gray-300 transition-colors"
          >
            ← Atrás
          </button>
        )}

        {step < TOTAL_STEPS - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext}
            className="flex-1 py-3 rounded-xl bg-[#1a3c5e] text-white font-semibold text-sm hover:bg-[#0ea5a0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continuar →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setPreview(true)}
            disabled={!canNext}
            className="flex-1 py-3 rounded-xl bg-[#1a3c5e] text-white font-semibold text-sm hover:bg-[#0ea5a0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Ver vista previa →
          </button>
        )}
      </div>
    </div>
  )
}

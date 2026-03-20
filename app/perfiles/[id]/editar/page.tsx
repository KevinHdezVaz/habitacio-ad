'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase-browser'
import type { TipoBusqueda, SituacionLaboral, SexoPerfil } from '@/types'

const PARROQUIAS = [
  'Andorra la Vella',
  'Escaldes-Engordany',
  'Encamp',
  'La Massana',
  'Ordino',
  'Canillo',
  'Sant Julià de Lòria',
]

const PRESUPUESTOS = [300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500]

type FormState = {
  tipo_busqueda: TipoBusqueda
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

// ── Toggle ─────────────────────────────────────────────────────────────────
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
    <label
      className={`flex items-center justify-between w-full px-4 py-3.5 rounded-2xl border-2 transition-all cursor-pointer
        ${checked
          ? 'border-[#0ea5a0] bg-gradient-to-r from-[#e6f7f7] to-[#f0fafa]'
          : 'border-gray-100 bg-[#f8fafc] hover:border-gray-200'}`}
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
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200
            ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </label>
  )
}

// ── Section title separator ────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-sm font-bold text-[#1a3c5e]">{children}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}

export default function EditarPerfilInquilinoPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('editarPerfil')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guardado, setGuardado] = useState(false)

  const [form, setForm] = useState<FormState>({
    tipo_busqueda: 'anual',
    parroquias: [],
    presupuesto_max: 700,
    fecha_entrada: '',
    fecha_salida: '',
    nombre: '',
    edad: '',
    sexo: null,
    situacion: '',
    sector: '',
    fumador: false,
    mascotas: false,
    acompanado: false,
    descripcion: '',
  })

  useEffect(() => {
    async function fetchPerfil() {
      const [{ data: perfil }, { data: authData }] = await Promise.all([
        supabase.from('perfiles_inquilino').select('*').eq('id', id).single(),
        supabase.auth.getUser(),
      ])

      if (!perfil) {
        router.push('/perfiles')
        return
      }

      const user = authData?.user
      if (!user || perfil.user_id !== user.id) {
        router.push(`/perfiles/${id}`)
        return
      }

      setForm({
        tipo_busqueda: perfil.tipo_busqueda ?? 'anual',
        parroquias: perfil.parroquias ?? [],
        presupuesto_max: perfil.presupuesto_max ?? 700,
        fecha_entrada: perfil.fecha_entrada ?? '',
        fecha_salida: perfil.fecha_salida ?? '',
        nombre: perfil.nombre ?? '',
        edad: perfil.edad != null ? String(perfil.edad) : '',
        sexo: perfil.sexo ?? null,
        situacion: perfil.situacion ?? '',
        sector: perfil.sector ?? '',
        fumador: perfil.fumador ?? false,
        mascotas: perfil.mascotas ?? false,
        acompanado: perfil.acompanado ?? false,
        descripcion: perfil.descripcion ?? '',
      })

      setLoading(false)
    }

    fetchPerfil()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleParroquia(p: string) {
    setForm((prev) => ({
      ...prev,
      parroquias: prev.parroquias.includes(p)
        ? prev.parroquias.filter((x) => x !== p)
        : [...prev.parroquias, p],
    }))
  }

  async function handleSave() {
    if (!form.tipo_busqueda || !form.situacion || !form.nombre || !form.edad) {
      setError(t('requiredError'))
      return
    }
    setSaving(true)
    setError(null)

    const { error: updateError } = await supabase
      .from('perfiles_inquilino')
      .update({
        tipo_busqueda: form.tipo_busqueda,
        parroquias: form.parroquias,
        presupuesto_max: form.presupuesto_max,
        fecha_entrada: form.fecha_entrada || null,
        fecha_salida: form.fecha_salida || null,
        nombre: form.nombre,
        edad: parseInt(form.edad),
        sexo: form.sexo,
        situacion: form.situacion as SituacionLaboral,
        sector: form.sector,
        fumador: form.fumador,
        mascotas: form.mascotas,
        acompanado: form.acompanado,
        descripcion: form.descripcion,
      })
      .eq('id', id)

    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setGuardado(true)
    setTimeout(() => router.push(`/perfiles/${id}`), 1200)
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-[#e8edf2]" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1a3c5e] animate-spin" />
        </div>
        <p className="text-sm text-[#6b7280] font-medium">{t('loading')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/perfiles/${id}`}
          className="w-10 h-10 rounded-2xl bg-[#f4f5f7] hover:bg-gray-200 flex items-center justify-center text-[#374151] transition-colors flex-shrink-0 text-lg"
        >
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1a3c5e]">{t('title')}</h1>
          <p className="text-sm text-[#6b7280]">{t('subtitle')}</p>
        </div>
      </div>

      {/* Feedback guardado */}
      {guardado && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-600 flex-shrink-0">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <p className="text-sm font-semibold text-emerald-700">{t('saved')}</p>
        </div>
      )}

      {/* Formulario */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">

        {/* Tipo de búsqueda */}
        <SectionTitle>{t('searchType')}</SectionTitle>
        <div className="flex flex-col gap-2">
          {([
            { key: 'anual',     label: t('annual'),   sub: t('annualSub') },
            { key: 'temporero', label: t('seasonal'),  sub: t('seasonalSub') },
            { key: 'ambos',     label: t('flexible'),  sub: t('flexibleSub') },
          ] as const).map(({ key, label, sub }) => {
            const selected = form.tipo_busqueda === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => set('tipo_busqueda', key)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200
                  ${selected
                    ? 'border-[#0ea5a0] bg-gradient-to-r from-[#e6f7f7] to-[#f0fafa] shadow-sm'
                    : 'border-gray-100 bg-[#f8fafc] hover:border-gray-200'}`}
              >
                <div className="flex-1">
                  <p className={`font-bold text-sm ${selected ? 'text-[#1a3c5e]' : 'text-[#374151]'}`}>{label}</p>
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

        {/* Parroquias */}
        <SectionTitle>{t('parishes')}</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {PARROQUIAS.map((p) => {
            const sel = form.parroquias.includes(p)
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
        {form.parroquias.length > 0 && (
          <p className="text-xs text-[#0ea5a0] font-medium -mt-2">
            {form.parroquias.length === 1
              ? t('zonesSelected', { n: 1 })
              : t('zonesSelectedPlural', { n: form.parroquias.length })}
          </p>
        )}

        {/* Presupuesto */}
        <SectionTitle>{t('budget')}</SectionTitle>
        <div className="text-center py-3 bg-gradient-to-r from-[#f0f4f8] to-[#f8fafc] rounded-2xl">
          <p className="text-4xl font-bold text-[#1a3c5e]">{form.presupuesto_max}€</p>
          <p className="text-xs text-[#6b7280] mt-0.5">{t('perMonth')}</p>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {PRESUPUESTOS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => set('presupuesto_max', p)}
              className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all
                ${form.presupuesto_max === p
                  ? 'border-[#0ea5a0] bg-[#0ea5a0] text-white shadow-sm shadow-[#0ea5a0]/30'
                  : 'border-gray-100 bg-[#f8fafc] text-[#374151] hover:border-gray-200'}`}
            >
              {p}€
            </button>
          ))}
        </div>

        {/* Fechas */}
        <SectionTitle>{t('dates')}</SectionTitle>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#1a3c5e] ml-1">{t('availableFrom')}</label>
            <input
              type="date"
              value={form.fecha_entrada}
              onChange={(e) => set('fecha_entrada', e.target.value)}
              className="px-4 py-3.5 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#0ea5a0] focus:bg-white transition-all font-medium"
            />
          </div>

          {(form.tipo_busqueda === 'temporero' || form.tipo_busqueda === 'ambos') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1a3c5e] ml-1">
                {t('exitDate')}
                {form.tipo_busqueda === 'ambos' && (
                  <span className="text-[#9ca3af] font-normal ml-1">{t('optional')}</span>
                )}
              </label>
              <input
                type="date"
                value={form.fecha_salida}
                onChange={(e) => set('fecha_salida', e.target.value)}
                min={form.fecha_entrada || new Date().toISOString().split('T')[0]}
                className="px-4 py-3.5 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#0ea5a0] focus:bg-white transition-all font-medium"
              />
            </div>
          )}
        </div>

        {/* Sobre ti */}
        <SectionTitle>{t('aboutYou')}</SectionTitle>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#1a3c5e] ml-1">{t('nameLabel')}</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              placeholder={t('namePlaceholder')}
              className="px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#1a3c5e] ml-1">{t('ageLabel')}</label>
            <input
              type="number"
              value={form.edad}
              onChange={(e) => set('edad', e.target.value)}
              placeholder="25"
              min={16}
              max={99}
              className="px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Sexo */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#1a3c5e] ml-1">{t('gender')}</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: 'hombre',  label: t('male') },
              { key: 'mujer',   label: t('female') },
              { key: 'no_dice', label: t('noSay') },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => set('sexo', key)}
                className={`flex items-center justify-center py-3 px-2 rounded-2xl border-2 transition-all text-center
                  ${form.sexo === key
                    ? 'border-[#1a3c5e] bg-[#f0f4f8]'
                    : 'border-gray-100 bg-[#f8fafc] hover:border-gray-200'}`}
              >
                <span className={`text-[11px] font-bold leading-tight ${form.sexo === key ? 'text-[#1a3c5e]' : 'text-[#374151]'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Situación laboral */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#1a3c5e] ml-1">{t('jobSituation')}</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: 'trabajador', icon: '💼', label: t('worker') },
              { key: 'estudiante', icon: '🎓', label: t('student') },
              { key: 'temporero',  icon: '⛷️', label: t('temporary') },
            ] as const).map(({ key, icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => set('situacion', key)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all text-center
                  ${form.situacion === key
                    ? 'border-[#1a3c5e] bg-[#f0f4f8]'
                    : 'border-gray-100 bg-[#f8fafc] hover:border-gray-200'}`}
              >
                <span className="text-xl">{icon}</span>
                <span className={`text-[11px] font-bold leading-tight ${form.situacion === key ? 'text-[#1a3c5e]' : 'text-[#374151]'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#1a3c5e] ml-1">
            {t('sector')}
            <span className="text-[#9ca3af] font-normal ml-1">{t('optional')}</span>
          </label>
          <input
            type="text"
            value={form.sector}
            onChange={(e) => set('sector', e.target.value)}
            placeholder={t('sectorPlaceholder')}
            className="px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
          />
        </div>

        {/* Preferencias */}
        <SectionTitle>{t('preferences')}</SectionTitle>

        <div className="flex flex-col gap-2">
          <Toggle checked={form.fumador}    onChange={(v) => set('fumador', v)}    label={t('smoker')} />
          <Toggle checked={form.mascotas}   onChange={(v) => set('mascotas', v)}   label={t('pets')} />
          <Toggle checked={form.acompanado} onChange={(v) => set('acompanado', v)} label={t('accompanied')} />
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#1a3c5e] ml-1">
            {t('aboutMe')}
            <span className="text-[#9ca3af] font-normal ml-1">{t('optional')}</span>
          </label>
          <textarea
            value={form.descripcion}
            onChange={(e) => set('descripcion', e.target.value)}
            placeholder={t('aboutMePlaceholder')}
            rows={4}
            className="px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none resize-none focus:border-[#1a3c5e] focus:bg-white transition-all"
          />
          {form.descripcion.length > 0 && (
            <p className="text-[10px] text-[#9ca3af] text-right mr-1">{t('chars', { n: form.descripcion.length })}</p>
          )}
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-500 flex-shrink-0">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Botón guardar */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || guardado}
        className="w-full flex items-center justify-center gap-2 bg-[#1a3c5e] text-white font-bold py-4 rounded-2xl hover:bg-[#0ea5a0] transition-colors shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none text-sm"
      >
        {saving ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
            {t('saving')}
          </>
        ) : (
          t('save')
        )}
      </button>

    </div>
  )
}

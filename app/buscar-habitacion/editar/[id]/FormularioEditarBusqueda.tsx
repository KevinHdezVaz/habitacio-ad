'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { actualizarPerfilInquilino } from '@/app/actions/perfiles-inquilino'
import type { PerfilInquilino } from '@/types'

const PARROQUIAS = [
  'Andorra la Vella', 'Escaldes-Engordany', 'Encamp',
  'Canillo', 'Ordino', 'La Massana', 'Sant Julià de Lòria',
]
const PRESUPUESTOS = [300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500]

function Toggle({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 text-sm font-semibold transition-all ${
        checked ? 'border-[#1a3c5e] bg-[#eef2f8] text-[#1a3c5e]' : 'border-gray-100 bg-[#f8fafc] text-[#6b7280]'
      }`}
    >
      <span>{label}</span>
      <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-[#0ea5a0]' : 'bg-gray-200'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </button>
  )
}

export default function FormularioEditarBusqueda({ perfil }: { perfil: PerfilInquilino }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    nombre: perfil.nombre ?? '',
    edad: perfil.edad?.toString() ?? '',
    sexo: perfil.sexo ?? '',
    tipo_busqueda: perfil.tipo_busqueda ?? 'anual',
    parroquias: perfil.parroquias ?? [],
    presupuesto_max: perfil.presupuesto_max ?? 700,
    fecha_entrada: perfil.fecha_entrada?.split('T')[0] ?? '',
    fecha_salida: perfil.fecha_salida?.split('T')[0] ?? '',
    situacion: perfil.situacion ?? '',
    sector: perfil.sector ?? '',
    fumador: perfil.fumador ?? false,
    mascotas: perfil.mascotas ?? false,
    acompanado: perfil.acompanado ?? false,
    descripcion: perfil.descripcion ?? '',
  })

  function set(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleParroquia(p: string) {
    set('parroquias', form.parroquias.includes(p)
      ? form.parroquias.filter(x => x !== p)
      : [...form.parroquias, p])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await actualizarPerfilInquilino(perfil.id, {
      nombre: form.nombre,
      edad: Number(form.edad),
      sexo: (form.sexo as 'hombre' | 'mujer' | 'no_dice') || null,
      tipo_busqueda: form.tipo_busqueda as 'anual' | 'temporero' | 'ambos',
      parroquias: form.parroquias,
      presupuesto_max: form.presupuesto_max,
      fecha_entrada: form.fecha_entrada,
      fecha_salida: form.fecha_salida || null,
      situacion: form.situacion as 'trabajador' | 'estudiante' | 'temporero',
      sector: form.sector,
      fumador: form.fumador,
      mascotas: form.mascotas,
      acompanado: form.acompanado,
      descripcion: form.descripcion,
    })
    setLoading(false)
    if (res?.error) { setError(res.error); return }
    setExito(true)
    setTimeout(() => router.push('/perfil'), 1200)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => router.back()} className="p-2 rounded-xl bg-[#f4f5f7] text-[#1a3c5e]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1a3c5e]">Editar perfil de búsqueda</h1>
          <p className="text-xs text-[#9ca3af]">Los cambios se aplican inmediatamente</p>
        </div>
      </div>

      {/* Nombre y edad */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
        <h2 className="font-bold text-[#1a3c5e]">Datos personales</h2>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wide">Nombre</label>
          <input value={form.nombre} onChange={e => set('nombre', e.target.value)} required
            className="w-full px-4 py-3 rounded-xl bg-[#f4f5f7] text-sm focus:bg-white focus:ring-2 focus:ring-[#0ea5a0]/30 focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wide">Edad</label>
            <input type="number" min={18} max={99} value={form.edad} onChange={e => set('edad', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f4f5f7] text-sm focus:bg-white focus:ring-2 focus:ring-[#0ea5a0]/30 focus:outline-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wide">Sexo</label>
            <select value={form.sexo} onChange={e => set('sexo', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f4f5f7] text-sm focus:bg-white focus:ring-2 focus:ring-[#0ea5a0]/30 focus:outline-none">
              <option value="">No indicar</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
              <option value="no_dice">Prefiero no decirlo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tipo de búsqueda */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
        <h2 className="font-bold text-[#1a3c5e]">Tipo de estancia</h2>
        <div className="grid grid-cols-3 gap-2">
          {[{ v: 'anual', l: 'Todo el año' }, { v: 'temporero', l: 'Temporada' }, { v: 'ambos', l: 'Flexible' }].map(op => (
            <button key={op.v} type="button" onClick={() => set('tipo_busqueda', op.v)}
              className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                form.tipo_busqueda === op.v ? 'border-[#1a3c5e] bg-[#eef2f8] text-[#1a3c5e]' : 'border-gray-100 bg-[#f8fafc] text-[#6b7280]'
              }`}>
              {op.l}
            </button>
          ))}
        </div>
      </div>

      {/* Parroquias */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
        <h2 className="font-bold text-[#1a3c5e]">Parroquias de interés</h2>
        <div className="flex flex-wrap gap-2">
          {PARROQUIAS.map(p => (
            <button key={p} type="button" onClick={() => toggleParroquia(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                form.parroquias.includes(p) ? 'border-[#1a3c5e] bg-[#eef2f8] text-[#1a3c5e]' : 'border-gray-100 bg-[#f8fafc] text-[#6b7280]'
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Presupuesto y fechas */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
        <h2 className="font-bold text-[#1a3c5e]">Presupuesto y fechas</h2>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wide">Presupuesto máximo</label>
          <select value={form.presupuesto_max} onChange={e => set('presupuesto_max', Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl bg-[#f4f5f7] text-sm focus:bg-white focus:ring-2 focus:ring-[#0ea5a0]/30 focus:outline-none">
            {PRESUPUESTOS.map(p => <option key={p} value={p}>{p}€/mes</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wide">Disponible desde</label>
            <input type="date" value={form.fecha_entrada} onChange={e => set('fecha_entrada', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f4f5f7] text-sm focus:bg-white focus:ring-2 focus:ring-[#0ea5a0]/30 focus:outline-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wide">Hasta (opcional)</label>
            <input type="date" value={form.fecha_salida} onChange={e => set('fecha_salida', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f4f5f7] text-sm focus:bg-white focus:ring-2 focus:ring-[#0ea5a0]/30 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Situación y sector */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
        <h2 className="font-bold text-[#1a3c5e]">Situación laboral</h2>
        <div className="grid grid-cols-3 gap-2">
          {[{ v: 'trabajador', l: '💼 Trabajador/a' }, { v: 'estudiante', l: '🎓 Estudiante' }, { v: 'temporero', l: '⛷️ Temporero/a' }].map(op => (
            <button key={op.v} type="button" onClick={() => set('situacion', op.v)}
              className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                form.situacion === op.v ? 'border-[#1a3c5e] bg-[#eef2f8] text-[#1a3c5e]' : 'border-gray-100 bg-[#f8fafc] text-[#6b7280]'
              }`}>
              {op.l}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wide">Sector (opcional)</label>
          <input value={form.sector} onChange={e => set('sector', e.target.value)} placeholder="Ej: Hostelería, banca, esquí…"
            className="w-full px-4 py-3 rounded-xl bg-[#f4f5f7] text-sm focus:bg-white focus:ring-2 focus:ring-[#0ea5a0]/30 focus:outline-none" />
        </div>
      </div>

      {/* Preferencias */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
        <h2 className="font-bold text-[#1a3c5e]">Preferencias</h2>
        <Toggle checked={form.fumador} onToggle={() => set('fumador', !form.fumador)} label="Fumador/a" />
        <Toggle checked={form.mascotas} onToggle={() => set('mascotas', !form.mascotas)} label="Tengo mascotas" />
        <Toggle checked={form.acompanado} onToggle={() => set('acompanado', !form.acompanado)} label="Vengo acompañado/a" />
      </div>

      {/* Descripción */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
        <h2 className="font-bold text-[#1a3c5e]">Preséntate</h2>
        <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)}
          placeholder="Cuéntanos sobre ti, qué buscas, tu trabajo…" rows={4}
          className="w-full px-4 py-3 rounded-xl bg-[#f4f5f7] text-sm focus:bg-white focus:ring-2 focus:ring-[#0ea5a0]/30 focus:outline-none resize-none" />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>}
      {exito && <p className="text-sm text-emerald-700 bg-emerald-50 px-4 py-3 rounded-xl">✓ Perfil actualizado correctamente.</p>}

      <button type="submit" disabled={loading}
        className="w-full py-4 rounded-2xl bg-[#1a3c5e] text-white font-bold text-base hover:bg-[#0ea5a0] transition-colors disabled:opacity-50">
        {loading ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </form>
  )
}

import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import type { PerfilInquilino } from '@/types'

const labelTipo: Record<string, string> = {
  anual:     'Todo el año',
  temporero: 'Temporada',
  ambos:     'Flexible',
}
const labelSituacion: Record<string, string> = {
  trabajador: 'Trabajador/a',
  estudiante: 'Estudiante',
  temporero:  'Temporero/a',
}

const COLORS = [
  'bg-[#1a3c5e]', 'bg-[#0ea5a0]', 'bg-purple-600',
  'bg-rose-500',  'bg-amber-500',  'bg-emerald-600',
]

function Iniciales({ nombre }: { nombre: string }) {
  const ini = nombre.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  const idx = nombre.charCodeAt(0) % COLORS.length
  return (
    <div className={`w-14 h-14 rounded-full ${COLORS[idx]} flex items-center justify-center text-white text-lg font-bold select-none shrink-0`}>
      {ini}
    </div>
  )
}

export default async function PerfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; q?: string }>
}) {
  const { tipo = 'todos', q = '' } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('perfiles_inquilino')
    .select('*')
    .eq('estado', 'activo')
    .order('destacado', { ascending: false })
    .order('created_at', { ascending: false })

  if (tipo !== 'todos') {
    query = query.eq('tipo_busqueda', tipo)
  }

  if (q) {
    query = query.or(`nombre.ilike.%${q}%,descripcion.ilike.%${q}%,sector.ilike.%${q}%`)
  }

  const { data: perfiles } = await query

  const tabs = [
    { key: 'todos',     label: 'Todos' },
    { key: 'anual',     label: 'Todo el año' },
    { key: 'temporero', label: 'Temporada' },
    { key: 'ambos',     label: 'Flexible' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3c5e]">Personas buscando habitación</h1>
          <p className="text-[#6b7280] text-sm mt-1">
            Encuentra inquilinos que buscan habitación en Andorra.
          </p>
        </div>
        <Link
          href="/buscar-habitacion"
          className="px-4 py-2.5 rounded-xl bg-[#1a3c5e] text-white text-sm font-semibold hover:bg-[#0ea5a0] transition-colors whitespace-nowrap"
        >
          + Publicar mi perfil
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit flex-wrap">
          {tabs.map((tab) => (
            <a
              key={tab.key}
              href={`/perfiles?tipo=${tab.key}${q ? `&q=${q}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tipo === tab.key
                  ? 'bg-[#1a3c5e] text-white'
                  : 'text-[#6b7280] hover:text-[#1a3c5e]'
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>

        <form className="flex-1 sm:max-w-xs">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por nombre o sector…"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0ea5a0]"
          />
          <input type="hidden" name="tipo" value={tipo} />
        </form>
      </div>

      {/* Grid */}
      {!perfiles || perfiles.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <span className="text-5xl">👤</span>
          <div>
            <p className="text-[#6b7280] font-medium">No hay perfiles publicados aún</p>
            <p className="text-xs text-[#9ca3af] mt-1">¡Sé el primero en publicar tu perfil!</p>
          </div>
          <Link
            href="/buscar-habitacion"
            className="px-5 py-2.5 rounded-xl bg-[#1a3c5e] text-white text-sm font-semibold hover:bg-[#0ea5a0] transition-colors"
          >
            Publicar mi perfil
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(perfiles as PerfilInquilino[]).map((perfil) => {
            const miembro = new Date(perfil.created_at).toLocaleDateString('es-ES', {
              day: 'numeric', month: 'short',
            })

            const tags = [
              labelTipo[perfil.tipo_busqueda],
              perfil.situacion ? labelSituacion[perfil.situacion] : null,
              `Hasta ${perfil.presupuesto_max}€`,
            ].filter(Boolean)

            const extras = [
              perfil.fumador ? 'Fumador' : 'No fumador',
              perfil.mascotas ? 'Con mascotas' : null,
              perfil.acompanado ? 'Acompañado' : null,
            ].filter(Boolean)

            return (
              <Link
                key={perfil.id}
                href={`/perfiles/${perfil.id}`}
                className={`bg-white rounded-2xl border p-5 flex gap-4 hover:shadow-sm transition-all group ${
                  perfil.destacado ? 'border-[#0ea5a0]/40 ring-1 ring-[#0ea5a0]/20' : 'border-gray-100 hover:border-[#0ea5a0]/30'
                }`}
              >
                <Iniciales nombre={perfil.nombre} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-[#1a3c5e] group-hover:text-[#0ea5a0] transition-colors">
                        {perfil.nombre}
                        {perfil.edad ? `, ${perfil.edad}` : ''}
                      </p>
                      {perfil.parroquias?.length > 0 && (
                        <p className="text-xs text-[#6b7280] mt-0.5">
                          {perfil.parroquias.slice(0, 2).join(', ')}{perfil.parroquias.length > 2 ? '…' : ''}
                        </p>
                      )}
                    </div>
                    {perfil.destacado && <span className="text-yellow-500 text-sm shrink-0">⭐</span>}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-bold bg-[#e6f7f7] text-[#0ea5a0] px-2 py-0.5 rounded-full uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {perfil.descripcion && (
                    <p className="text-xs text-[#6b7280] mt-2 line-clamp-2 leading-relaxed">
                      {perfil.descripcion}
                    </p>
                  )}

                  <p className="text-[10px] text-[#9ca3af] mt-2">
                    {extras.filter(Boolean).join(' · ')} · {miembro}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

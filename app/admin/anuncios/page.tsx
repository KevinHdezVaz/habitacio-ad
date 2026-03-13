import { createClient } from '@/lib/supabase-server'
import AdminAnuncioRow from '../components/AdminAnuncioRow'

type FiltroEstado = 'todos' | 'pendiente' | 'activo' | 'inactivo'

export default async function AdminAnunciosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string }>
}) {
  const { estado = 'todos', q = '' } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('anuncios')
    .select('id, titulo, parroquia, precio, estado, created_at, profiles(nombre)')
    .order('created_at', { ascending: false })
    .limit(50)

  if (estado !== 'todos') {
    query = query.eq('estado', estado as FiltroEstado)
  }

  if (q) {
    query = query.ilike('titulo', `%${q}%`)
  }

  const { data: anuncios } = await query

  const tabs: { key: FiltroEstado; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'pendiente', label: 'Pendientes' },
    { key: 'activo', label: 'Activos' },
    { key: 'inactivo', label: 'Inactivos' },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[#1a3c5e]">Anuncios</h1>
        <p className="text-[#6b7280] text-sm mt-0.5">Gestiona todos los anuncios de la plataforma.</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Tabs estado */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit">
          {tabs.map((tab) => (
            <a
              key={tab.key}
              href={`/admin/anuncios?estado=${tab.key}${q ? `&q=${q}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                estado === tab.key
                  ? 'bg-[#1a3c5e] text-white'
                  : 'text-[#6b7280] hover:text-[#1a3c5e]'
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>

        {/* Búsqueda */}
        <form className="flex-1 sm:max-w-xs">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por título…"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0ea5a0]"
          />
          <input type="hidden" name="estado" value={estado} />
        </form>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {!anuncios || anuncios.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-[#6b7280] font-medium">No hay anuncios</p>
            <p className="text-xs text-[#9ca3af] mt-1">
              {estado !== 'todos' ? `No hay anuncios en estado "${estado}".` : 'Aún no hay ningún anuncio publicado.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            <div className="px-6 py-3 bg-gray-50 grid grid-cols-[1fr_auto] text-xs font-semibold text-[#6b7280] uppercase tracking-wide">
              <span>Anuncio</span>
              <span>Acciones</span>
            </div>
            {anuncios.map((anuncio) => (
              <AdminAnuncioRow key={anuncio.id} anuncio={anuncio as never} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

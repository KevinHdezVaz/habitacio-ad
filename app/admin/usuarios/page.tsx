import { createClient } from '@/lib/supabase-server'
import CambiarTipoUsuario from './CambiarTipoUsuario'

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tipo?: string }>
}) {
  const { q = '', tipo = 'todos' } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('id, nombre, telefono, tipo, descripcion, created_at')
    .order('created_at', { ascending: false })

  if (tipo !== 'todos') {
    query = query.eq('tipo', tipo)
  }
  if (q) {
    query = query.ilike('nombre', `%${q}%`)
  }

  const { data: usuarios } = await query

  const tabs = [
    { key: 'todos',      label: 'Todos' },
    { key: 'arrendador', label: 'Propietarios' },
    { key: 'inquilino',  label: 'Inquilinos' },
    { key: 'admin',      label: 'Admins' },
  ]

  const badgeTipo: Record<string, string> = {
    arrendador: 'bg-blue-100 text-blue-700',
    inquilino:  'bg-teal-100 text-teal-700',
    admin:      'bg-purple-100 text-purple-700',
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[#1a3c5e]">Usuarios</h1>
        <p className="text-[#6b7280] text-sm mt-0.5">
          {usuarios?.length ?? 0} usuario{(usuarios?.length ?? 0) !== 1 ? 's' : ''} registrado{(usuarios?.length ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit flex-wrap">
          {tabs.map((tab) => (
            <a
              key={tab.key}
              href={`/admin/usuarios?tipo=${tab.key}${q ? `&q=${q}` : ''}`}
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
            placeholder="Buscar por nombre…"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0ea5a0]"
          />
          <input type="hidden" name="tipo" value={tipo} />
        </form>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {!usuarios || usuarios.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-4xl mb-3">👤</div>
            <p className="text-[#6b7280] font-medium">No hay usuarios</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {/* Cabecera */}
            <div className="px-6 py-3 bg-gray-50 grid grid-cols-[1fr_auto] text-xs font-semibold text-[#6b7280] uppercase tracking-wide hidden sm:grid">
              <span>Usuario</span>
              <span>Tipo</span>
            </div>

            {usuarios.map((u) => {
              const fecha = new Date(u.created_at).toLocaleDateString('es-ES', {
                day: '2-digit', month: 'short', year: 'numeric',
              })
              const iniciales = u.nombre
                .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

              return (
                <div key={u.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#1a3c5e] flex items-center justify-center text-white text-sm font-bold shrink-0 select-none">
                      {iniciales}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-[#1a3c5e] text-sm">{u.nombre}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${badgeTipo[u.tipo] ?? 'bg-gray-100 text-gray-600'}`}>
                          {u.tipo}
                        </span>
                      </div>
                      <p className="text-xs text-[#9ca3af] mt-0.5">
                        {u.telefono ? `${u.telefono} · ` : ''}{fecha}
                      </p>
                    </div>
                  </div>

                  {/* Cambiar tipo */}
                  <CambiarTipoUsuario userId={u.id} tipoActual={u.tipo} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

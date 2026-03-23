import { createClient } from '@/lib/supabase-server'
import CambiarTipoUsuario from './CambiarTipoUsuario'
import { getTranslations, getLocale } from 'next-intl/server'

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tipo?: string }>
}) {
  const { q = '', tipo = 'todos' } = await searchParams
  const supabase = await createClient()
  const t = await getTranslations('admin')
  const locale = await getLocale()

  let query = supabase
    .from('profiles')
    .select('id, nombre, telefono, tipo, created_at')
    .order('created_at', { ascending: false })

  if (tipo !== 'todos') {
    query = query.eq('tipo', tipo)
  }
  if (q) {
    query = query.ilike('nombre', `%${q}%`)
  }

  const { data: usuarios } = await query

  const tabs = [
    { key: 'todos',     label: t('tabAll') },
    { key: 'inquilino', label: t('tabInquilinos') },
    { key: 'admin',     label: t('tabAdmins') },
  ]

  const n = usuarios?.length ?? 0
  const dateLocale = locale === 'ca' ? 'ca-ES' : 'es-ES'

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-[#1a3c5e]">{t('usersTitle')}</h1>
        <p className="text-[#6b7280] text-sm mt-0.5">
          {n === 1 ? t('usersCount', { n }) : t('usersCountPlural', { n })}
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit">
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

        <form>
          <input
            name="q"
            defaultValue={q}
            placeholder={t('searchByName')}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0ea5a0]"
          />
          <input type="hidden" name="tipo" value={tipo} />
        </form>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {!usuarios || usuarios.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-4xl mb-3">👤</div>
            <p className="text-[#6b7280] font-medium">{t('noUsers')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {usuarios.map((u) => {
              const fecha = new Date(u.created_at).toLocaleDateString(dateLocale, {
                day: '2-digit', month: 'short', year: 'numeric',
              })
              const iniciales = (u.nombre ?? '?')
                .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

              return (
                <div key={u.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1a3c5e] flex items-center justify-center text-white text-xs font-bold shrink-0 select-none">
                    {iniciales}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1a3c5e] text-sm truncate">{u.nombre ?? '—'}</p>
                    <p className="text-xs text-[#9ca3af]">
                      {u.telefono ? `${u.telefono} · ` : ''}{fecha}
                    </p>
                  </div>
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

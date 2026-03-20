import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import type { PerfilInquilino } from '@/types'

export default async function PerfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; q?: string }>
}) {
  const { tipo = 'todos', q = '' } = await searchParams
  const supabase = await createClient()
  const t = await getTranslations('profiles')

  const labelTipo: Record<string, string> = {
    anual:     t('labelAnual'),
    temporero: t('labelTemporero'),
    ambos:     t('labelAmbos'),
  }
  const labelSituacion: Record<string, string> = {
    trabajador: t('labelTrabajador'),
    estudiante: t('labelEstudiante'),
    temporero:  t('labelTemporeroSit'),
  }

  const ahora = new Date().toISOString()

  let query = supabase
    .from('perfiles_inquilino')
    .select('*')
    .eq('estado', 'activo')
    .gt('fecha_caducidad', ahora)
    .order('destacado', { ascending: false })
    .order('created_at', { ascending: false })

  if (tipo !== 'todos') {
    query = query.eq('tipo_busqueda', tipo)
  }

  if (q) {
    query = query.or(`sector.ilike.%${q}%,parroquias.cs.{${q}}`)
  }

  const [{ data: perfiles }, { data: { user } }] = await Promise.all([
    query,
    supabase.auth.getUser(),
  ])

  // Fetch avatars desde profiles para todos los perfiles encontrados
  const userIds = (perfiles ?? []).map((p) => p.user_id).filter(Boolean)
  const avatarMap: Record<string, string | null> = {}
  if (userIds.length > 0) {
    const { data: profileAvatars } = await supabase
      .from('profiles')
      .select('id, avatar_url')
      .in('id', userIds)
    for (const pa of profileAvatars ?? []) {
      avatarMap[pa.id] = pa.avatar_url ?? null
    }
  }

  const tabs = [
    { key: 'todos',     label: t('all') },
    { key: 'anual',     label: t('annual') },
    { key: 'temporero', label: t('seasonal') },
    { key: 'ambos',     label: t('both') },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3c5e]">{t('title')}</h1>
          <p className="text-[#6b7280] text-sm mt-1">
            {t('subtitle')}
          </p>
        </div>
        <Link
          href="/buscar-habitacion"
          className="px-4 py-2.5 rounded-xl bg-[#1a3c5e] text-white text-sm font-semibold hover:bg-[#0ea5a0] transition-colors whitespace-nowrap"
        >
          {t('publishProfile')}
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
            placeholder={t('searchPlaceholder')}
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
            <p className="text-[#6b7280] font-medium">{t('noResults')}</p>
            <p className="text-xs text-[#9ca3af] mt-1">{t('beFirst')}</p>
          </div>
          <Link
            href="/buscar-habitacion"
            className="px-5 py-2.5 rounded-xl bg-[#1a3c5e] text-white text-sm font-semibold hover:bg-[#0ea5a0] transition-colors"
          >
            {t('publishProfileEmpty')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(perfiles as PerfilInquilino[]).map((perfil) => {
            const tags = [
              labelTipo[perfil.tipo_busqueda],
              perfil.situacion ? labelSituacion[perfil.situacion] : null,
              t('hastaPresupuesto', { n: perfil.presupuesto_max }),
            ].filter(Boolean)

            const esPropio = user?.id === perfil.user_id
            const infoRestante = [
              perfil.sector || null,
              perfil.parroquias?.length > 0
                ? perfil.parroquias.slice(0, 2).join(', ') + (perfil.parroquias.length > 2 ? '…' : '')
                : null,
            ].filter(Boolean)

            const extras = [
              perfil.fumador ? t('smoker') : t('nonSmoker'),
              perfil.mascotas ? t('withPets') : null,
              perfil.acompanado ? t('accompanied') : null,
            ].filter(Boolean)

            return (
              <Link
                key={perfil.id}
                href={`/perfiles/${perfil.id}`}
                className={`bg-white rounded-2xl border p-5 flex gap-4 hover:shadow-sm transition-all group ${
                  perfil.destacado ? 'border-[#0ea5a0]/40 ring-1 ring-[#0ea5a0]/20' : 'border-gray-100 hover:border-[#0ea5a0]/30'
                }`}
              >
                <Avatar
                  nombre={perfil.nombre}
                  avatarUrl={avatarMap[perfil.user_id] ?? null}
                  size="md"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-[#1a3c5e] group-hover:text-[#0ea5a0] transition-colors text-sm flex items-center flex-wrap gap-1">
                        <span className={esPropio ? "" : "blur-sm select-none opacity-80 transition-all delay-100"}>
                          {perfil.nombre || 'Inquilino/a'}
                        </span>
                        {perfil.edad && <span>, {perfil.edad} {t('anosLabel')}</span>}
                        {infoRestante.length > 0 && <span> · {infoRestante.join(' · ')}</span>}
                      </p>
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

                  <p className="text-[10px] text-[#9ca3af] mt-2">
                    {extras.filter(Boolean).join(' · ')}
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

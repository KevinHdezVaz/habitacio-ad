import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import type { PerfilInquilino } from '@/types'
import { getTranslations, getLocale } from 'next-intl/server'
import { iniciarChatDirecto } from '@/app/actions/chat'

export default async function PerfilInquilinoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const t = await getTranslations('perfilDetalle')
  const locale = await getLocale()

  const labelTipo: Record<string, string> = {
    anual: t('labelAnual'),
    temporero: t('labelTemporero'),
    ambos: t('labelAmbos'),
  }
  const labelSituacion: Record<string, string> = {
    trabajador: t('labelTrabajador'),
    estudiante: t('labelEstudiante'),
    temporero: t('labelTemporeroSit'),
  }
  const labelSexo: Record<string, string> = {
    hombre: t('labelHombre'),
    mujer: t('labelMujer'),
    no_dice: t('labelNoDice'),
  }

  const ahora = new Date().toISOString()

  const [{ data: perfil }, { data: { user } }] = await Promise.all([
    supabase.from('perfiles_inquilino').select('*').eq('id', id).single(),
    supabase.auth.getUser(),
  ])

  if (!perfil) notFound()

  // Ocultar perfiles caducados o inactivos (a menos que sea el propio usuario)
  const esPropio = user?.id === perfil.user_id
  if (!esPropio && (perfil.estado !== 'activo' || perfil.fecha_caducidad <= ahora)) {
    notFound()
  }

  const p = perfil as PerfilInquilino

  // Obtener avatar del profile del usuario
  const { data: profileData } = await supabase
    .from('profiles')
    .select('avatar_url, telefono')
    .eq('id', p.user_id)
    .single()
  const avatarUrl  = profileData?.avatar_url ?? null
  const telefono   = profileData?.telefono ?? null

  const dateLocale = locale === 'ca' ? 'ca-ES' : 'es-ES'
  const fechaEntrada = p.fecha_entrada
    ? new Date(p.fecha_entrada).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const fechaSalida = p.fecha_salida
    ? new Date(p.fecha_salida).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const chips = [
    { label: t('chipTipoEstancia'), value: labelTipo[p.tipo_busqueda] },
    p.situacion ? { label: t('chipSituacion'), value: labelSituacion[p.situacion] } : null,
    p.sector ? { label: t('chipSector'), value: p.sector } : null,
    (p as any).sexo ? { label: t('chipSexo'), value: labelSexo[(p as any).sexo] } : null,
    fechaEntrada ? { label: t('chipDesde'), value: fechaEntrada } : null,
    fechaSalida ? { label: t('chipHasta'), value: fechaSalida } : null,
    { label: t('chipPresupuesto'), value: t('budgetValue', { n: p.presupuesto_max }) },
    { label: t('chipFumador'), value: p.fumador ? t('chipSi') : t('chipNo') },
    { label: t('chipMascotas'), value: p.mascotas ? t('chipSi') : t('chipNo') },
    { label: t('chipViene'), value: p.acompanado ? t('chipAcompanado') : t('chipSolo') },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="text-sm text-[#6b7280]">
        <Link href="/perfiles" className="hover:text-[#1a3c5e] transition-colors">{t('breadcrumbProfiles')}</Link>
        <span className="mx-2">·</span>
        <span className="text-[#1a3c5e] font-medium">{t('breadcrumbProfile')}</span>
      </div>

      {/* Tarjeta principal */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        <div className="flex items-start gap-5 flex-wrap">
          <Avatar
            nombre={p.nombre}
            avatarUrl={avatarUrl}
            size="xl"
            rounded="2xl"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-[#1a3c5e] flex items-center flex-wrap">
                <span>
                  {esPropio ? (p.nombre || 'Inquilino/a') : 'Inquilino/a'}
                </span>
                {p.edad && <span>, {t('yearsOld', { n: p.edad })}</span>}
              </h1>
              {p.destacado && <span className="text-yellow-500 text-xl">⭐</span>}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] font-bold bg-[#e6f7f7] text-[#0ea5a0] px-2.5 py-1 rounded-full uppercase">
                {labelTipo[p.tipo_busqueda]}
              </span>
              <span className="text-[10px] font-bold bg-blue-100 text-[#1a3c5e] px-2.5 py-1 rounded-full uppercase">
                {t('chipHasta')} {p.presupuesto_max}€/mes
              </span>
            </div>

            {p.parroquias?.length > 0 && (
              <p className="text-sm text-[#6b7280] mt-2">
                📍 {t('searchesIn')} <strong className="text-[#374151]">{p.parroquias.join(', ')}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Grid de detalles */}
        <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {chips.map((chip) => (
            <div key={chip.label} className="bg-[#f4f5f7] rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-[#9ca3af] font-medium uppercase">{chip.label}</p>
              <p className="text-sm font-semibold text-[#1a3c5e] mt-0.5">{chip.value}</p>
            </div>
          ))}
        </div>

        {/* Acciones / Sistema de bloqueo */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          {esPropio ? (
            <div className="flex items-center gap-3">
              <Link
                href={`/perfiles/${id}/editar`}
                className="px-4 py-2.5 rounded-xl bg-[#1a3c5e] text-white text-sm font-semibold hover:bg-[#0ea5a0] transition-colors"
              >
                {t('editMyProfile')}
              </Link>
              <span className="text-xs text-[#9ca3af]">{t('ownProfileLabel')}</span>
            </div>
          ) : (
            <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
              <p className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">{t('contactTitle')}</p>

              {user ? (
                <div className="flex flex-col gap-3">
                  {telefono && (
                    <a
                      href={`tel:${telefono}`}
                      className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 hover:border-[#0ea5a0] transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#0ea5a0] flex-shrink-0"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                      <span className="text-sm font-semibold text-[#1a3c5e]">{telefono}</span>
                    </a>
                  )}
                  <form action={iniciarChatDirecto.bind(null, p.user_id)}>
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 bg-[#1a3c5e] text-white rounded-xl px-4 py-3 text-sm font-bold hover:bg-[#0ea5a0] transition-colors w-full"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                      {t('directChat')}
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href={`/login?next=/perfiles/${id}`}
                  className="w-full py-3 rounded-xl bg-[#1a3c5e] text-white text-sm font-bold text-center hover:bg-[#0ea5a0] transition-colors"
                >
                  {t('loginToContact')}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

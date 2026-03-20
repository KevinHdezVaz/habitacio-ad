import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
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
const labelSexo: Record<string, string> = {
  hombre:  'Hombre',
  mujer:   'Mujer',
  no_dice: 'Prefiero no decirlo',
}
export default async function PerfilInquilinoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

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
    .select('avatar_url')
    .eq('id', p.user_id)
    .single()
  const avatarUrl = profileData?.avatar_url ?? null

  const fechaEntrada = p.fecha_entrada
    ? new Date(p.fecha_entrada).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const fechaSalida = p.fecha_salida
    ? new Date(p.fecha_salida).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const chips = [
    { label: 'Tipo de estancia',   value: labelTipo[p.tipo_busqueda] },
    p.situacion ? { label: 'Situación',       value: labelSituacion[p.situacion] } : null,
    p.sector    ? { label: 'Sector',           value: p.sector } : null,
    (p as any).sexo ? { label: 'Sexo', value: labelSexo[(p as any).sexo] } : null,
    fechaEntrada ? { label: 'Disponible desde', value: fechaEntrada } : null,
    fechaSalida  ? { label: 'Hasta',            value: fechaSalida } : null,
    { label: 'Presupuesto máximo', value: `${p.presupuesto_max}€/mes` },
    { label: 'Fumador/a',          value: p.fumador ? 'Sí' : 'No' },
    { label: 'Mascotas',           value: p.mascotas ? 'Sí' : 'No' },
    { label: 'Viene',              value: p.acompanado ? 'Acompañado/a' : 'Solo/a' },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="text-sm text-[#6b7280]">
        <Link href="/perfiles" className="hover:text-[#1a3c5e] transition-colors">Perfiles</Link>
        <span className="mx-2">·</span>
        <span className="text-[#1a3c5e] font-medium">Perfil</span>
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
                <span className={esPropio ? "" : "blur-sm select-none opacity-80 transition-all"}>
                  {p.nombre || 'Inquilino/a'}
                </span>
                {p.edad && <span>, {p.edad} años</span>}
              </h1>
              {p.destacado && <span className="text-yellow-500 text-xl">⭐</span>}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] font-bold bg-[#e6f7f7] text-[#0ea5a0] px-2.5 py-1 rounded-full uppercase">
                {labelTipo[p.tipo_busqueda]}
              </span>
              <span className="text-[10px] font-bold bg-blue-100 text-[#1a3c5e] px-2.5 py-1 rounded-full uppercase">
                Hasta {p.presupuesto_max}€/mes
              </span>
            </div>

            {p.parroquias?.length > 0 && (
              <p className="text-sm text-[#6b7280] mt-2">
                📍 Busca en: <strong className="text-[#374151]">{p.parroquias.join(', ')}</strong>
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
                Editar mi perfil
              </Link>
              <span className="text-xs text-[#9ca3af]">Este es tu perfil publicado</span>
            </div>
          ) : (
            <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
              {/* Info bloqueada */}
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Contacto</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Teléfono', valor: '••• ••• •••' },
                    { label: 'Email', valor: '••••••@••••.com' },
                    { label: 'Chat directo', valor: 'Bloqueado' },
                  ].map(({ label, valor }) => (
                    <div key={label} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-gray-100">
                      <span className="text-xs text-[#9ca3af] font-medium">{label}</span>
                      <span className="text-xs text-gray-300 font-semibold blur-sm select-none">{valor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA desbloqueo */}
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3 bg-[#1a3c5e]/5 rounded-xl p-3">
                    <span className="text-lg">🔒</span>
                    <div>
                      <p className="text-sm font-bold text-[#1a3c5e]">Desbloquea el contacto</p>
                      <p className="text-xs text-[#6b7280] mt-0.5">Accede al teléfono, email y chat de este inquilino.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      disabled
                      className="flex flex-col items-center py-3 px-2 rounded-xl bg-[#1a3c5e] text-white text-center opacity-70 cursor-not-allowed"
                    >
                      <span className="text-sm font-bold">6,90€</span>
                      <span className="text-[10px] opacity-80">Este perfil</span>
                    </button>
                    <button
                      disabled
                      className="flex flex-col items-center py-3 px-2 rounded-xl bg-[#0ea5a0] text-white text-center opacity-70 cursor-not-allowed"
                    >
                      <span className="text-sm font-bold">19,90€</span>
                      <span className="text-[10px] opacity-80">Todos · 7 días</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-[#9ca3af]">Pagos disponibles próximamente</p>
                </div>
              ) : (
                <Link
                  href={`/login?next=/perfiles/${id}`}
                  className="w-full py-3 rounded-xl bg-[#1a3c5e] text-white text-sm font-bold text-center hover:bg-[#0ea5a0] transition-colors"
                >
                  Inicia sesión para ver el contacto
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

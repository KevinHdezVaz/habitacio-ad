import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function AdminUsuarioDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const adminClient = createAdminClient()

  // Datos del perfil + datos auth en paralelo
  const [
    { data: perfil },
    { data: authUser, error: authError },
    { data: anuncios },
    { data: perfilBusqueda },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).single(),
    adminClient.auth.admin.getUserById(id),
    supabase
      .from('anuncios')
      .select('id, titulo, parroquia, precio, estado, created_at')
      .eq('user_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('perfiles_inquilino')
      .select('id, tipo_busqueda, presupuesto_max, parroquias, estado, created_at')
      .eq('user_id', id)
      .maybeSingle(),
  ])

  if (!perfil) notFound()

  const email = authUser?.user?.email ?? '—'
  const lastSignIn = authUser?.user?.last_sign_in_at
    ? new Date(authUser.user.last_sign_in_at).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : '—'
  const createdAt = new Date(perfil.created_at).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const iniciales = (perfil.nombre ?? '?')
    .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  const BADGE: Record<string, string> = {
    admin:     'bg-purple-100 text-purple-700',
    inquilino: 'bg-[#e6f7f7] text-[#0ea5a0]',
    arrendador: 'bg-blue-100 text-blue-700',
  }
  const ESTADO_ANUNCIO: Record<string, string> = {
    activo:   'bg-emerald-100 text-emerald-700',
    inactivo: 'bg-gray-100 text-gray-500',
    pendiente:'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#9ca3af]">
        <Link href="/admin/usuarios" className="hover:text-[#1a3c5e] transition-colors">Usuarios</Link>
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-[#374151] font-medium">{perfil.nombre ?? 'Usuario'}</span>
      </div>

      {/* Cabecera usuario */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-start gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[#1a3c5e] flex items-center justify-center text-white text-xl font-bold shrink-0">
          {iniciales}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-[#1a3c5e]">{perfil.nombre ?? '—'}</h1>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${BADGE[perfil.tipo] ?? 'bg-gray-100 text-gray-500'}`}>
              {perfil.tipo ?? '—'}
            </span>
          </div>
          <p className="text-sm text-[#6b7280] mt-1">{email}</p>
          {perfil.telefono && (
            <p className="text-sm text-[#9ca3af] mt-0.5">{perfil.telefono}</p>
          )}
          <p className="text-xs text-[#9ca3af] mt-2">Registrado el {createdAt}</p>
        </div>
      </div>

      {/* Datos de sesión */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-[#1a3c5e] mb-4">Información de cuenta</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'ID de usuario', value: id, mono: true },
            { label: 'Email', value: email },
            { label: 'Teléfono', value: perfil.telefono ?? '—' },
            { label: 'Tipo', value: perfil.tipo ?? '—' },
            { label: 'Último acceso', value: lastSignIn },
            { label: 'Registro', value: createdAt },
          ].map(({ label, value, mono }) => (
            <div key={label} className="bg-[#f8fafc] rounded-xl px-4 py-3">
              <p className="text-[10px] text-[#9ca3af] font-bold uppercase tracking-wider">{label}</p>
              <p className={`text-sm font-medium text-[#374151] mt-0.5 break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
            </div>
          ))}
        </div>
        {perfil.sobre_mi && (
          <div className="mt-3 bg-[#f8fafc] rounded-xl px-4 py-3">
            <p className="text-[10px] text-[#9ca3af] font-bold uppercase tracking-wider mb-1">Sobre mí</p>
            <p className="text-sm text-[#374151] leading-relaxed">{perfil.sobre_mi}</p>
          </div>
        )}
      </div>

      {/* Anuncios publicados */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1a3c5e]">Anuncios publicados</h2>
          <span className="text-xs text-[#9ca3af]">{anuncios?.length ?? 0} anuncios</span>
        </div>
        {!anuncios || anuncios.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-[#9ca3af]">Sin anuncios publicados</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {anuncios.map((a) => (
              <Link
                key={a.id}
                href={`/admin/anuncios/${a.id}`}
                className="flex items-center gap-3 px-5 py-3 hover:bg-[#f8fafc] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1a3c5e] truncate">{a.titulo}</p>
                  <p className="text-xs text-[#9ca3af]">
                    {a.parroquia} · {a.precio}€/mes · {new Date(a.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shrink-0 ${ESTADO_ANUNCIO[a.estado] ?? 'bg-gray-100 text-gray-500'}`}>
                  {a.estado}
                </span>
                <svg className="w-3.5 h-3.5 text-[#d1d5db]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Perfil de búsqueda */}
      {perfilBusqueda && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#1a3c5e]">Perfil de búsqueda</h2>
            <Link
              href={`/perfiles/${perfilBusqueda.id}`}
              className="text-xs text-[#0ea5a0] font-semibold hover:underline"
            >
              Ver perfil →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: 'Tipo', value: perfilBusqueda.tipo_busqueda },
              { label: 'Presupuesto', value: `${perfilBusqueda.presupuesto_max}€/mes` },
              { label: 'Estado', value: perfilBusqueda.estado },
              { label: 'Zonas', value: perfilBusqueda.parroquias?.join(', ') ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#f8fafc] rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-[#9ca3af] font-bold uppercase">{label}</p>
                <p className="text-xs font-semibold text-[#374151] mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-2">
        <Link
          href="/admin/usuarios"
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-[#374151] hover:border-[#1a3c5e] transition-colors"
        >
          ← Volver a usuarios
        </Link>
        <a
          href={`mailto:${email}`}
          className="px-4 py-2 rounded-xl bg-[#1a3c5e] text-white text-sm font-semibold hover:bg-[#0ea5a0] transition-colors"
        >
          Enviar email
        </a>
      </div>

    </div>
  )
}

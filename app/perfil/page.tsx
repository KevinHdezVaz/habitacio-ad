import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import FormularioPerfil from './components/FormularioPerfil'
import MisAnuncios from './components/MisAnuncios'
import AvatarUpload from './components/AvatarUpload'
import type { Anuncio, Profile } from '@/types'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/perfil')

  const [{ data: profile }, { data: anuncios }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('anuncios')
      .select('*, imagenes_anuncio(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  if (!profile) redirect('/login')

  const miembro = new Date(user.created_at).toLocaleDateString('es-ES', {
    month: 'long', year: 'numeric',
  })

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3c5e]">Mi Perfil</h1>
          <p className="text-[#6b7280] text-sm mt-0.5">Gestiona tu información y tus anuncios.</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-[#6b7280] hover:border-red-200 hover:text-red-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center gap-4 text-center sticky top-20">
            {/* Avatar con subida de foto */}
            <AvatarUpload
              userId={user.id}
              avatarUrl={profile.avatar_url}
              nombre={profile.nombre ?? ''}
              size="lg"
            />
            <div>
              <p className="font-bold text-[#1a3c5e] leading-tight">{profile.nombre}</p>
              <p className="text-xs text-[#9ca3af] mt-0.5">Miembro desde {miembro}</p>
            </div>

            {/* Stats rápidos */}
            <div className="w-full border-t border-gray-100 pt-4 grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-xl font-bold text-[#1a3c5e]">
                  {anuncios?.filter((a) => a.estado === 'activo').length ?? 0}
                </p>
                <p className="text-[10px] text-[#6b7280]">Activos</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#1a3c5e]">
                  {anuncios?.length ?? 0}
                </p>
                <p className="text-[10px] text-[#6b7280]">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3 flex flex-col gap-6">
          {/* Formulario perfil */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <FormularioPerfil
              profile={profile as Profile & { descripcion?: string }}
              email={user.email ?? ''}
            />
          </div>

          {/* Mis anuncios */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h2 className="font-bold text-[#1a3c5e] text-lg">Mis anuncios</h2>
              {(anuncios?.length ?? 0) > 0 && (
                <span className="text-xs text-[#6b7280]">{anuncios?.length} publicación{(anuncios?.length ?? 0) !== 1 ? 'es' : ''}</span>
              )}
            </div>
            <MisAnuncios anuncios={(anuncios ?? []) as Anuncio[]} />
          </div>
        </div>
      </div>
    </div>
  )
}

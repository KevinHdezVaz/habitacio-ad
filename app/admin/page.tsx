import { createClient } from '@/lib/supabase-server'
import AdminAnuncioRow from './components/AdminAnuncioRow'

export default async function AdminPage() {
  const supabase = await createClient()

  // Stats en paralelo
  const [
    { count: totalAnuncios },
    { count: pendientes },
    { count: activos },
    { count: totalUsuarios },
    { data: ultimosPendientes },
  ] = await Promise.all([
    supabase.from('anuncios').select('*', { count: 'exact', head: true }),
    supabase.from('anuncios').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
    supabase.from('anuncios').select('*', { count: 'exact', head: true }).eq('estado', 'activo'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('anuncios')
      .select('id, titulo, parroquia, precio, estado, created_at, profiles(nombre)')
      .eq('estado', 'pendiente')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const stats = [
    { label: 'Total anuncios', value: totalAnuncios ?? 0, icon: '🏠', color: 'bg-blue-50 text-blue-600' },
    { label: 'Pendientes', value: pendientes ?? 0, icon: '⏳', color: 'bg-amber-50 text-amber-600' },
    { label: 'Activos', value: activos ?? 0, icon: '✅', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Usuarios', value: totalUsuarios ?? 0, icon: '👥', color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[#1a3c5e]">Dashboard</h1>
        <p className="text-[#6b7280] text-sm mt-0.5">Estado general de la plataforma.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-[#1a3c5e]">{s.value}</p>
            <p className="text-xs text-[#6b7280] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pendientes de revisión */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[#1a3c5e]">Pendientes de revisión</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">Aprueba o rechaza cada anuncio antes de que sea visible.</p>
          </div>
          {(pendientes ?? 0) > 0 && (
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {pendientes} pendiente{(pendientes ?? 0) !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {!ultimosPendientes || ultimosPendientes.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-[#6b7280] font-medium">Sin anuncios pendientes</p>
            <p className="text-xs text-[#9ca3af] mt-1">Todos los anuncios están revisados.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {ultimosPendientes.map((anuncio) => (
              <AdminAnuncioRow key={anuncio.id} anuncio={anuncio as never} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

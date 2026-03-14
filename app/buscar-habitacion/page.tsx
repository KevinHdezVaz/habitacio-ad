import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import FormularioBusqueda from './FormularioBusqueda'

export default async function BuscarHabitacionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/buscar-habitacion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-xl mx-auto">
      <FormularioBusqueda avatarUrl={profile?.avatar_url ?? null} />
    </div>
  )
}

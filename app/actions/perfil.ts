'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function actualizarPerfil(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const nombre   = (formData.get('nombre')   as string).trim()
  const telefono = (formData.get('telefono') as string).trim()
  const descripcion = (formData.get('descripcion') as string).trim()

  if (!nombre) return { error: 'El nombre es obligatorio.' }

  const { error } = await supabase
    .from('profiles')
    .update({ nombre, telefono, descripcion })
    .eq('id', user.id)

  if (error) return { error: 'Error al guardar los cambios.' }

  revalidatePath('/perfil')
  return { ok: true }
}

export async function cambiarEstadoAnuncio(id: string, nuevoEstado: 'activo' | 'inactivo') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Solo puede cambiar sus propios anuncios (no anuncios pendientes)
  const { error } = await supabase
    .from('anuncios')
    .update({ estado: nuevoEstado })
    .eq('id', id)
    .eq('user_id', user.id)
    .neq('estado', 'pendiente') // no puede reactivar pendientes directamente

  if (error) return { error: error.message }

  revalidatePath('/perfil')
  return { ok: true }
}

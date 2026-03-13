'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function verificarAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('tipo')
    .eq('id', user.id)
    .single()

  if (profile?.tipo !== 'admin') redirect('/')
  return supabase
}

export async function aprobarAnuncio(id: string) {
  const supabase = await verificarAdmin()
  const { error } = await supabase
    .from('anuncios')
    .update({ estado: 'activo' })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin')
  return { ok: true }
}

export async function rechazarAnuncio(id: string) {
  const supabase = await verificarAdmin()
  const { error } = await supabase
    .from('anuncios')
    .update({ estado: 'inactivo' })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin')
  return { ok: true }
}

export async function destacarAnuncio(id: string, destacado: boolean) {
  const supabase = await verificarAdmin()
  const { error } = await supabase
    .from('anuncios')
    .update({ destacado })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin')
  return { ok: true }
}

export async function cambiarTipoUsuario(userId: string, nuevoTipo: string) {
  const supabase = await verificarAdmin()
  const { error } = await supabase
    .from('profiles')
    .update({ tipo: nuevoTipo })
    .eq('id', userId)
  if (error) return { error: error.message }
  revalidatePath('/admin/usuarios')
  return { ok: true }
}

export async function eliminarAnuncio(id: string) {
  const supabase = await verificarAdmin()

  // Primero eliminar imágenes asociadas
  await supabase.from('imagenes_anuncio').delete().eq('anuncio_id', id)

  const { error } = await supabase.from('anuncios').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin')
  return { ok: true }
}

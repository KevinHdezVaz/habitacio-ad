'use server'

import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { emailAnuncioAprobado, emailAnuncioRechazado } from '@/lib/email'

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

  try {
    after(async () => {
      try {
        const { data: anuncio } = await supabase
          .from('anuncios')
          .select('titulo, user_id')
          .eq('id', id)
          .single()
        if (!anuncio) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('nombre')
          .eq('id', anuncio.user_id)
          .single()

        const { data: authUser } = await createAdminClient().auth.admin.getUserById(anuncio.user_id)
        const email = authUser?.user?.email
        if (!email) return

        await emailAnuncioAprobado({
          destinatarioEmail: email,
          destinatarioNombre: profile?.nombre ?? 'Usuario',
          tituloAnuncio: anuncio.titulo,
          anuncioId: id,
        })
      } catch { /* silent */ }
    })
  } catch { /* after() no disponible */ }

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

  try {
    after(async () => {
      try {
        const { data: anuncio } = await supabase
          .from('anuncios')
          .select('titulo, user_id')
          .eq('id', id)
          .single()
        if (!anuncio) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('nombre')
          .eq('id', anuncio.user_id)
          .single()

        const { data: authUser } = await createAdminClient().auth.admin.getUserById(anuncio.user_id)
        const email = authUser?.user?.email
        if (!email) return

        await emailAnuncioRechazado({
          destinatarioEmail: email,
          destinatarioNombre: profile?.nombre ?? 'Usuario',
          tituloAnuncio: anuncio.titulo,
        })
      } catch { /* silent */ }
    })
  } catch { /* after() no disponible */ }

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

export async function eliminarUsuario(userId: string) {
  await verificarAdmin()
  const adminClient = createAdminClient()

  // 1. Obtener IDs de conversaciones del usuario
  const { data: convs } = await adminClient
    .from('conversaciones')
    .select('id')
    .or(`inquilino_id.eq.${userId},arrendador_id.eq.${userId}`)

  const convIds = (convs ?? []).map((c: { id: string }) => c.id)

  // 2. Eliminar mensajes de esas conversaciones
  if (convIds.length > 0) {
    await adminClient.from('mensajes').delete().in('conversacion_id', convIds)
  }

  // 3. Eliminar conversaciones
  await adminClient.from('conversaciones').delete()
    .or(`inquilino_id.eq.${userId},arrendador_id.eq.${userId}`)

  // 4. Eliminar imágenes de los anuncios del usuario
  const { data: anunciosUser } = await adminClient
    .from('anuncios')
    .select('id')
    .eq('user_id', userId)

  const anuncioIds = (anunciosUser ?? []).map((a: { id: string }) => a.id)
  if (anuncioIds.length > 0) {
    await adminClient.from('imagenes_anuncio').delete().in('anuncio_id', anuncioIds)
  }

  // 5. Eliminar anuncios
  await adminClient.from('anuncios').delete().eq('user_id', userId)

  // 6. Eliminar perfil de búsqueda de inquilino
  await adminClient.from('perfiles_inquilino').delete().eq('user_id', userId)

  // 7. Eliminar perfil
  await adminClient.from('profiles').delete().eq('id', userId)

  // 8. Eliminar usuario de auth
  const { error } = await adminClient.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }

  revalidatePath('/admin/usuarios')
  redirect('/admin/usuarios')
}

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

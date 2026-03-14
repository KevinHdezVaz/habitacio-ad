'use server'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { emailAnuncioEnRevision } from '@/lib/email'

export async function publicarAnuncio(
  datos: Record<string, unknown>,
  imageUrls: string[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/publicar')

  const { data: anuncio, error } = await supabase
    .from('anuncios')
    .insert({ ...datos, user_id: user.id, estado: 'pendiente' })
    .select('id')
    .single()

  if (error || !anuncio) {
    return { error: error?.message ?? 'Error al publicar el anuncio.' }
  }

  // Guardar imágenes
  if (imageUrls.length > 0) {
    await supabase.from('imagenes_anuncio').insert(
      imageUrls.map((url, orden) => ({ anuncio_id: anuncio.id, url, orden }))
    )
  }

  const anuncioId = anuncio.id

  try {
    after(async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nombre')
          .eq('id', user.id)
          .single()

        const { data: authUser } = await supabase.auth.admin.getUserById(user.id)
        const email = authUser?.user?.email
        if (!email) return

        await emailAnuncioEnRevision({
          destinatarioEmail: email,
          destinatarioNombre: profile?.nombre ?? 'Usuario',
          tituloAnuncio: String(datos.titulo ?? 'Tu habitación'),
        })
      } catch { /* silent */ }
    })
  } catch { /* after() no disponible */ }

  return { ok: true, id: anuncioId }
}

export async function editarAnuncio(
  anuncioId: string,
  datos: Record<string, unknown>,
  nuevasImageUrls: string[],
  eliminarImagenIds: number[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verificar propiedad
  const { data: anuncio } = await supabase
    .from('anuncios')
    .select('id, user_id')
    .eq('id', anuncioId)
    .single()

  if (!anuncio || anuncio.user_id !== user.id) {
    return { error: 'No tienes permiso para editar este anuncio.' }
  }

  // Actualizar campos
  const { error: updateError } = await supabase
    .from('anuncios')
    .update(datos)
    .eq('id', anuncioId)

  if (updateError) return { error: updateError.message }

  // Eliminar imágenes marcadas
  if (eliminarImagenIds.length > 0) {
    await supabase
      .from('imagenes_anuncio')
      .delete()
      .in('id', eliminarImagenIds)
  }

  // Añadir nuevas imágenes
  if (nuevasImageUrls.length > 0) {
    const { data: existentes } = await supabase
      .from('imagenes_anuncio')
      .select('orden')
      .eq('anuncio_id', anuncioId)
      .order('orden', { ascending: false })
      .limit(1)

    const baseOrden = (existentes?.[0]?.orden ?? -1) + 1
    await supabase.from('imagenes_anuncio').insert(
      nuevasImageUrls.map((url, i) => ({
        anuncio_id: anuncioId,
        url,
        orden: baseOrden + i,
      }))
    )
  }

  return { ok: true }
}

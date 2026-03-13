'use server'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

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

  return { ok: true, id: anuncio.id }
}

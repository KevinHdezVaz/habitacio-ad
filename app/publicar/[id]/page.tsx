import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import FormularioEditar from './FormularioEditar'

export default async function EditarAnuncioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=/publicar/${id}`)

  const { data: anuncio } = await supabase
    .from('anuncios')
    .select('*, imagenes_anuncio(*)')
    .eq('id', id)
    .single()

  if (!anuncio) notFound()
  if (anuncio.user_id !== user.id) redirect('/perfil')

  const imagenes = (anuncio.imagenes_anuncio ?? []).sort(
    (a: { orden: number }, b: { orden: number }) => a.orden - b.orden
  )

  return (
    <div className="max-w-2xl mx-auto">
      <FormularioEditar anuncio={{ ...anuncio, imagenes_anuncio: imagenes }} />
    </div>
  )
}

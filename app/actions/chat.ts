'use server'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { emailNuevoMensaje } from '@/lib/email'

export async function crearOAbrirConversacion(anuncioId: string, arrendadorId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=/habitaciones/${anuncioId}`)

  // Buscar conversación existente entre este inquilino y este anuncio
  const { data: existing } = await supabase
    .from('conversaciones')
    .select('id')
    .eq('anuncio_id', anuncioId)
    .eq('inquilino_id', user.id)
    .single()

  if (existing) redirect(`/chat/${existing.id}`)

  // Crear nueva conversación
  const { data: nueva, error } = await supabase
    .from('conversaciones')
    .insert({ anuncio_id: anuncioId, inquilino_id: user.id, arrendador_id: arrendadorId })
    .select('id')
    .single()

  if (error || !nueva) redirect(`/habitaciones/${anuncioId}`)

  redirect(`/chat/${nueva.id}`)
}

export async function enviarMensaje(conversacionId: string, contenido: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const texto = contenido.trim()
  if (!texto) return { error: 'Mensaje vacío' }

  // Insertar mensaje
  const { error } = await supabase
    .from('mensajes')
    .insert({ conversacion_id: conversacionId, sender_id: user.id, contenido: texto })

  if (error) return { error: error.message }

  // Email diferido — nunca bloquea ni rompe el envío del mensaje
  try {
    after(async () => {
      try {
        const { data: conv } = await supabase
          .from('conversaciones')
          .select('inquilino_id, arrendador_id, anuncio:anuncios(titulo)')
          .eq('id', conversacionId)
          .single()

        if (!conv) return

        const destinatarioId = conv.arrendador_id === user.id ? conv.inquilino_id : conv.arrendador_id

        // Solo enviamos email si el destinatario no tiene ya mensajes sin leer en esta conv
        const { count } = await supabase
          .from('mensajes')
          .select('id', { count: 'exact', head: true })
          .eq('conversacion_id', conversacionId)
          .eq('leido', false)
          .neq('sender_id', user.id)

        if ((count ?? 0) > 1) return

        const [{ data: destProfile }, { data: remProfile }] = await Promise.all([
          supabase.from('profiles').select('nombre').eq('id', destinatarioId).single(),
          supabase.from('profiles').select('nombre').eq('id', user.id).single(),
        ])

        const { data: destAuth } = await supabase.auth.admin.getUserById(destinatarioId)
        const destEmail = destAuth?.user?.email
        if (!destEmail) return

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tituloAnuncio = (conv.anuncio as any)?.titulo ?? 'Habitación en Andorra'

        await emailNuevoMensaje({
          destinatarioEmail: destEmail,
          destinatarioNombre: destProfile?.nombre ?? 'Usuario',
          remitenteNombre: remProfile?.nombre ?? 'Alguien',
          tituloAnuncio,
          extractoMensaje: texto,
          conversacionId,
        })
      } catch { /* silent */ }
    })
  } catch { /* after() no disponible — ignorar */ }

  return { ok: true }
}

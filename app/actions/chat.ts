'use server'

import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
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

  // Enviar email de notificación al destinatario (sin bloquear la respuesta)
  try {
    after(async () => {
      // Obtener datos de la conversación
      const { data: conv } = await supabase
        .from('conversaciones')
        .select('inquilino_id, arrendador_id, anuncios(titulo)')
        .eq('id', conversacionId)
        .single()

      if (!conv) return

      // El destinatario es quien NO envió el mensaje
      const destinatarioId = user.id === conv.inquilino_id
        ? conv.arrendador_id
        : conv.inquilino_id

      if (!destinatarioId) return

      // Obtener email del destinatario con el cliente admin (service role)
      const adminClient = createAdminClient()
      const { data: { user: destinatario } } = await adminClient.auth.admin.getUserById(destinatarioId)
      if (!destinatario?.email) return

      // Obtener nombre del remitente y destinatario desde profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nombre')
        .in('id', [user.id, destinatarioId])

      const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.nombre ?? 'Usuario']))
      const remitenteNombre = profileMap[user.id] ?? 'Usuario'
      const destinatarioNombre = profileMap[destinatarioId] ?? 'Usuario'

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tituloAnuncio = (conv.anuncios as any)?.titulo ?? 'Habitación en Andorra'

      await emailNuevoMensaje({
        destinatarioEmail: destinatario.email,
        destinatarioNombre,
        remitenteNombre,
        tituloAnuncio,
        extractoMensaje: texto,
        conversacionId,
      })
    })
  } catch {
    // after() puede no estar disponible en algunos entornos
  }

  return { ok: true }
}

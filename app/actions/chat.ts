'use server'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
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

  // Email diferido — se ejecuta tras enviar la respuesta al cliente
  after(async () => {
    try {
      // Necesita SUPABASE_SERVICE_ROLE_KEY para acceder al email del destinatario
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!serviceKey) return

      const admin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
      )

      const { data: conv } = await admin
        .from('conversaciones')
        .select('inquilino_id, arrendador_id, anuncio:anuncios(titulo)')
        .eq('id', conversacionId)
        .single()

      if (!conv) return

      const destinatarioId = conv.arrendador_id === user.id ? conv.inquilino_id : conv.arrendador_id

      const { count } = await admin
        .from('mensajes')
        .select('id', { count: 'exact', head: true })
        .eq('conversacion_id', conversacionId)
        .eq('leido', false)
        .neq('sender_id', user.id)

      if ((count ?? 0) > 1) return

      const [{ data: destProfile }, { data: remProfile }] = await Promise.all([
        admin.from('profiles').select('nombre').eq('id', destinatarioId).single(),
        admin.from('profiles').select('nombre').eq('id', user.id).single(),
      ])

      const { data: destAuth } = await admin.auth.admin.getUserById(destinatarioId)
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
    } catch { /* silent — el email nunca rompe el envío */ }
  })

  return { ok: true }
}

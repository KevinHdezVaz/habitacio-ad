'use server'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

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

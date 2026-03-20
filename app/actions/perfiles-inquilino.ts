'use server'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import type { TipoBusqueda, SituacionLaboral, SexoPerfil } from '@/types'

export type DatosPerfilInquilino = {
  tipo_busqueda: TipoBusqueda
  parroquias: string[]
  presupuesto_max: number
  fecha_entrada: string
  fecha_salida: string | null
  nombre: string
  edad: number
  sexo: SexoPerfil | null
  situacion: SituacionLaboral
  sector: string
  fumador: boolean
  mascotas: boolean
  acompanado: boolean
  descripcion: string
}

function fechaCaducidad30dias() {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString()
}

export async function publicarPerfilInquilino(datos: DatosPerfilInquilino) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/buscar-habitacion')

  // Verificar si ya tiene un perfil activo o caducado
  const { data: existente } = await supabase
    .from('perfiles_inquilino')
    .select('id')
    .eq('user_id', user.id)
    .neq('estado', 'oculto')
    .single()

  if (existente) {
    return { error: 'Ya tienes un perfil publicado. Edítalo desde tu panel.' }
  }

  const ahora = new Date().toISOString()
  const { data, error } = await supabase
    .from('perfiles_inquilino')
    .insert({
      ...datos,
      user_id: user.id,
      estado: 'activo',
      destacado: false,
      fecha_publicacion: ahora,
      fecha_caducidad: fechaCaducidad30dias(),
    })
    .select('id')
    .single()

  if (error || !data) {
    return { error: error?.message ?? 'Error al publicar el perfil.' }
  }

  return { ok: true, id: data.id }
}

export async function reactivarPerfilInquilino(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const ahora = new Date().toISOString()
  const { error } = await supabase
    .from('perfiles_inquilino')
    .update({
      estado: 'activo',
      fecha_publicacion: ahora,
      fecha_caducidad: fechaCaducidad30dias(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return { ok: true }
}

export async function marcarPerfilCaducado(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false }

  await supabase
    .from('perfiles_inquilino')
    .update({ estado: 'caducado' })
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('estado', 'activo') // solo si estaba activo, para no sobreescribir oculto

  return { ok: true }
}

export async function ocultarPerfilInquilino(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('perfiles_inquilino')
    .update({ estado: 'oculto' })
    .eq('id', id)
    .eq('user_id', user.id)

  return { ok: true }
}

export async function actualizarPerfilInquilino(id: string, datos: Partial<DatosPerfilInquilino>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('perfiles_inquilino')
    .update(datos)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return { ok: true }
}

export async function eliminarPerfilInquilino(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('perfiles_inquilino')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return { ok: true }
}

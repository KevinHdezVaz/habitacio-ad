'use server'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import type { TipoBusqueda, SituacionLaboral } from '@/types'

export type DatosPerfilInquilino = {
  tipo_busqueda: TipoBusqueda
  parroquias: string[]
  presupuesto_max: number
  fecha_entrada: string
  fecha_salida: string | null
  nombre: string
  edad: number
  situacion: SituacionLaboral
  sector: string
  fumador: boolean
  mascotas: boolean
  acompanado: boolean
  descripcion: string
}

export async function publicarPerfilInquilino(datos: DatosPerfilInquilino) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/buscar-habitacion')

  const { data, error } = await supabase
    .from('perfiles_inquilino')
    .insert({
      ...datos,
      user_id: user.id,
      estado: 'activo',
      destacado: false,
    })
    .select('id')
    .single()

  if (error || !data) {
    return { error: error?.message ?? 'Error al publicar el perfil.' }
  }

  return { ok: true, id: data.id }
}

export async function desactivarPerfilInquilino(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('perfiles_inquilino')
    .update({ estado: 'inactivo' })
    .eq('id', id)
    .eq('user_id', user.id)

  return { ok: true }
}

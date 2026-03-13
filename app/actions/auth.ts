'use server'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    return { error: error.message }
  }

  const next = formData.get('next') as string | null
  redirect(next ?? '/')
}

export async function registro(formData: FormData) {
  const supabase = await createClient()

  const nombre   = formData.get('nombre')   as string
  const email    = formData.get('email')    as string
  const password = formData.get('password') as string
  const telefono = ((formData.get('telefono') as string) ?? '').trim()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nombre } },
  })

  if (error) {
    return { error: error.message }
  }

  // Crear perfil vinculado al usuario
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      nombre,
      tipo: 'inquilino',
      ...(telefono ? { telefono } : {}),
    })
  }

  // Iniciar sesión automáticamente tras el registro.
  // Supabase puede tener confirmación de email activada, en cuyo caso
  // signInWithPassword fallará — en ese caso redirigimos igual y el
  // usuario verá el estado de "no logueado" hasta que confirme el email.
  // Para MVP: desactivar "Enable email confirmations" en Supabase Dashboard
  // → Authentication → Email → Email confirmations: OFF
  await supabase.auth.signInWithPassword({ email, password })

  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

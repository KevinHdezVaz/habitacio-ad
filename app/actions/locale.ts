'use server'

import { cookies } from 'next/headers'

export async function setLocale(locale: string) {
  const validLocales = ['es', 'ca']
  if (!validLocales.includes(locale)) return

  const cookieStore = await cookies()
  cookieStore.set('NEXT_LOCALE', locale, {
    maxAge: 365 * 24 * 60 * 60, // 1 año
    path: '/',
    sameSite: 'lax',
  })
}

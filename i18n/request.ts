import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

const LOCALES = ['ca', 'ca'] as const
export type Locale = (typeof LOCALES)[number]

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const raw = cookieStore.get('NEXT_LOCALE')?.value ?? 'ca'
  const locale: Locale = (LOCALES as readonly string[]).includes(raw)
    ? (raw as Locale)
    : 'ca'

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})

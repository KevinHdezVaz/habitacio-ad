'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { registro } from '@/app/actions/auth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import BotonGoogle from '@/components/auth/BotonGoogle'
import Link from 'next/link'

export default function RegistroPage() {
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const t = useTranslations('auth')

  async function handleSubmit(formData: FormData) {
    const password  = formData.get('password') as string
    const confirmar = formData.get('confirmar') as string

    if (password !== confirmar) {
      setError(t('passwordMismatch'))
      return
    }
    if (password.length < 8) {
      setError(t('passwordTooShort'))
      return
    }

    setLoading(true)
    setError(null)
    const result = await registro(formData)
    if (result?.error) {
      setError(
        result.error.includes('already registered')
          ? t('emailAlreadyRegistered')
          : result.error
      )
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#1a3c5e]">{t('registerTitle')}</h1>
        <p className="text-[#6b7280] text-sm mt-2">{t('registerSubtitle')}</p>
      </div>

      <BotonGoogle next="/" />

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-[#9ca3af] font-medium">{t('orWithEmail')}</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <form action={handleSubmit} className="flex flex-col gap-5">
        <Input
          label={t('fullName')}
          name="nombre"
          placeholder={t('namePlaceholder')}
          type="text"
          autoComplete="name"
          required
        />
        <Input
          label={t('email')}
          name="email"
          placeholder={t('emailPlaceholder')}
          type="email"
          autoComplete="email"
          required
        />
        <Input
          label={t('password')}
          name="password"
          placeholder={t('minPassword')}
          type="password"
          autoComplete="new-password"
          required
        />
        <Input
          label={t('confirmPassword')}
          name="confirmar"
          placeholder={t('repeatPassword')}
          type="password"
          autoComplete="new-password"
          required
        />

        {error && (
          <p className="text-red-500 text-sm bg-red-50 py-2 px-3 rounded-xl text-center">{error}</p>
        )}

        <div className="flex items-start gap-2 mt-1">
          <input type="checkbox" id="terms" className="mt-1 accent-[#1a3c5e]" required />
          <label htmlFor="terms" className="text-xs text-[#6b7280] leading-normal">
            {t('acceptTerms')}{' '}
            <Link href="/aviso-legal" className="text-[#0ea5a0] font-semibold">{t('termsLink')}</Link>
            {' '}{t('andThe')}{' '}
            <Link href="/privacidad" className="text-[#0ea5a0] font-semibold">{t('privacyLink')}</Link>.
          </label>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          {loading ? t('creatingAccount') : t('createAccount')}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-[#6b7280]">
          {t('alreadyHaveAccount')}{' '}
          <Link href="/login" className="font-bold text-[#1a3c5e] hover:text-[#0ea5a0]">
            {t('signIn')}
          </Link>
        </p>
      </div>
    </div>
  )
}

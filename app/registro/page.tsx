'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { registro } from '@/app/actions/auth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PhoneInput from '@/components/ui/PhoneInput'
import Spinner from '@/components/ui/Spinner'
import BotonGoogle from '@/components/auth/BotonGoogle'
import Link from 'next/link'

export default function RegistroPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const t = useTranslations('auth')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const password = formData.get('password') as string
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

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center flex flex-col gap-2 mb-4">
        <p className="text-sm font-semibold text-blue-800">Registro temporalmente deshabilitado</p>
        <p className="text-xs text-blue-700">Estamos en fase inicial: ya puedes publicar tu habitación gratis.</p>
      </div>

      <div className="opacity-40 pointer-events-none select-none">
        <BotonGoogle next="/" />

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-[#9ca3af] font-medium">{t('orWithEmail')}</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Overlay de carga */}
        {loading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <Spinner size="md" color="blue" />
            <p className="mt-3 text-sm font-semibold text-[#1a3c5e]">{t('creatingAccount')}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

          {/* Teléfono opcional */}
          <div className="flex flex-col gap-1.5">
            <PhoneInput
              label={t('phone')}
              name="telefono"
              placeholder="600 000"
            />
            <p className="text-[11px] text-[#9ca3af] ml-1">{t('phoneHint')}</p>
          </div>

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

          <Button type="submit" className="w-full" loading={loading} disabled={loading}>
            {loading ? t('creatingAccount') : t('createAccount')}
          </Button>
        </form>
      </div>{/* end disabled wrapper */}

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

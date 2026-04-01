'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { login } from '@/app/actions/auth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'
import BotonGoogle from '@/components/auth/BotonGoogle'
import Link from 'next/link'

function LoginForm() {
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? ''
  const oauthError = searchParams.get('error') === 'oauth'
  const t = useTranslations('auth')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setLoading(true)
    setError(null)
    if (next) formData.set('next', next)
    const result = await login(formData)
    if (result?.error) {
      setError(
        result.error === 'Invalid login credentials'
          ? t('invalidCredentials')
          : result.error
      )
      setLoading(false)
    }
  }

  return (
    <>
      {/* Overlay de carga */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <Spinner size="md" color="blue" />
          <p className="mt-3 text-sm font-semibold text-[#1a3c5e]">{t('loggingIn')}</p>
        </div>
      )}

      <BotonGoogle next={next || '/'} />

      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-[#9ca3af] font-medium">{t('orWithEmail')}</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {oauthError && (
        <p className="text-red-500 text-sm bg-red-50 py-2 px-3 rounded-xl text-center">
          {t('googleError')}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
          placeholder={t('passwordPlaceholder')}
          type="password"
          autoComplete="current-password"
          required
        />

        {error && (
          <p className="text-red-500 text-sm bg-red-50 py-2 px-3 rounded-xl text-center">{error}</p>
        )}

        <div className="flex justify-end">
          <Link href="/recuperar" className="text-xs font-semibold text-[#0ea5a0] hover:underline">
            {t('forgotPassword')}
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={loading} disabled={loading}>
          {loading ? t('loggingIn') : t('login')}
        </Button>
      </form>
    </>
  )
}

export default function LoginPage() {
  const t = useTranslations('auth')

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#1a3c5e]">{t('loginTitle')}</h1>
        <p className="text-[#6b7280] text-sm mt-2">{t('loginSubtitle')}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center flex flex-col gap-2 mb-4">
        <p className="text-sm font-semibold text-amber-800">Acceso temporalmente deshabilitado</p>
        <p className="text-xs text-amber-700">Habitacio.ad todavía no está habilitada hasta el lanzamiento oficial. Vuelve pronto.</p>
      </div>

      <div className="opacity-40 pointer-events-none select-none">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-[#6b7280]">
          {t('noAccount')}{' '}
          <Link href="/registro" className="font-bold text-[#1a3c5e] hover:text-[#0ea5a0]">
            {t('registerFree')}
          </Link>
        </p>
      </div>
    </div>
  )
}

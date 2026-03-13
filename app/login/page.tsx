'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { login } from '@/app/actions/auth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import BotonGoogle from '@/components/auth/BotonGoogle'
import Link from 'next/link'

function LoginForm() {
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? ''
  const oauthError = searchParams.get('error') === 'oauth'

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    if (next) formData.set('next', next)
    const result = await login(formData)
    if (result?.error) {
      setError(
        result.error === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos.'
          : result.error
      )
      setLoading(false)
    }
  }

  return (
    <>
      {/* Google */}
      <BotonGoogle next={next || '/'} />

      {/* Separador */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-[#9ca3af] font-medium">o con email</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Error OAuth */}
      {oauthError && (
        <p className="text-red-500 text-sm bg-red-50 py-2 px-3 rounded-xl text-center">
          Error al iniciar sesión con Google. Inténtalo de nuevo.
        </p>
      )}

      <form action={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Email"
          name="email"
          placeholder="tu@email.com"
          type="email"
          autoComplete="email"
          required
        />
        <Input
          label="Contraseña"
          name="password"
          placeholder="••••••••"
          type="password"
          autoComplete="current-password"
          required
        />

        {error && (
          <p className="text-red-500 text-sm bg-red-50 py-2 px-3 rounded-xl text-center">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <Link href="/recuperar" className="text-xs font-semibold text-[#0ea5a0] hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Iniciar sesión'}
        </Button>
      </form>
    </>
  )
}

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#1a3c5e]">Bienvenido de nuevo</h1>
        <p className="text-[#6b7280] text-sm mt-2">Accede a tu cuenta de Habitacio.ad</p>
      </div>

      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-[#6b7280]">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="font-bold text-[#1a3c5e] hover:text-[#0ea5a0]">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}

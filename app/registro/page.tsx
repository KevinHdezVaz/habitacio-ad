'use client'

import { useState } from 'react'
import { registro } from '@/app/actions/auth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Link from 'next/link'

export default function RegistroPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    const password = formData.get('password') as string
    const confirmar = formData.get('confirmar') as string

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setLoading(true)
    setError(null)
    const result = await registro(formData)
    if (result?.error) {
      setError(
        result.error.includes('already registered')
          ? 'Este email ya tiene una cuenta. Inicia sesión.'
          : result.error
      )
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#1a3c5e]">Crea tu cuenta</h1>
        <p className="text-[#6b7280] text-sm mt-2">Únete a la comunidad de Habitacio.ad</p>
      </div>

      <form action={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Nombre completo"
          name="nombre"
          placeholder="Ej: Marc Ferrer"
          type="text"
          autoComplete="name"
          required
        />
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
          placeholder="Mínimo 8 caracteres"
          type="password"
          autoComplete="new-password"
          required
        />
        <Input
          label="Confirmar contraseña"
          name="confirmar"
          placeholder="Repite tu contraseña"
          type="password"
          autoComplete="new-password"
          required
        />

        {error && (
          <p className="text-red-500 text-sm bg-red-50 py-2 px-3 rounded-xl text-center">
            {error}
          </p>
        )}

        <div className="flex items-start gap-2 mt-1">
          <input type="checkbox" id="terms" className="mt-1 accent-[#1a3c5e]" required />
          <label htmlFor="terms" className="text-xs text-[#6b7280] leading-normal">
            Acepto los{' '}
            <Link href="/aviso-legal" className="text-[#0ea5a0] font-semibold">Términos y Condiciones</Link>
            {' '}y la{' '}
            <Link href="/privacidad" className="text-[#0ea5a0] font-semibold">Política de Privacidad</Link>.
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-[#6b7280]">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-bold text-[#1a3c5e] hover:text-[#0ea5a0]">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

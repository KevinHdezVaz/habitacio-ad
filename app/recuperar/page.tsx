'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

export default function RecuperarPage() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/recuperar/nueva-contrasena`,
    })

    setLoading(false)
    if (err) {
      setError('No pudimos enviar el correo. Verifica la dirección e inténtalo de nuevo.')
    } else {
      setEnviado(true)
    }
  }

  if (enviado) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#e6f7f7] to-[#f0fafa] flex items-center justify-center text-4xl shadow-sm">
            📬
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a3c5e]">Revisa tu correo</h1>
            <p className="text-[#6b7280] text-sm mt-2 leading-relaxed">
              Te hemos enviado un enlace a <span className="font-semibold text-[#1a3c5e]">{email}</span> para restablecer tu contraseña.
            </p>
            <p className="text-xs text-[#9ca3af] mt-3">
              Si no lo ves en unos minutos, revisa tu carpeta de spam.
            </p>
          </div>
          <Link
            href="/login"
            className="text-sm font-semibold text-[#0ea5a0] hover:underline"
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a3c5e] to-[#2d5a8e] flex items-center justify-center text-2xl mx-auto mb-4 shadow-md">
            🔑
          </div>
          <h1 className="text-2xl font-bold text-[#1a3c5e]">Recuperar contraseña</h1>
          <p className="text-[#6b7280] text-sm mt-2">
            Introduce tu email y te enviaremos un enlace para crear una nueva contraseña.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#1a3c5e] ml-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              autoFocus
              className="px-4 py-3.5 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              <span className="text-lg">⚠️</span>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a3c5e] to-[#2d5a8e] text-white font-bold py-3.5 rounded-2xl hover:from-[#152e4a] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                </svg>
                Enviando…
              </>
            ) : 'Enviar enlace de recuperación'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <Link href="/login" className="text-sm text-[#6b7280] hover:text-[#1a3c5e] font-medium transition-colors">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

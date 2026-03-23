'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cambiarTipoUsuario } from '@/app/actions/admin'

const badgeTipo: Record<string, string> = {
  arrendador: 'bg-blue-100 text-blue-700',
  inquilino:  'bg-teal-100 text-teal-700',
  admin:      'bg-purple-100 text-purple-700',
}

export default function CambiarTipoUsuario({
  userId,
  tipoActual,
}: {
  userId: string
  tipoActual: string
}) {
  const router                = useRouter()
  const t                     = useTranslations('admin')
  const [tipo, setTipo]       = useState(tipoActual)
  const [loading, setLoading] = useState(false)

  const labelTipo: Record<string, string> = {
    inquilino:  t('typeInquilino'),
    arrendador: t('typeArrendador'),
    admin:      t('typeAdmin'),
  }

  async function handleChange(nuevoTipo: string) {
    if (nuevoTipo === tipo) return
    setLoading(true)
    const res = await cambiarTipoUsuario(userId, nuevoTipo)
    if (!res.error) {
      setTipo(nuevoTipo)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shrink-0 ${badgeTipo[tipo] ?? 'bg-gray-100 text-gray-600'}`}>
        {labelTipo[tipo] ?? tipo}
      </span>
      <select
        value={tipo}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="text-xs rounded-lg border border-gray-200 px-2 py-1.5 focus:outline-none focus:border-[#0ea5a0] bg-white text-[#374151] disabled:opacity-40 cursor-pointer"
      >
        <option value="inquilino">{t('typeInquilino')}</option>
        <option value="arrendador">{t('typeArrendador')}</option>
        <option value="admin">{t('typeAdmin')}</option>
      </select>
    </div>
  )
}

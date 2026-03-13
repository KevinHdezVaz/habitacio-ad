'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { setLocale } from '@/app/actions/locale'

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleChange(locale: string) {
    startTransition(async () => {
      await setLocale(locale)
      router.refresh()
    })
  }

  return (
    <div className={`flex items-center gap-0.5 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
      {(['es', 'ca'] as const).map((l) => (
        <button
          key={l}
          onClick={() => handleChange(l)}
          className={`text-xs font-bold px-2 py-1 rounded-lg transition-colors ${
            currentLocale === l
              ? 'bg-[#0ea5a0] text-white'
              : 'text-[#6b7280] hover:text-[#1a3c5e]'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const t = useTranslations('cookies')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  function aceptar() {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  function rechazar() {
    localStorage.setItem('cookie-consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4">
      <div className="max-w-2xl mx-auto bg-[#1a3c5e] text-white rounded-2xl shadow-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm leading-relaxed flex-1 text-gray-200">
          {t('message')}{' '}
          <Link href="/cookies" className="underline underline-offset-2 text-white font-medium">
            {t('moreInfo')}
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={rechazar}
            className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-xl"
          >
            {t('reject')}
          </button>
          <button
            onClick={aceptar}
            className="text-sm font-semibold bg-white text-[#1a3c5e] px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  )
}

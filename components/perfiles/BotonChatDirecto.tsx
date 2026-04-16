'use client'

import { iniciarChatDirecto } from '@/app/actions/chat'
import { useTransition } from 'react'

export default function BotonChatDirecto({ userId, label }: { userId: string; label: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => iniciarChatDirecto(userId))}
      disabled={pending}
      className="flex items-center justify-center gap-2 bg-[#1a3c5e] text-white rounded-xl px-4 py-3 text-sm font-bold hover:bg-[#0ea5a0] transition-colors w-full disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
    >
      {pending ? (
        <>
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Abriendo chat...
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  )
}

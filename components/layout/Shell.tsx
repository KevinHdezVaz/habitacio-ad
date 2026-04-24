'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

interface ShellProps {
  children: ReactNode
  navbar: ReactNode
  footer: ReactNode
  launchBanner: ReactNode
  cookieBanner: ReactNode
  popup: ReactNode
}

export default function Shell({ children, navbar, footer, launchBanner, cookieBanner, popup }: ShellProps) {
  const pathname = usePathname()
  const isMaintenance = pathname === '/mantenimiento'

  if (isMaintenance) {
    return <>{children}</>
  }

  return (
    <>
      {launchBanner}
      {navbar}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
      {footer}
      {cookieBanner}
      {popup}
    </>
  )
}

import { getTranslations } from 'next-intl/server'

export default async function MantenimientoPage() {
  const t = await getTranslations('maintenance')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2744] via-[#1a3c5e] to-[#0e7490] px-4">
      <div className="max-w-sm w-full text-center flex flex-col items-center gap-8">

        {/* Icono genérico */}
        <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center shadow-xl">
          <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
            <path d="M6 32V18L20 6l14 12v14a2 2 0 01-2 2H8a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 38V24h10v14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Texto */}
        <div className="flex flex-col gap-3">
          <h1 className="text-white text-2xl font-bold leading-snug">
            {t('title')}
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">
            {t('subtitle')}
          </p>
        </div>


      </div>
    </div>
  )
}

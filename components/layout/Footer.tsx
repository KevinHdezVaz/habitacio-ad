import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function Footer() {
  const t = await getTranslations('footer')

  return (
    <footer className="bg-[#1a3c5e] text-white mt-20 py-12">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="Habitacio.ad" className="h-10 w-auto rounded-xl" />
            <span className="font-bold text-xl">Habitacio.ad</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">{t('exploreTitle')}</h3>
          <nav className="flex flex-col gap-3 text-sm text-gray-400">
            <Link href="/habitaciones" className="hover:text-[#0ea5a0] transition-colors">{t('searchRoom')}</Link>
            <Link href="/perfiles" className="hover:text-[#0ea5a0] transition-colors">{t('viewProfiles')}</Link>
            <Link href="/publicar" className="hover:text-[#0ea5a0] transition-colors">{t('publishAd')}</Link>
            <Link href="/perfil" className="hover:text-[#0ea5a0] transition-colors">{t('myProfile')}</Link>
          </nav>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">{t('legalTitle')}</h3>
          <nav className="flex flex-col gap-3 text-sm text-gray-400">
            <Link href="/preguntas-frecuentes" className="hover:text-[#0ea5a0] transition-colors">{t('faq')}</Link>
            <Link href="/aviso-legal" className="hover:text-[#0ea5a0] transition-colors">{t('legalNotice')}</Link>
            <Link href="/privacidad" className="hover:text-[#0ea5a0] transition-colors">{t('privacyPolicy')}</Link>
            <Link href="/cookies" className="hover:text-[#0ea5a0] transition-colors">{t('cookiesPolicy')}</Link>
            <Link href="/contacto" className="hover:text-[#0ea5a0] transition-colors">{t('contact')}</Link>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-12 pt-8 border-t border-gray-700 text-center text-xs text-gray-500">
        <p>{t('copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  )
}

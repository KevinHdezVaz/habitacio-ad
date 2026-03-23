import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Contacto — Habitacio.ad',
  description: 'Contacta con el equipo de Habitacio.ad.',
}

export default async function ContactoPage() {
  const locale = await getLocale()
  const ca = locale === 'ca'

  return (
    <div className="max-w-xl mx-auto py-10 flex flex-col gap-8">

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#1a3c5e]">
          {ca ? 'Contacte' : 'Contacto'}
        </h1>
        <p className="text-sm text-[#6b7280]">
          {ca
            ? "Tens alguna pregunta, suggeriment o problema? Escriu-nos i et respondrem tan aviat com puguem."
            : "¿Tienes alguna duda, sugerencia o problema? Escríbenos y te responderemos lo antes posible."}
        </p>
      </div>

      {/* Canales directos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a href="mailto:hola@habitacio.ad" className="flex items-center gap-3 bg-[#eef2f8] border border-[#c7d4e8] rounded-2xl px-4 py-3 hover:bg-[#e0e8f4] transition-colors">
          <div className="w-9 h-9 bg-[#1a3c5e] rounded-xl flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>
          <div>
            <p className="text-xs text-[#9ca3af] font-medium">Email</p>
            <p className="text-sm font-semibold text-[#1a3c5e]">hola@habitacio.ad</p>
          </div>
        </a>

        <div className="flex items-center gap-3 bg-[#f4f5f7] border border-gray-100 rounded-2xl px-4 py-3">
          <div className="w-9 h-9 bg-[#1a3c5e] rounded-xl flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <p className="text-xs text-[#9ca3af] font-medium">
              {ca ? 'Temps de resposta' : 'Tiempo de respuesta'}
            </p>
            <p className="text-sm font-semibold text-[#1a3c5e]">
              {ca ? 'Menys de 24 hores' : 'Menos de 24 horas'}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario — próximamente */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 bg-[#eef2f8] rounded-2xl flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1a3c5e" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9ca3af]">
            {ca ? 'Properament' : 'Próximamente'}
          </span>
          <p className="font-bold text-[#1a3c5e] text-lg">
            {ca ? 'Formulari de contacte' : 'Formulario de contacto'}
          </p>
          <p className="text-sm text-[#6b7280]">
            {ca
              ? <span>Estem preparant el formulari. De moment pots escriure&apos;ns directament a <a href="mailto:hola@habitacio.ad" className="text-[#1a3c5e] font-semibold underline underline-offset-2">hola@habitacio.ad</a>.</span>
              : <span>Estamos preparando el formulario. De momento puedes escribirnos directamente a <a href="mailto:hola@habitacio.ad" className="text-[#1a3c5e] font-semibold underline underline-offset-2">hola@habitacio.ad</a>.</span>}
          </p>
        </div>
      </div>

    </div>
  )
}

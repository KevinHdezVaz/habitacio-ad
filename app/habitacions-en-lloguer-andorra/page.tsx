import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import TarjetaHabitacion from '@/components/habitaciones/TarjetaHabitacion'
import type { Anuncio } from '@/types'

export const metadata: Metadata = {
  title: 'Habitacions en lloguer a Andorra | habitacio.ad',
  description: 'Troba habitacions en lloguer a Andorra de manera més clara, ràpida i ordenada. Consulta opcions disponibles o publica la teva habitació a habitacio.ad.',
  alternates: {
    canonical: 'https://habitacio.ad/habitacions-en-lloguer-andorra',
  },
  openGraph: {
    title: 'Habitacions en lloguer a Andorra | habitacio.ad',
    description: 'Troba habitacions en lloguer a Andorra de manera més clara, ràpida i ordenada.',
    url: 'https://habitacio.ad/habitacions-en-lloguer-andorra',
  },
}

const FAQS = [
  {
    q: 'Com puc buscar una habitació a Andorra?',
    a: 'A habitacio.ad pots veure tots els anuncis disponibles, filtrar per parròquia, pressupost i tipus d\'estada (anual o temporera) i contactar directament amb el propietari des de la plataforma.',
  },
  {
    q: 'És gratis publicar una habitació a habitacio.ad?',
    a: 'Sí, publicar una habitació és completament gratuït. Pots crear el teu anunci en pocs minuts i rebre contactes d\'inquilins interessats.',
  },
  {
    q: 'Puc buscar habitació per temporada a Andorra?',
    a: 'Sí. La plataforma diferencia entre habitacions d\'estada anual i habitacions per a temporers (temporada d\'esquí, estiu, etc.). Pots filtrar directament per aquest criteri.',
  },
  {
    q: 'Què puc fer si no trobo cap habitació que encaixi amb mi?',
    a: 'Pots crear el teu perfil d\'inquilí indicant el que busques —pressupost, parròquia, dates— perquè els propietaris et puguin trobar i contactar directament.',
  },
  {
    q: 'Puc publicar el meu perfil si soc jo qui busca habitació?',
    a: 'Sí. A la secció "Troba\'m habitació" pots crear un perfil públic com a inquilí. Quan un propietari tingui una habitació que encaixi amb el que busques, et contactarà ell directament.',
  },
]

export default async function HabitacionsLloguerAndorraPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('anuncios')
    .select('*, imagenes_anuncio(*)')
    .eq('estado', 'activo')
    .order('destacado', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(9)

  const anuncios: Anuncio[] = data ?? []

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto">

      {/* 1 · H1 + intro */}
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-[#1a3c5e]">
          Habitacions en lloguer a Andorra
        </h1>
        <p className="text-[#374151] text-base leading-relaxed max-w-2xl">
          Si busques habitacions en lloguer a Andorra, aquí pots veure opcions disponibles de manera més clara i ordenada.
          Consulta els anuncis publicats, filtra segons el que necessites i, si no trobes encaix,{' '}
          <Link href="/buscar-habitacion" className="text-[#0ea5a0] font-medium hover:underline">
            crea el teu perfil perquè et puguin contactar
          </Link>.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/habitaciones"
            className="inline-flex items-center gap-2 bg-[#1a3c5e] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0ea5a0] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            Veure tots els anuncis
          </Link>
          <Link
            href="/habitaciones?tipo_estancia=temporero"
            className="inline-flex items-center gap-2 border border-[#1a3c5e] text-[#1a3c5e] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#eef2f8] transition-colors"
          >
            Temporada
          </Link>
          <Link
            href="/habitaciones?tipo_estancia=anual"
            className="inline-flex items-center gap-2 border border-[#1a3c5e] text-[#1a3c5e] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#eef2f8] transition-colors"
          >
            Tot l&apos;any
          </Link>
        </div>
      </div>

      {/* 2 · Listado de habitaciones */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1a3c5e]">
            Habitacions disponibles ara
            <span className="ml-2 text-sm font-normal text-[#6b7280]">({anuncios.length} anuncis)</span>
          </h2>
          <Link href="/habitaciones" className="text-sm text-[#0ea5a0] font-semibold hover:underline">
            Veure-les totes →
          </Link>
        </div>

        {anuncios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {anuncios.map((anuncio) => (
              <TarjetaHabitacion key={anuncio.id} anuncio={anuncio} />
            ))}
          </div>
        ) : (
          <div className="bg-[#f8fafc] rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-[#6b7280] text-sm">Ara mateix no hi ha habitacions publicades.</p>
            <Link href="/buscar-habitacion" className="mt-3 inline-block text-sm font-semibold text-[#0ea5a0] hover:underline">
              Crea el teu perfil i que et trobin →
            </Link>
          </div>
        )}
      </div>

      {/* 3 · Texto de apoyo */}
      <div className="bg-[#f8fafc] rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[#1a3c5e]">Com funciona la cerca?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              n: '1',
              title: 'Consulta els anuncis',
              text: 'Explora les habitacions disponibles i filtra per parròquia, pressupost, tipus d\'estada i molt més.',
            },
            {
              n: '2',
              title: 'Contacta el propietari',
              text: 'Escriu directament des de la plataforma. Sense intermediaris, sense formularis complicats.',
            },
            {
              n: '3',
              title: 'Crea el teu perfil',
              text: 'Si no trobes res, publica el teu perfil d\'inquilí perquè els propietaris et puguin trobar.',
            },
          ].map(({ n, title, text }) => (
            <div key={n} className="flex flex-col gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1a3c5e] text-white text-sm font-bold flex items-center justify-center">
                {n}
              </div>
              <p className="font-semibold text-[#1a3c5e] text-sm">{title}</p>
              <p className="text-[#6b7280] text-xs leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-3 text-xs text-[#6b7280]">
          <span>📍 Filtra per: <Link href="/habitaciones?parroquia=Andorra+la+Vella" className="text-[#1a3c5e] hover:underline">Andorra la Vella</Link></span>
          <span>·</span>
          <span><Link href="/habitaciones?parroquia=Escaldes-Engordany" className="text-[#1a3c5e] hover:underline">Escaldes-Engordany</Link></span>
          <span>·</span>
          <span><Link href="/habitaciones?parroquia=Encamp" className="text-[#1a3c5e] hover:underline">Encamp</Link></span>
          <span>·</span>
          <span><Link href="/habitaciones?parroquia=La+Massana" className="text-[#1a3c5e] hover:underline">La Massana</Link></span>
          <span>·</span>
          <span><Link href="/habitaciones?parroquia=Sant+Juli%C3%A0+de+L%C3%B2ria" className="text-[#1a3c5e] hover:underline">Sant Julià de Lòria</Link></span>
        </div>
      </div>

      {/* 4 · CTA Publicar habitación */}
      <div className="bg-[#1a3c5e] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="flex-1 text-white">
          <h2 className="text-lg font-bold">Tens una habitació per llogar?</h2>
          <p className="text-sm text-blue-200 mt-1">
            Publica el teu anunci gratis en menys de 5 minuts i arriba a inquilins que busquen a Andorra ara mateix.
          </p>
        </div>
        <Link
          href="/publicar"
          className="shrink-0 bg-white text-[#1a3c5e] font-bold px-5 py-3 rounded-xl text-sm hover:bg-[#e6f7f7] transition-colors whitespace-nowrap"
        >
          Publicar habitació gratis →
        </Link>
      </div>

      {/* 5 · CTA Encuéntrame habitación */}
      <div className="bg-[#e6f7f7] rounded-2xl border border-[#b2e8e6] p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-[#1a3c5e]">No trobes el que busques?</h2>
          <p className="text-sm text-[#374151] mt-1">
            Crea el teu perfil d&apos;inquilí gratis. Indica el teu pressupost, parròquia i dates,
            i que siguin els propietaris qui et contactin a tu.
          </p>
        </div>
        <Link
          href="/buscar-habitacion"
          className="shrink-0 bg-[#1a3c5e] text-white font-bold px-5 py-3 rounded-xl text-sm hover:bg-[#0ea5a0] transition-colors whitespace-nowrap"
        >
          Troba&apos;m habitació →
        </Link>
      </div>

      {/* 6 · FAQ */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#1a3c5e]">Preguntes freqüents</h2>
        <div className="flex flex-col gap-2">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-[#1a3c5e] text-sm select-none list-none">
                {q}
                <svg
                  className="w-4 h-4 shrink-0 text-[#9ca3af] transition-transform group-open:rotate-180"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-4 text-sm text-[#374151] leading-relaxed border-t border-gray-50 pt-3">
                {a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Links internos SEO */}
      <div className="border-t border-gray-100 pt-6 flex flex-wrap gap-3 text-xs text-[#9ca3af]">
        <span className="font-medium text-[#6b7280]">Més informació:</span>
        <Link href="/como-encontrar-habitacion-en-andorra" className="hover:text-[#1a3c5e] hover:underline transition-colors">Com trobar habitació a Andorra</Link>
        <span>·</span>
        <Link href="/como-publicar-una-habitacion-en-andorra" className="hover:text-[#1a3c5e] hover:underline transition-colors">Com publicar una habitació</Link>
        <span>·</span>
        <Link href="/cuanto-cuesta-una-habitacion-en-andorra" className="hover:text-[#1a3c5e] hover:underline transition-colors">Quant costa una habitació a Andorra</Link>
        <span>·</span>
        <Link href="/habitacion-en-andorra-para-temporada" className="hover:text-[#1a3c5e] hover:underline transition-colors">Habitació per temporada</Link>
      </div>

    </div>
  )
}

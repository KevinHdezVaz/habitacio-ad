import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AnuncioCard from '@/components/AnuncioCard'
import { supabase } from './lib/supabase'
import type { Anuncio } from './lib/types'

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function getLatestAnuncios(): Promise<Anuncio[]> {
  const { data } = await supabase
    .from('anuncios')
    .select('*, imagenes_anuncio(id, url, orden)')
    .eq('estado', 'activo')
    .order('created_at', { ascending: false })
    .limit(6)
  return (data as Anuncio[]) ?? []
}

// ---------------------------------------------------------------------------
// Mock seekers — reemplazar cuando se cree la tabla perfiles_buscadores
// ---------------------------------------------------------------------------

const MOCK_SEEKERS = [
  { id: '1', nombre: 'Albert', edad: 23, parroquia: 'Escaldes', presupuesto_max: 700 },
  { id: '2', nombre: 'Laura', edad: 26, parroquia: 'Encamp', presupuesto_max: 550 },
  { id: '3', nombre: 'Marta', edad: 21, parroquia: 'Andorra la Vella', presupuesto_max: 600 },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ActionCard({
  icon,
  iconBg,
  title,
  subtitle,
  href,
  titleColor = 'text-gray-900',
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  subtitle: string
  href: string
  titleColor?: string
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3 hover:shadow-md active:scale-[0.98] transition-all"
    >
      <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className={`font-bold text-sm leading-tight ${titleColor}`}>{title}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">{subtitle}</p>
          <span className="text-gray-400 text-sm ml-1">→</span>
        </div>
      </div>
    </Link>
  )
}

function SeekerCard({
  nombre,
  edad,
  parroquia,
  presupuesto_max,
}: {
  nombre: string
  edad: number
  parroquia: string
  presupuesto_max: number
}) {
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {/* Avatar placeholder */}
        <div className="w-11 h-11 rounded-full bg-[#E8EDF5] flex items-center justify-center flex-shrink-0">
          <span className="text-[#1B3A6B] font-semibold text-base">{nombre[0]}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {nombre}, {edad}
          </p>
          <p className="text-xs text-gray-500">
            {parroquia} · Hasta {presupuesto_max} €/mes
          </p>
        </div>
      </div>
      <button className="border border-[#0EA5A0] text-[#0EA5A0] text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-[#0EA5A0] hover:text-white transition-colors ml-3">
        Desbloquear · 4,99 €
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function IconSearch() {
  return (
    <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function IconHome() {
  return (
    <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconPersonSearch() {
  return (
    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
      <path d="M10 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm9.5-2c.28-.47.5-1 .5-1.57C20 8.55 18.88 7.5 17.5 7.5S15 8.55 15 9.93c0 .57.22 1.1.5 1.57L14 13h7l-1.5-1.5z"/>
    </svg>
  )
}

function IconGroup() {
  return (
    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function Home() {
  const anuncios = await getLatestAnuncios()

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 pb-16">
        {/* ── Hero ── */}
        <section className="pt-7 pb-5">
          <h1 className="text-[1.85rem] font-bold text-[#1B3A6B] leading-tight">
            Encuentra habitación en{' '}
            <span className="font-extrabold">Andorra</span>
          </h1>
          <p className="mt-2 text-gray-500 text-base">
            Habitaciones para todo el año o temporada.
          </p>
        </section>

        {/* ── 4 Action Cards ── */}
        <section className="grid grid-cols-2 gap-3 mb-8">
          <ActionCard
            icon={<IconSearch />}
            iconBg="bg-[#1B3A6B]"
            title="Buscar habitación"
            subtitle="Ver anuncios disponibles"
            href="/habitaciones"
          />
          <ActionCard
            icon={<IconHome />}
            iconBg="bg-[#0EA5A0]"
            title="Publicar habitación"
            subtitle="Ofrece tu habitación"
            href="/publicar"
            titleColor="text-[#0EA5A0]"
          />
          <ActionCard
            icon={<IconPersonSearch />}
            iconBg="bg-[#2563EB]"
            title="Encuéntrame habitación"
            subtitle="Publica tu perfil"
            href="/mi-perfil"
            titleColor="text-[#2563EB]"
          />
          <ActionCard
            icon={<IconGroup />}
            iconBg="bg-[#1B3A6B]"
            title="Ver perfiles"
            subtitle="Personas interesadas"
            href="/buscadores"
          />
        </section>

        {/* ── Personas que buscan habitación ── */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">
              Personas que buscan habitación
            </h2>
            <Link href="/buscadores" className="text-[#1B3A6B] text-sm font-medium hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {MOCK_SEEKERS.map((s) => (
              <SeekerCard key={s.id} {...s} />
            ))}
          </div>
        </section>

        {/* ── Últimas habitaciones publicadas ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">
              Últimas habitaciones publicadas
            </h2>
            <Link href="/habitaciones" className="text-[#1B3A6B] text-sm font-medium hover:underline">
              Ver todas
            </Link>
          </div>

          {anuncios.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <div className="w-12 h-12 bg-[#E8EDF5] rounded-full flex items-center justify-center mx-auto mb-3">
                <IconHome />
              </div>
              <p className="text-gray-500 text-sm">Aún no hay habitaciones publicadas.</p>
              <Link
                href="/publicar"
                className="mt-4 inline-block bg-[#1B3A6B] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#152f57] transition-colors"
              >
                Publicar la primera
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {anuncios.map((anuncio) => (
                <AnuncioCard key={anuncio.id} anuncio={anuncio} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import FaqAccordion from './FaqAccordion'
import { getLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Preguntas frecuentes sobre habitaciones en Andorra | Habitacio.ad',
  description: 'Resuelve tus dudas sobre cómo buscar o publicar habitación en Andorra con habitacio.ad. Preguntas frecuentes sobre anuncios, perfiles, temporeros, privacidad y funcionamiento.',
  alternates: {
    canonical: 'https://habitacio.ad/preguntas-frecuentes',
  },
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const IconPublish = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconProfile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

// ── Contenido ES ──────────────────────────────────────────────────────────────
const CATEGORIAS_ES = [
  {
    id: 'buscar',
    Icon: IconSearch,
    titulo: 'Buscar habitación',
    preguntas: [
      { q: '¿Cómo puedo buscar una habitación en Andorra?', a: 'Puedes utilizar el buscador de habitacio.ad para filtrar por zona, presupuesto y tipo de estancia. Así verás primero las habitaciones que mejor encajan contigo, sin perder tiempo revisando opciones que no te interesan.' },
      { q: '¿Puedo buscar habitación para todo el año o solo para temporada?', a: 'Sí. En habitacio.ad puedes buscar tanto habitaciones para residencia habitual durante todo el año como opciones para temporada, como invierno, verano u otros periodos concretos.' },
      { q: '¿Hace falta registrarse para buscar habitaciones?', a: 'No siempre. Puedes navegar por las habitaciones disponibles, pero algunas funciones pueden requerir registro para mejorar la experiencia, guardar información o contactar de forma más directa.' },
      { q: '¿Puedo elegir varias zonas o parroquias a la vez?', a: 'Sí. Si estás abierto a varias zonas de Andorra, puedes indicar más de una parroquia para ampliar tus opciones y encontrar algo que encaje mejor con tu presupuesto y necesidades.' },
      { q: '¿Qué hago si no encuentro una habitación que encaje conmigo?', a: 'Puedes crear tu perfil de búsqueda en la opción "Encuéntrame habitación". Así indicas qué buscas y los propietarios o anunciantes podrán encontrarte y contactarte si tienen una opción compatible.' },
      { q: '¿Cómo encontrar habitación en Andorra?', a: 'Entra en habitacio.ad, usa los filtros de zona, precio y tipo de estancia para encontrar anuncios que se ajusten a lo que buscas. También puedes crear un perfil de búsqueda para que te contacten directamente.' },
      { q: '¿Dónde buscar habitación en Andorra para temporeros?', a: 'En habitacio.ad hay anuncios específicos para temporada (esquí, verano…). Filtra por tipo de estancia "Temporada" y verás las opciones disponibles para trabajadores temporeros en todas las parroquias.' },
      { q: '¿Qué zonas de Andorra son más buscadas para alquilar habitación?', a: 'Las zonas más demandadas suelen ser Andorra la Vella y Escaldes-Engordany por su centralidad, aunque La Massana y Encamp también son muy buscadas por su proximidad a las pistas de esquí.' },
      { q: '¿Se puede encontrar habitación en Andorra para todo el año?', a: 'Sí. En habitacio.ad encontrarás anuncios tanto para residencia habitual durante todo el año como para estancias temporales. Usa el filtro de tipo de estancia para encontrar lo que necesitas.' },
    ],
  },
  {
    id: 'publicar',
    Icon: IconPublish,
    titulo: 'Publicar habitación',
    preguntas: [
      { q: '¿Cómo puedo publicar una habitación en habitacio.ad?', a: 'Solo tienes que completar el formulario de publicación con la información principal de la habitación, como precio, parroquia, tipo de estancia, características, condiciones, descripción y fotos.' },
      { q: '¿Qué datos puedo añadir al anuncio?', a: 'Puedes añadir información como el precio mensual, la zona, la disponibilidad, tipo de estancia, tamaño aproximado, tipo de cama, estancia mínima y máxima, equipamiento, condiciones, normas, descripción y fotos.' },
      { q: '¿Puedo indicar si acepto mascotas, parejas o fumadores?', a: 'Sí. Durante la publicación puedes especificar las condiciones de la vivienda, incluyendo si se aceptan mascotas, parejas, fumadores, si hay WiFi, si los gastos están incluidos o si existe posibilidad de empadronamiento.' },
      { q: '¿Se muestra la dirección exacta de la vivienda?', a: 'No necesariamente. La plataforma puede mostrar la zona o la parroquia sin enseñar la dirección exacta, para proteger la privacidad y ofrecer más seguridad al anunciante.' },
      { q: '¿Cuánto tarda en publicarse un anuncio?', a: 'Los anuncios pueden revisarse antes de publicarse. El tiempo exacto puede variar, pero la idea es mantener la plataforma clara, útil y con anuncios bien presentados.' },
      { q: '¿Puedo publicar una habitación aunque no quiera exponerla demasiado?', a: 'Sí. habitacio.ad está pensado para facilitar el contacto sin obligarte a dar más información pública de la necesaria. Además, también puedes consultar perfiles de personas que buscan habitación como la tuya.' },
      { q: '¿Puedo contactar personas que buscan habitación sin publicar antes mi anuncio?', a: 'Sí. Una de las ventajas de habitacio.ad es que puedes acceder a perfiles de personas que están buscando una habitación compatible con la tuya y contactar directamente, incluso si no quieres publicar primero.' },
      { q: '¿Cómo publicar una habitación en Andorra?', a: 'Regístrate en habitacio.ad, ve a "Publicar habitación" y rellena el formulario con los datos de tu habitación: precio, zona, tipo de estancia, fotos y condiciones. El anuncio estará visible en pocos minutos.' },
    ],
  },
  {
    id: 'perfiles',
    Icon: IconProfile,
    titulo: 'Perfiles de búsqueda',
    preguntas: [
      { q: '¿Qué es "Encuéntrame habitación"?', a: 'Es una función que permite a una persona publicar su perfil de búsqueda indicando qué tipo de habitación necesita, en qué zonas le interesa vivir, qué presupuesto tiene y algunos datos sobre ella. Así los propietarios o anunciantes pueden contactar directamente si tienen algo que encaje.' },
      { q: '¿Qué información aparece en un perfil de búsqueda?', a: 'Normalmente se muestra información útil para ayudar al anunciante a valorar si hay encaje, como edad, tipo de estancia, presupuesto máximo, zonas preferidas, situación laboral y una breve presentación, siempre según la configuración de la plataforma.' },
      { q: '¿Durante cuánto tiempo está visible un perfil de búsqueda?', a: 'El perfil puede permanecer visible durante un periodo determinado dentro de la plataforma para que propietarios o anunciantes con habitaciones compatibles puedan verlo y contactar.' },
      { q: '¿Puedo editar o eliminar mi perfil de búsqueda?', a: 'Sí. Desde tu área personal puedes gestionar tu perfil, editar la información o eliminarlo si ya no lo necesitas.' },
      { q: '¿Quién puede ver mi perfil?', a: 'Tu perfil está pensado para ser visible a usuarios o propietarios que ofrezcan habitaciones y utilicen habitacio.ad para encontrar personas compatibles.' },
    ],
  },
  {
    id: 'privacidad',
    Icon: IconShield,
    titulo: 'Privacidad, seguridad y funcionamiento',
    preguntas: [
      { q: '¿habitacio.ad verifica los anuncios o perfiles?', a: 'La plataforma puede revisar la información antes de hacerla visible para mantener un entorno más claro, ordenado y útil para todos los usuarios.' },
      { q: '¿Se muestran mis datos personales públicamente?', a: 'No se deberían mostrar más datos de los necesarios para facilitar el contacto y el encaje entre oferta y demanda. La información visible dependerá del tipo de perfil o anuncio y de cómo funcione cada sección.' },
      { q: '¿Es habitacio.ad una inmobiliaria?', a: 'No. habitacio.ad es una plataforma pensada para facilitar el contacto entre personas que ofrecen una habitación y personas que la buscan en Andorra.' },
      { q: '¿Qué tipo de habitaciones puedo encontrar en habitacio.ad?', a: 'La plataforma está enfocada en habitaciones en Andorra, tanto para personas que buscan residencia habitual como para trabajadores temporeros, estudiantes u otros perfiles que necesitan una solución flexible.' },
      { q: '¿habitacio.ad está pensado solo para Andorra?', a: 'Sí. habitacio.ad está especializado en habitaciones y perfiles de búsqueda dentro de Andorra, con un enfoque mucho más claro y específico que los portales generalistas.' },
      { q: '¿Puedo usar habitacio.ad desde el móvil?', a: 'Sí. La plataforma está pensada para que puedas navegar, buscar, publicar y gestionar tu perfil cómodamente desde el móvil.' },
      { q: '¿Dónde puedo consultar las condiciones legales y de privacidad?', a: 'Puedes consultar el aviso legal, la política de privacidad y la política de cookies desde el pie de página de la web.' },
    ],
  },
]

// ── Contenido CA ──────────────────────────────────────────────────────────────
const CATEGORIAS_CA = [
  {
    id: 'buscar',
    Icon: IconSearch,
    titulo: 'Cercar habitació',
    preguntas: [
      { q: 'Com puc cercar una habitació a Andorra?', a: 'Pots utilitzar el cercador de habitacio.ad per filtrar per zona, pressupost i tipus d\'estada. Així veuràs primer les habitacions que millor encaixen amb tu, sense perdre temps revisant opcions que no t\'interessen.' },
      { q: 'Puc cercar habitació per a tot l\'any o només per temporada?', a: 'Sí. A habitacio.ad pots cercar tant habitacions per a residència habitual durant tot l\'any com opcions per a temporada, com hivern, estiu o altres períodes concrets.' },
      { q: 'Cal registrar-se per cercar habitacions?', a: 'No sempre. Pots navegar per les habitacions disponibles, però algunes funcions poden requerir registre per millorar l\'experiència, guardar informació o contactar de forma més directa.' },
      { q: 'Puc triar diverses zones o parròquies alhora?', a: 'Sí. Si estàs obert a diverses zones d\'Andorra, pots indicar més d\'una parròquia per ampliar les teves opcions i trobar alguna cosa que encaixi millor amb el teu pressupost i necessitats.' },
      { q: 'Què faig si no trobo una habitació que encaixi amb mi?', a: 'Pots crear el teu perfil de cerca a l\'opció "Troba\'m habitació". Així indiques què cerques i els propietaris o anunciants podran trobar-te i contactar-te si tenen una opció compatible.' },
      { q: 'Com trobar habitació a Andorra?', a: 'Entra a habitacio.ad, utilitza els filtres de zona, preu i tipus d\'estada per trobar anuncis que s\'ajustin al que cerques. També pots crear un perfil de cerca perquè et contactin directament.' },
      { q: 'On cercar habitació a Andorra per a temporers?', a: 'A habitacio.ad hi ha anuncis específics per a temporada (esquí, estiu…). Filtra per tipus d\'estada "Temporada" i veuràs les opcions disponibles per a treballadors temporers a totes les parròquies.' },
      { q: 'Quines zones d\'Andorra són més buscades per llogar habitació?', a: 'Les zones més demandades solen ser Andorra la Vella i Escaldes-Engordany per la seva centralitat, tot i que La Massana i Encamp també són molt buscades per la seva proximitat a les pistes d\'esquí.' },
      { q: 'Es pot trobar habitació a Andorra per a tot l\'any?', a: 'Sí. A habitacio.ad trobaràs anuncis tant per a residència habitual durant tot l\'any com per a estades temporals. Utilitza el filtre de tipus d\'estada per trobar el que necessites.' },
    ],
  },
  {
    id: 'publicar',
    Icon: IconPublish,
    titulo: 'Publicar habitació',
    preguntas: [
      { q: 'Com puc publicar una habitació a habitacio.ad?', a: 'Només has de completar el formulari de publicació amb la informació principal de l\'habitació, com preu, parròquia, tipus d\'estada, característiques, condicions, descripció i fotos.' },
      { q: 'Quines dades puc afegir a l\'anunci?', a: 'Pots afegir informació com el preu mensual, la zona, la disponibilitat, tipus d\'estada, mida aproximada, tipus de llit, estada mínima i màxima, equipament, condicions, normes, descripció i fotos.' },
      { q: 'Puc indicar si accepto mascotes, parelles o fumadors?', a: 'Sí. Durant la publicació pots especificar les condicions de l\'habitatge, incloent si s\'accepten mascotes, parelles, fumadors, si hi ha WiFi, si les despeses estan incloses o si existeix possibilitat d\'empadronament.' },
      { q: 'Es mostra la direcció exacta de l\'habitatge?', a: 'No necessàriament. La plataforma pot mostrar la zona o la parròquia sense ensenyar la direcció exacta, per protegir la privacitat i oferir més seguretat a l\'anunciant.' },
      { q: 'Quant tarda a publicar-se un anunci?', a: 'Els anuncis poden revisar-se abans de publicar-se. El temps exacte pot variar, però la idea és mantenir la plataforma clara, útil i amb anuncis ben presentats.' },
      { q: 'Puc publicar una habitació encara que no vulgui exposar-la massa?', a: 'Sí. habitacio.ad està pensat per facilitar el contacte sense obligar-te a donar més informació pública de la necessària. A més, també pots consultar perfils de persones que busquen habitació com la teva.' },
      { q: 'Puc contactar persones que busquen habitació sense publicar primer el meu anunci?', a: 'Sí. Un dels avantatges de habitacio.ad és que pots accedir a perfils de persones que estan buscant una habitació compatible amb la teva i contactar directament, fins i tot si no vols publicar primer.' },
      { q: 'Com publicar una habitació a Andorra?', a: 'Registra\'t a habitacio.ad, vés a "Publicar habitació" i omple el formulari amb les dades de la teva habitació: preu, zona, tipus d\'estada, fotos i condicions. L\'anunci estarà visible en pocs minuts.' },
    ],
  },
  {
    id: 'perfiles',
    Icon: IconProfile,
    titulo: 'Perfils de cerca',
    preguntas: [
      { q: 'Què és "Troba\'m habitació"?', a: 'És una funció que permet a una persona publicar el seu perfil de cerca indicant quin tipus d\'habitació necessita, en quines zones li interessa viure, quin pressupost té i algunes dades sobre ella. Així els propietaris o anunciants poden contactar directament si tenen alguna cosa que encaixi.' },
      { q: 'Quina informació apareix en un perfil de cerca?', a: 'Normalment es mostra informació útil per ajudar l\'anunciant a valorar si hi ha encaix, com edat, tipus d\'estada, pressupost màxim, zones preferides, situació laboral i una breu presentació, sempre segons la configuració de la plataforma.' },
      { q: 'Durant quant de temps és visible un perfil de cerca?', a: 'El perfil pot romandre visible durant un període determinat dins de la plataforma perquè propietaris o anunciants amb habitacions compatibles puguin veure\'l i contactar.' },
      { q: 'Puc editar o eliminar el meu perfil de cerca?', a: 'Sí. Des de la teva àrea personal pots gestionar el teu perfil, editar la informació o eliminar-lo si ja no el necessites.' },
      { q: 'Qui pot veure el meu perfil?', a: 'El teu perfil està pensat per ser visible a usuaris o propietaris que ofereixin habitacions i utilitzin habitacio.ad per trobar persones compatibles.' },
    ],
  },
  {
    id: 'privacidad',
    Icon: IconShield,
    titulo: 'Privacitat, seguretat i funcionament',
    preguntas: [
      { q: 'habitacio.ad verifica els anuncis o perfils?', a: 'La plataforma pot revisar la informació abans de fer-la visible per mantenir un entorn més clar, ordenat i útil per a tots els usuaris.' },
      { q: 'Es mostren les meves dades personals públicament?', a: 'No s\'haurien de mostrar més dades de les necessàries per facilitar el contacte i l\'encaix entre oferta i demanda. La informació visible dependrà del tipus de perfil o anunci i de com funcioni cada secció.' },
      { q: 'És habitacio.ad una immobiliària?', a: 'No. habitacio.ad és una plataforma pensada per facilitar el contacte entre persones que ofereixen una habitació i persones que la busquen a Andorra.' },
      { q: 'Quin tipus d\'habitacions puc trobar a habitacio.ad?', a: 'La plataforma està enfocada en habitacions a Andorra, tant per a persones que busquen residència habitual com per a treballadors temporers, estudiants o altres perfils que necessiten una solució flexible.' },
      { q: 'habitacio.ad està pensat només per a Andorra?', a: 'Sí. habitacio.ad està especialitzat en habitacions i perfils de cerca dins d\'Andorra, amb un enfocament molt més clar i específic que els portals generalistes.' },
      { q: 'Puc utilitzar habitacio.ad des del mòbil?', a: 'Sí. La plataforma està pensada perquè puguis navegar, cercar, publicar i gestionar el teu perfil còmodament des del mòbil.' },
      { q: 'On puc consultar les condicions legals i de privacitat?', a: 'Pots consultar l\'avís legal, la política de privacitat i la política de cookies des del peu de pàgina de la web.' },
    ],
  },
]

export default async function PreguntasFrecuentesPage() {
  const locale = await getLocale()
  const isCA = locale === 'ca'

  const CATEGORIAS = isCA ? CATEGORIAS_CA : CATEGORIAS_ES

  const titulo = isCA
    ? 'Preguntes freqüents sobre habitacio.ad'
    : 'Preguntas frecuentes sobre habitacio.ad'
  const subtitulo = isCA
    ? 'A habitacio.ad volem que cercar o publicar una habitació a Andorra sigui molt més fàcil, clar i segur. Aquí trobaràs respostes als dubtes més habituals.'
    : 'En habitacio.ad queremos que buscar o publicar una habitación en Andorra sea mucho más fácil, claro y seguro. Aquí encontrarás respuestas a las dudas más habituales.'
  const closeTitulo = isCA
    ? 'No has trobat la resposta que buscaves?'
    : '¿No has encontrado la respuesta que buscabas?'
  const closeTexto = isCA
    ? 'Si encara tens dubtes sobre com funciona habitacio.ad, pots posar-te en contacte amb nosaltres i t\'ajudarem.'
    : 'Si todavía tienes dudas sobre cómo funciona habitacio.ad, puedes ponerte en contacto con nosotros y te ayudaremos.'

  // Schema JSON-LD para FAQPage (SEO — siempre en español para indexación)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CATEGORIAS_ES.flatMap((cat) =>
      cat.preguntas.map((p) => ({
        '@type': 'Question',
        name: p.q,
        acceptedAnswer: { '@type': 'Answer', text: p.a },
      }))
    ),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-3xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <div className="text-center flex flex-col gap-3 pt-4">
          <p className="text-xs font-bold text-[#0ea5a0] uppercase tracking-widest">FAQ</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1a3c5e] leading-tight">
            {titulo}
          </h1>
          <p className="text-[#6b7280] text-base max-w-xl mx-auto leading-relaxed">
            {subtitulo}
          </p>
        </div>

        {/* Accesos rápidos por categoría */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIAS.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#f4f5f7] hover:bg-[#eef2f8] hover:text-[#1a3c5e] transition-colors text-center group"
            >
              <span className="text-[#0ea5a0] group-hover:text-[#1a3c5e] transition-colors">
                <cat.Icon />
              </span>
              <span className="text-xs font-semibold text-[#374151] group-hover:text-[#1a3c5e] leading-tight">{cat.titulo}</span>
            </a>
          ))}
        </div>

        {/* Categorías con acordeones */}
        {CATEGORIAS.map((cat) => (
          <section key={cat.id} id={cat.id} className="flex flex-col gap-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <span className="text-[#0ea5a0]"><cat.Icon /></span>
              <h2 className="text-xl font-bold text-[#1a3c5e]">{cat.titulo}</h2>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <FaqAccordion preguntas={cat.preguntas} />
          </section>
        ))}

        {/* Bloque cierre */}
        <div className="bg-gradient-to-br from-[#1a3c5e] to-[#2d5a8e] rounded-3xl p-8 text-white text-center flex flex-col items-center gap-5">
          <h2 className="text-xl font-bold">{closeTitulo}</h2>
          <p className="text-white/80 text-sm max-w-md">{closeTexto}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contacto" className="px-5 py-2.5 bg-white text-[#1a3c5e] font-bold rounded-xl text-sm hover:bg-gray-100 transition-colors">
              {isCA ? 'Contactar' : 'Contactar'}
            </Link>
            <Link href="/habitaciones" className="px-5 py-2.5 bg-white/20 text-white font-bold rounded-xl text-sm hover:bg-white/30 transition-colors">
              {isCA ? 'Cercar habitació' : 'Buscar habitación'}
            </Link>
            <Link href="/publicar" className="px-5 py-2.5 bg-white/20 text-white font-bold rounded-xl text-sm hover:bg-white/30 transition-colors">
              {isCA ? 'Publicar habitació' : 'Publicar habitación'}
            </Link>
          </div>
        </div>

      </div>
    </>
  )
}

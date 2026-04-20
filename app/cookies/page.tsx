import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Política de Cookies — Habitacio.ad',
  description: 'Información sobre el uso de cookies en Habitacio.ad.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-[#1a3c5e] border-l-4 border-[#1a3c5e] pl-3">{title}</h2>
      <div className="text-[#374151] text-sm leading-relaxed flex flex-col gap-2">{children}</div>
    </section>
  )
}

function CookieCategoryTable({ ca }: { ca: boolean }) {
  const rows = ca
    ? [
        {
          categoria: 'Cookies Tècniques o Necessàries',
          descripcion: 'Són imprescindibles per al correcte funcionament de la web, permeten la navegació i l\'ús de les diferents opcions o serveis, com identificar la sessió, gestionar la seguretat o accedir a àrees restringides de la plataforma.',
          base: 'Interès legítim (són fonamentals per a l\'execució del servei i el funcionament de la web).',
        },
        {
          categoria: 'Cookies Analítiques o de Mesurament',
          descripcion: 'Permeten quantificar el nombre d\'usuaris, mesurar l\'audiència, analitzar la navegació i l\'activitat dels usuaris a la Web (p. ex., seccions més visitades, temps de permanència). La seva finalitat és realitzar el mesurament i l\'anàlisi estadística del servei per introduir millores basades en l\'anàlisi de les dades d\'ús.',
          base: 'Consentiment exprés de l\'usuari.',
        },
        {
          categoria: 'Cookies de Màrqueting o Publicitat',
          descripcion: 'Permeten la gestió dels espais publicitaris i la creació d\'un perfil de navegació amb l\'objectiu de mostrar publicitat personalitzada. Inclouen les cookies de tercers (com el píxel de Meta) utilitzades per mesurar l\'eficàcia de les campanyes i realitzar accions de retargeting o segmentació d\'usuaris.',
          base: 'Consentiment exprés de l\'usuari.',
        },
      ]
    : [
        {
          categoria: 'Cookies Técnicas o Necesarias',
          descripcion: 'Son aquellas imprescindibles para el correcto funcionamiento de la web, permitiendo al usuario la navegación y el uso de las diferentes opciones o servicios que existen, como identificar la sesión, gestionar la seguridad o acceder a áreas restringidas de la plataforma.',
          base: 'Interés legítimo (son fundamentales para la ejecución del servicio y el funcionamiento de la web).',
        },
        {
          categoria: 'Cookies Analíticas o de Medición',
          descripcion: 'Permiten cuantificar el número de usuarios, medir la audiencia, analizar la navegación y la actividad de los usuarios en la Web (p. ej., secciones más visitadas, tiempo de permanencia). Su finalidad es realizar la medición y el análisis estadístico del servicio para introducir mejoras basadas en el análisis de los datos de uso.',
          base: 'Consentimiento expreso del usuario.',
        },
        {
          categoria: 'Cookies de Marketing o Publicidad',
          descripcion: 'Permiten la gestión de los espacios publicitarios y la creación de un perfil de navegación con el objetivo de mostrar publicidad personalizada. Incluyen las cookies de terceros (como el píxel de Meta) utilizadas para medir la eficacia de las campañas y realizar acciones de retargeting o segmentación de usuarios.',
          base: 'Consentimiento expreso del usuario.',
        },
      ]

  const headers = ca
    ? ['Categoria', 'Descripció i Finalitat', 'Base Legal']
    : ['Categoría', 'Descripción y Finalidad', 'Base Legal']

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-xs text-left">
        <thead className="bg-[#eef2f8] text-[#1a3c5e] font-semibold">
          <tr>
            {headers.map((h) => <th key={h} className="px-3 py-2.5">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((r) => (
            <tr key={r.categoria} className="bg-white align-top">
              <td className="px-3 py-2 font-semibold text-[#1a3c5e] min-w-[140px]">{r.categoria}</td>
              <td className="px-3 py-2 text-[#374151]">{r.descripcion}</td>
              <td className="px-3 py-2 text-[#6b7280] min-w-[140px]">{r.base}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default async function CookiesPage() {
  const locale = await getLocale()
  const ca = locale === 'ca'

  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-10">

      {/* Cabecera */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#1a3c5e]">
          {ca ? 'Política de Cookies' : 'Política de Cookies'}
        </h1>
        <p className="text-sm text-[#374151]">
          {ca
            ? 'La present Política de Cookies té per objecte informar sobre l\'ús de cookies a la pàgina web '
            : 'La presente Política de Cookies tiene por objeto informar sobre el uso de cookies en la página web '}
          <a href="https://www.habitacio.ad/" className="text-[#1a3c5e] underline">https://www.habitacio.ad/</a>
          {ca ? ' (d\'ara endavant, "la Web").' : ' (en adelante, "la Web").'}
        </p>
      </div>

      {/* 1 */}
      <Section title={ca ? '1. Què són les Cookies?' : '1. ¿Qué son las Cookies?'}>
        <p>
          {ca
            ? 'Una cookie és un petit fitxer de text que un servidor web emmagatzema al navegador de l\'usuari en accedir a una web. Permet a la pàgina web recordar informació específica sobre l\'usuari, com ara les seves preferències o els seus hàbits de navegació, per facilitar futures visites i personalitzar els serveis.'
            : 'Una cookie es un pequeño archivo de texto que un servidor web almacena en el navegador del usuario al acceder a una web. Permite a la página web recordar información específica sobre el usuario, como sus preferencias o sus hábitos de navegación, para facilitar futuras visitas y personalizar los servicios.'}
        </p>
      </Section>

      {/* 2 */}
      <Section title={ca ? '2. Identitat i Legislació Aplicable' : '2. Identidad y Legislación Aplicable'}>
        <p>
          {ca
            ? 'El responsable del tractament de les dades obtingudes mitjançant les cookies de la Web és ALBERT ALFOCEA URBANO (HABITACIO.AD).'
            : 'El responsable del tratamiento de los datos obtenidos mediante las cookies de la Web es ALBERT ALFOCEA URBANO (HABITACIO.AD).'}
        </p>
        <p>
          {ca
            ? 'Aquesta política es regeix pel que estableix la legislació d\'Andorra, en particular la Llei Qualificada 29/2021, de 31 d\'octubre, de protecció de dades personals.'
            : 'Esta política se rige por lo establecido en las leyes de Andorra, en particular la Llei Qualificada 29/2021, de 31 de octubre, de protecció de dades personals.'}
        </p>
      </Section>

      {/* 3 */}
      <Section title={ca ? '3. Tipus de Cookies utilitzades i Finalitat' : '3. Tipos de Cookies utilizadas y Finalidad'}>
        <p>
          {ca
            ? 'A la Web HABITACIO.AD s\'utilitzen les categories de cookies següents:'
            : 'En la Web HABITACIO.AD se utilizan las siguientes categorías de cookies:'}
        </p>
        <CookieCategoryTable ca={ca} />
      </Section>

      {/* 4 */}
      <Section title={ca ? '4. Gestió de Cookies i Consentiment' : '4. Gestión de Cookies y Consentimiento'}>
        <p>
          {ca
            ? 'De conformitat amb la normativa andorrana, per a la instal·lació de cookies analítiques i de màrqueting es requereix el consentiment exprés de l\'usuari.'
            : 'De conformidad con la normativa andorrana, para la instalación de cookies analíticas y de marketing, se requiere el consentimiento expreso del usuario.'}
        </p>

        <p className="font-semibold text-[#1a3c5e]">
          {ca ? 'Obtenció del Consentiment:' : 'Obtención del Consentimiento:'}
        </p>
        <p>
          {ca
            ? 'En accedir a la Web, l\'usuari rebrà un avís o banner on podrà:'
            : 'Al acceder a la Web, el usuario recibirá un aviso o banner donde podrá:'}
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>{ca ? 'Acceptar totes les cookies.' : 'Aceptar todas las cookies.'}</li>
          <li>{ca ? 'Rebutjar les cookies no necessàries (Analítiques i Màrqueting).' : 'Rechazar las cookies no necesarias (Analíticas y Marketing).'}</li>
          <li>{ca ? 'Configurar les seves preferències, seleccionant quines categories vol acceptar.' : 'Configurar sus preferencias, seleccionando qué categorías desea aceptar.'}</li>
        </ul>

        <p className="font-semibold text-[#1a3c5e]">
          {ca ? 'Revocació del Consentiment:' : 'Revocación del Consentimiento:'}
        </p>
        <p>
          {ca
            ? 'El consentiment atorgat és revocable en qualsevol moment. L\'usuari pot modificar les seves preferències o revocar el consentiment a través del centre de configuració de cookies disponible a la Web.'
            : 'El consentimiento otorgado es revocable en cualquier momento. El usuario puede modificar sus preferencias o revocar el consentimiento a través del centro de configuración de cookies disponible en la Web.'}
        </p>

        <p className="font-semibold text-[#1a3c5e]">
          {ca ? 'Configuració del Navegador:' : 'Configuración del Navegador:'}
        </p>
        <p>
          {ca
            ? 'Addicionalment, podeu permetre, bloquejar o eliminar les cookies instal·lades al vostre equip mitjançant la configuració de les opcions del vostre navegador (Chrome, Firefox, Safari, etc.). Tingueu en compte que si bloquegeu les cookies Tècniques o Necessàries, és possible que no pugueu utilitzar o navegar per certes parts de la Web.'
            : 'Adicionalmente, puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones de su navegador (Chrome, Firefox, Safari, etc.). Tenga en cuenta que si bloquea las cookies Técnicas o Necesarias, es posible que no pueda utilizar o navegar por ciertas partes de la Web.'}
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#1a3c5e] underline">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies" target="_blank" rel="noopener noreferrer" className="text-[#1a3c5e] underline">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#1a3c5e] underline">Safari</a></li>
          <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies" target="_blank" rel="noopener noreferrer" className="text-[#1a3c5e] underline">Microsoft Edge</a></li>
        </ul>
      </Section>

      {/* 5 */}
      <Section title={ca ? '5. Més Informació' : '5. Más Información'}>
        <p>
          {ca
            ? 'Per a qualsevol qüestió relativa al tractament de les seves dades personals o per a l\'exercici dels seus drets (com Accedir, Rectificar o Suprimir les dades), us remetem a la nostra Política de Privacitat.'
            : 'Para cualquier cuestión relativa al tratamiento de sus datos personales o para el ejercicio de sus derechos (como Acceder, Rectificar o Suprimir los datos), le remitimos a nuestra '}
          {!ca && <a href="/privacidad" className="text-[#1a3c5e] underline">Política de Privacidad</a>}
          {ca && <> <a href="/privacidad" className="text-[#1a3c5e] underline">Política de Privacitat</a>.</>}
          {!ca && '.'}
        </p>
        <p>
          {ca
            ? 'Així mateix, us recordem que teniu dret a presentar una reclamació davant l\'Agència Andorrana de Protecció de Dades (APDA) si considereu que el tractament de les vostres dades no s\'ajusta a la normativa vigent.'
            : 'Asimismo, le recordamos que tiene derecho a presentar una reclamación ante la Agencia Andorrana de Protección de Datos (APDA) si considera que el tratamiento de sus datos no se ajusta a la normativa vigente.'}
        </p>
      </Section>

    </div>
  )
}

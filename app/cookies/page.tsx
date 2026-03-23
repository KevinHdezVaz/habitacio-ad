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

type CookieRow = { nombre: string; tipo: string; finalidad: string; duracion: string }

function CookieTable({ rows, headers }: { rows: CookieRow[]; headers: string[] }) {
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
            <tr key={r.nombre} className="bg-white">
              <td className="px-3 py-2 font-mono text-[#1a3c5e]">{r.nombre}</td>
              <td className="px-3 py-2">{r.tipo}</td>
              <td className="px-3 py-2 text-[#6b7280]">{r.finalidad}</td>
              <td className="px-3 py-2 text-[#6b7280]">{r.duracion}</td>
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

  const cookieRows: CookieRow[] = ca
    ? [
        { nombre: 'sb-access-token',  tipo: 'Tècnica', finalidad: 'Manté la sessió de l\'usuari autenticat',      duracion: 'Sessió / 1 hora' },
        { nombre: 'sb-refresh-token', tipo: 'Tècnica', finalidad: 'Renova automàticament la sessió activa',       duracion: '7 dies' },
        { nombre: 'sb-auth-token',    tipo: 'Tècnica', finalidad: 'Autenticació amb Supabase (OAuth Google)',     duracion: 'Sessió' },
      ]
    : [
        { nombre: 'sb-access-token',  tipo: 'Técnica', finalidad: 'Mantiene la sesión del usuario autenticado',   duracion: 'Sesión / 1 hora' },
        { nombre: 'sb-refresh-token', tipo: 'Técnica', finalidad: 'Renueva automáticamente la sesión activa',     duracion: '7 días' },
        { nombre: 'sb-auth-token',    tipo: 'Técnica', finalidad: 'Autenticación con Supabase (OAuth Google)',    duracion: 'Sesión' },
      ]

  const tableHeaders = ca
    ? ['Nom', 'Tipus', 'Finalitat', 'Durada']
    : ['Nombre', 'Tipo', 'Finalidad', 'Duración']

  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-10">

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#1a3c5e]">
          {ca ? 'Política de Cookies' : 'Política de Cookies'}
        </h1>
        <p className="text-sm text-[#9ca3af]">
          {ca ? 'Darrera actualització: març de 2026' : 'Última actualización: marzo de 2026'}
        </p>
      </div>

      <Section title={ca ? '1. Què són les cookies?' : '1. ¿Qué son las cookies?'}>
        <p>
          {ca
            ? "Les cookies són petits fitxers de text que els llocs web emmagatzemen al teu dispositiu quan els visites. Permeten que el lloc recordi les teves preferències, mantingui la teva sessió activa i millori la teva experiència de navegació."
            : "Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas. Permiten que el sitio recuerde tus preferencias, mantenga tu sesión activa y mejore tu experiencia de navegación."}
        </p>
      </Section>

      <Section title={ca ? '2. Cookies que utilitzem' : '2. Cookies que utilizamos'}>
        <p>
          {ca
            ? "Habitacio.ad utilitza únicament les cookies estrictament necessàries per al funcionament del servei:"
            : "Habitacio.ad utiliza únicamente las cookies estrictamente necesarias para el funcionamiento del servicio:"}
        </p>
        <CookieTable rows={cookieRows} headers={tableHeaders} />
        <p>
          {ca
            ? "No utilitzem cookies de publicitat, seguiment de tercers ni analítica invasiva."
            : "No utilizamos cookies de publicidad, rastreo de terceros ni analítica invasiva."}
        </p>
      </Section>

      <Section title={ca ? '3. Cookies de tercers' : '3. Cookies de terceros'}>
        <p>
          {ca
            ? <>En iniciar sessió amb Google, Google pot establir les seves pròpies cookies segons la seva <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#1a3c5e] underline">política de privadesa</a>. Habitacio.ad no controla aquestes cookies.</>
            : <>Al iniciar sesión con Google, Google puede establecer sus propias cookies según su <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#1a3c5e] underline">política de privacidad</a>. Habitacio.ad no controla estas cookies.</>}
        </p>
      </Section>

      <Section title={ca ? '4. Gestió de cookies' : '4. Gestión de cookies'}>
        <p>
          {ca
            ? "Pots gestionar o eliminar les cookies des de la configuració del teu navegador:"
            : "Puedes gestionar o eliminar las cookies desde la configuración de tu navegador:"}
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#1a3c5e] underline">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies" target="_blank" rel="noopener noreferrer" className="text-[#1a3c5e] underline">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#1a3c5e] underline">Safari</a></li>
          <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies" target="_blank" rel="noopener noreferrer" className="text-[#1a3c5e] underline">Microsoft Edge</a></li>
        </ul>
        <p>
          {ca
            ? "Tingues en compte que desactivar les cookies tècniques pot impedir el correcte funcionament de l'inici de sessió i altres funcions de la plataforma."
            : "Ten en cuenta que deshabilitar las cookies técnicas puede impedir el correcto funcionamiento del inicio de sesión y otras funciones de la plataforma."}
        </p>
      </Section>

      <Section title={ca ? '5. Canvis en aquesta política' : '5. Cambios en esta política'}>
        <p>
          {ca
            ? "Podem actualitzar aquesta política quan sigui necessari. Et recomanem revisar-la periòdicament. Els canvis entraran en vigor des de la seva publicació en aquesta pàgina."
            : "Podemos actualizar esta política cuando sea necesario. Te recomendamos revisarla periódicamente. Los cambios entrarán en vigor desde su publicación en esta página."}
        </p>
      </Section>

      <Section title={ca ? '6. Contacte' : '6. Contacto'}>
        <p>
          {ca
            ? <span>Si tens dubtes sobre l&apos;ús de cookies, pots contactar-nos a <a href="mailto:hola@habitacio.ad" className="text-[#1a3c5e] underline">hola@habitacio.ad</a>.</span>
            : <span>Si tienes dudas sobre el uso de cookies, puedes contactarnos en <a href="mailto:hola@habitacio.ad" className="text-[#1a3c5e] underline">hola@habitacio.ad</a>.</span>}
        </p>
      </Section>

    </div>
  )
}

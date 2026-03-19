import type { Metadata } from 'next'

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

function CookieTable({ rows }: { rows: CookieRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-xs text-left">
        <thead className="bg-[#eef2f8] text-[#1a3c5e] font-semibold">
          <tr>
            <th className="px-3 py-2.5">Nombre</th>
            <th className="px-3 py-2.5">Tipo</th>
            <th className="px-3 py-2.5">Finalidad</th>
            <th className="px-3 py-2.5">Duración</th>
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

export default function CookiesPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-10">

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#1a3c5e]">Política de Cookies</h1>
        <p className="text-sm text-[#9ca3af]">Última actualización: marzo de 2026</p>
      </div>

      <Section title="1. ¿Qué son las cookies?">
        <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas. Permiten que el sitio recuerde tus preferencias, mantenga tu sesión activa y mejore tu experiencia de navegación.</p>
      </Section>

      <Section title="2. Cookies que utilizamos">
        <p>Habitacio.ad utiliza únicamente las cookies estrictamente necesarias para el funcionamiento del servicio:</p>
        <CookieTable rows={[
          { nombre: 'sb-access-token', tipo: 'Técnica', finalidad: 'Mantiene la sesión del usuario autenticado', duracion: 'Sesión / 1 hora' },
          { nombre: 'sb-refresh-token', tipo: 'Técnica', finalidad: 'Renueva automáticamente la sesión activa', duracion: '7 días' },
          { nombre: 'sb-auth-token', tipo: 'Técnica', finalidad: 'Autenticación con Supabase (OAuth Google)', duracion: 'Sesión' },
        ]} />
        <p>No utilizamos cookies de publicidad, rastreo de terceros ni analítica invasiva.</p>
      </Section>

      <Section title="3. Cookies de terceros">
        <p>Al iniciar sesión con Google, Google puede establecer sus propias cookies según su <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#1a3c5e] underline">política de privacidad</a>. Habitacio.ad no controla estas cookies.</p>
      </Section>

      <Section title="4. Gestión de cookies">
        <p>Puedes gestionar o eliminar las cookies desde la configuración de tu navegador:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#1a3c5e] underline">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies" target="_blank" rel="noopener noreferrer" className="text-[#1a3c5e] underline">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#1a3c5e] underline">Safari</a></li>
          <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies" target="_blank" rel="noopener noreferrer" className="text-[#1a3c5e] underline">Microsoft Edge</a></li>
        </ul>
        <p>Ten en cuenta que deshabilitar las cookies técnicas puede impedir el correcto funcionamiento del inicio de sesión y otras funciones de la plataforma.</p>
      </Section>

      <Section title="5. Cambios en esta política">
        <p>Podemos actualizar esta política cuando sea necesario. Te recomendamos revisarla periódicamente. Los cambios entrarán en vigor desde su publicación en esta página.</p>
      </Section>

      <Section title="6. Contacto">
        <p>Si tienes dudas sobre el uso de cookies, puedes contactarnos en <a href="mailto:hola@habitacio.ad" className="text-[#1a3c5e] underline">hola@habitacio.ad</a>.</p>
      </Section>

    </div>
  )
}

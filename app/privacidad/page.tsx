import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Política de Privacidad — Habitacio.ad',
  description: 'Política de privacidad y protección de datos personales de Habitacio.ad.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-[#1a3c5e] border-l-4 border-[#1a3c5e] pl-3">{title}</h2>
      <div className="text-[#374151] text-sm leading-relaxed flex flex-col gap-2">{children}</div>
    </section>
  )
}

export default async function PrivacidadPage() {
  const locale = await getLocale()
  const ca = locale === 'ca'

  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-10">

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#1a3c5e]">
          {ca ? 'Política de Privadesa' : 'Política de Privacidad'}
        </h1>
        <p className="text-sm text-[#9ca3af]">
          {ca ? 'Darrera actualització: març de 2026' : 'Última actualización: marzo de 2026'}
        </p>
      </div>

      <Section title={ca ? '1. Responsable del tractament' : '1. Responsable del tratamiento'}>
        {ca ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr><th colSpan={2} className="border border-gray-300 p-2 bg-gray-50 text-center font-semibold">Informació sobre protecció de dades</th></tr></thead>
              <tbody>
                <tr><td className="border border-gray-300 p-2 font-medium w-36">Identitat</td><td className="border border-gray-300 p-2">ALBERT ALFOCEA URBANO</td></tr>
                <tr><td className="border border-gray-300 p-2 font-medium">Adreça postal</td><td className="border border-gray-300 p-2">Urbanització Hort de Godí, Edif. Turó de Vila II 4t 6a, AD200 Encamp</td></tr>
                <tr><td className="border border-gray-300 p-2 font-medium">Telèfon</td><td className="border border-gray-300 p-2">+376 378 606</td></tr>
                <tr><td className="border border-gray-300 p-2 font-medium">Correu electrònic</td><td className="border border-gray-300 p-2"><a href="mailto:hola@habitacio.ad" className="text-[#1a3c5e] underline">hola@habitacio.ad</a></td></tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr><th colSpan={2} className="border border-gray-300 p-2 bg-gray-50 text-center font-semibold">Información sobre protección de datos</th></tr></thead>
              <tbody>
                <tr><td className="border border-gray-300 p-2 font-medium w-36">Identidad</td><td className="border border-gray-300 p-2">ALBERT ALFOCEA URBANO</td></tr>
                <tr><td className="border border-gray-300 p-2 font-medium">Dirección postal</td><td className="border border-gray-300 p-2">Urbanització Hort de Godí, Edif. Turó de Vila II 4t 6a, AD200 Encamp</td></tr>
                <tr><td className="border border-gray-300 p-2 font-medium">Teléfono</td><td className="border border-gray-300 p-2">+376 378 606</td></tr>
                <tr><td className="border border-gray-300 p-2 font-medium">Correo electrónico</td><td className="border border-gray-300 p-2"><a href="mailto:hola@habitacio.ad" className="text-[#1a3c5e] underline">hola@habitacio.ad</a></td></tr>
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title={ca ? '2. Dades que recopilem' : '2. Datos que recopilamos'}>
        {ca ? (
          <>
            <p>Recopilem les següents dades personals:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>En registrar-te:</strong> nom, correu electrònic, foto de perfil (opcional), número de telèfon (opcional).</li>
              <li><strong>En publicar un anunci:</strong> descripció de l&apos;immoble, fotos, ubicació aproximada, preu i condicions.</li>
              <li><strong>En crear un perfil de cerca:</strong> preferències d&apos;habitació, pressupost, situació laboral, descripció personal.</li>
              <li><strong>En usar el xat:</strong> contingut dels missatges intercanviats amb altres usuaris.</li>
              <li><strong>Dades de navegació:</strong> adreça IP, tipus de navegador, pàgines visitades i cookies tècniques.</li>
            </ul>
          </>
        ) : (
          <>
            <p>Recopilamos los siguientes datos personales:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>Al registrarte:</strong> nombre, correo electrónico, foto de perfil (opcional), número de teléfono (opcional).</li>
              <li><strong>Al publicar un anuncio:</strong> descripción del inmueble, fotos, ubicación aproximada, precio y condiciones.</li>
              <li><strong>Al crear un perfil de búsqueda:</strong> preferencias de habitación, presupuesto, situación laboral, descripción personal.</li>
              <li><strong>Al usar el chat:</strong> contenido de los mensajes intercambiados con otros usuarios.</li>
              <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas y cookies técnicas.</li>
            </ul>
          </>
        )}
      </Section>

      <Section title={ca ? '3. Finalitat del tractament' : '3. Finalidad del tratamiento'}>
        {ca ? (
          <>
            <p>Utilitzem les teves dades per a:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Gestionar el teu compte i accés a la plataforma.</li>
              <li>Publicar i mostrar els teus anuncis o perfil de cerca.</li>
              <li>Facilitar la comunicació entre usuaris a través del xat intern.</li>
              <li>Enviar-te notificacions relacionades amb el servei (nous missatges, estat de l&apos;anunci).</li>
              <li>Millorar la plataforma mitjançant anàlisi d&apos;ús anònim.</li>
              <li>Complir amb obligacions legals aplicables.</li>
            </ul>
          </>
        ) : (
          <>
            <p>Utilizamos tus datos para:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Gestionar tu cuenta y acceso a la plataforma.</li>
              <li>Publicar y mostrar tus anuncios o perfil de búsqueda.</li>
              <li>Facilitar la comunicación entre usuarios a través del chat interno.</li>
              <li>Enviarte notificaciones relacionadas con el servicio (nuevos mensajes, estado del anuncio).</li>
              <li>Mejorar la plataforma mediante análisis de uso anónimo.</li>
              <li>Cumplir con obligaciones legales aplicables.</li>
            </ul>
          </>
        )}
      </Section>

      <Section title={ca ? '4. Base legal del tractament' : '4. Base legal del tratamiento'}>
        {ca ? (
          <>
            <p>El tractament de les teves dades es basa en:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>Execució de contracte:</strong> per prestar-te el servei sol·licitat en registrar-te.</li>
              <li><strong>Consentiment:</strong> per a l&apos;enviament de comunicacions opcionals.</li>
              <li><strong>Interès legítim:</strong> per a la millora del servei i seguretat de la plataforma.</li>
            </ul>
          </>
        ) : (
          <>
            <p>El tratamiento de tus datos se basa en:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>Ejecución de contrato:</strong> para prestarte el servicio solicitado al registrarte.</li>
              <li><strong>Consentimiento:</strong> para el envío de comunicaciones opcionales.</li>
              <li><strong>Interés legítimo:</strong> para la mejora del servicio y seguridad de la plataforma.</li>
            </ul>
          </>
        )}
      </Section>

      <Section title={ca ? '5. Conservació de dades' : '5. Conservación de datos'}>
        {ca ? (
          <>
            <p>Conservem les teves dades mentre mantinguis un compte actiu a la plataforma. Si elimines el teu compte, les teves dades personals seran suprimides en un termini màxim de 30 dies, tret que la llei n&apos;exigeixi la conservació per un període més llarg.</p>
            <p>Els missatges de xat es conserven mentre tots dos usuaris mantinguin els seus comptes actius.</p>
          </>
        ) : (
          <>
            <p>Conservamos tus datos mientras mantengas una cuenta activa en la plataforma. Si eliminas tu cuenta, tus datos personales serán suprimidos en un plazo máximo de 30 días, salvo que la ley exija su conservación por un período mayor.</p>
            <p>Los mensajes de chat se conservan mientras ambos usuarios mantengan sus cuentas activas.</p>
          </>
        )}
      </Section>

      <Section title={ca ? '6. Cessió de dades a tercers' : '6. Cesión de datos a terceros'}>
        {ca ? (
          <>
            <p>No venem ni cedim les teves dades personals a tercers amb fins comercials. Només compartim dades amb:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>Supabase:</strong> proveïdor d&apos;infraestructura i base de dades (allotjament segur a la UE).</li>
              <li><strong>Vercel:</strong> proveïdor d&apos;allotjament web.</li>
              <li><strong>Google:</strong> per a autenticació OAuth (si uses &quot;Inicia sessió amb Google&quot;).</li>
            </ul>
            <p>Tots els proveïdors compleixen els estàndards de protecció de dades aplicables.</p>
          </>
        ) : (
          <>
            <p>No vendemos ni cedemos tus datos personales a terceros con fines comerciales. Únicamente compartimos datos con:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>Supabase:</strong> proveedor de infraestructura y base de datos (alojamiento seguro en la UE).</li>
              <li><strong>Vercel:</strong> proveedor de alojamiento web.</li>
              <li><strong>Google:</strong> para autenticación OAuth (si usas &quot;Iniciar sesión con Google&quot;).</li>
            </ul>
            <p>Todos los proveedores cumplen con los estándares de protección de datos aplicables.</p>
          </>
        )}
      </Section>

      <Section title={ca ? '7. Els teus drets' : '7. Tus derechos'}>
        {ca ? (
          <>
            <p>Tens dret a:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>Accés:</strong> saber quines dades tenim sobre tu.</li>
              <li><strong>Rectificació:</strong> corregir dades inexactes o incompletes.</li>
              <li><strong>Supressió:</strong> sol·licitar l&apos;eliminació de les teves dades.</li>
              <li><strong>Portabilitat:</strong> rebre les teves dades en format estructurat.</li>
              <li><strong>Oposició:</strong> oposar-te al tractament basat en interès legítim.</li>
            </ul>
            <p>Per exercir aquests drets, escriu-nos a <a href="mailto:hola@habitacio.ad" className="text-[#1a3c5e] underline">hola@habitacio.ad</a>.</p>
          </>
        ) : (
          <>
            <p>Tienes derecho a:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>Acceso:</strong> conocer qué datos tenemos sobre ti.</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong>Supresión:</strong> solicitar la eliminación de tus datos.</li>
              <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado.</li>
              <li><strong>Oposición:</strong> oponerte al tratamiento basado en interés legítimo.</li>
            </ul>
            <p>Para ejercer estos derechos, escríbenos a <a href="mailto:hola@habitacio.ad" className="text-[#1a3c5e] underline">hola@habitacio.ad</a>.</p>
          </>
        )}
      </Section>

      <Section title={ca ? '8. Seguretat' : '8. Seguridad'}>
        <p>
          {ca
            ? "Apliquem mesures tècniques i organitzatives per protegir les teves dades: xifratge en trànsit (HTTPS), autenticació segura, control d'accés i còpies de seguretat periòdiques."
            : "Aplicamos medidas técnicas y organizativas para proteger tus datos: cifrado en tránsito (HTTPS), autenticación segura, control de acceso y copias de seguridad periódicas."}
        </p>
      </Section>

      <Section title={ca ? '9. Canvis en aquesta política' : '9. Cambios en esta política'}>
        <p>
          {ca
            ? "Podem actualitzar aquesta política periòdicament. T'informarem de canvis significatius per correu electrònic o mitjançant un avís a la plataforma."
            : "Podemos actualizar esta política periódicamente. Te notificaremos de cambios significativos por correo electrónico o mediante un aviso en la plataforma."}
        </p>
      </Section>

    </div>
  )
}

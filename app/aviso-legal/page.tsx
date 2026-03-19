import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso Legal — Habitacio.ad',
  description: 'Aviso legal y condiciones de uso de Habitacio.ad, plataforma de habitaciones en alquiler en Andorra.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-[#1a3c5e] border-l-4 border-[#1a3c5e] pl-3">{title}</h2>
      <div className="text-[#374151] text-sm leading-relaxed flex flex-col gap-2">{children}</div>
    </section>
  )
}

export default function AvisoLegalPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-10">

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#1a3c5e]">Aviso Legal</h1>
        <p className="text-sm text-[#9ca3af]">Última actualización: marzo de 2026</p>
      </div>

      <Section title="1. Datos del titular">
        <p>En cumplimiento de la normativa vigente en el Principado de Andorra, se informa que el titular de este sitio web es:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>Plataforma:</strong> Habitacio.ad</li>
          <li><strong>Correo de contacto:</strong> hola@habitacio.ad</li>
          <li><strong>País de operación:</strong> Principado de Andorra</li>
        </ul>
      </Section>

      <Section title="2. Objeto y ámbito de aplicación">
        <p>Habitacio.ad es una plataforma digital de intermediación que pone en contacto a personas que buscan habitación en alquiler con propietarios o arrendadores ubicados en Andorra.</p>
        <p>La plataforma actúa como mero intermediario y no es parte de ningún contrato de arrendamiento que se pueda formalizar entre usuarios. Habitacio.ad no garantiza la disponibilidad, veracidad ni exactitud de los anuncios publicados por terceros.</p>
      </Section>

      <Section title="3. Condiciones de uso">
        <p>El acceso y uso de esta plataforma implica la aceptación plena de las presentes condiciones. El usuario se compromete a:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Hacer un uso lícito, correcto y no fraudulento del servicio.</li>
          <li>No publicar contenido falso, engañoso, ofensivo o que infrinja derechos de terceros.</li>
          <li>No utilizar la plataforma para actividades ilícitas o contrarias a la normativa andorrana.</li>
          <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
        </ul>
      </Section>

      <Section title="4. Propiedad intelectual">
        <p>Todos los contenidos del sitio web (diseño, textos, imágenes, logotipos, código fuente) son propiedad de Habitacio.ad o de sus respectivos autores, y están protegidos por la normativa de propiedad intelectual e industrial.</p>
        <p>Se prohíbe su reproducción, distribución, modificación o comunicación pública sin autorización expresa y por escrito.</p>
      </Section>

      <Section title="5. Responsabilidad">
        <p>Habitacio.ad no se responsabiliza de:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>La veracidad o exactitud de la información incluida en los anuncios por los usuarios.</li>
          <li>Los daños o perjuicios derivados del uso o imposibilidad de uso de la plataforma.</li>
          <li>Las relaciones contractuales establecidas entre usuarios a través de la plataforma.</li>
          <li>Interrupciones del servicio por causas técnicas o de fuerza mayor.</li>
        </ul>
      </Section>

      <Section title="6. Modificaciones">
        <p>Habitacio.ad se reserva el derecho de modificar las presentes condiciones en cualquier momento. Los cambios serán efectivos desde su publicación en el sitio web. El uso continuado de la plataforma implica la aceptación de las condiciones vigentes.</p>
      </Section>

      <Section title="7. Legislación aplicable">
        <p>Las presentes condiciones se rigen por la legislación vigente en el Principado de Andorra. Para cualquier controversia derivada del uso de esta plataforma, las partes se someten a los tribunales competentes de Andorra.</p>
      </Section>

    </div>
  )
}

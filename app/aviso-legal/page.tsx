import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'

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

export default async function AvisoLegalPage() {
  const locale = await getLocale()
  const ca = locale === 'ca'

  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-10">

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#1a3c5e]">
          {ca ? 'Avís Legal' : 'Aviso Legal'}
        </h1>
        <p className="text-sm text-[#9ca3af]">
          {ca ? 'Darrera actualització: març de 2026' : 'Última actualización: marzo de 2026'}
        </p>
      </div>

      <Section title={ca ? '1. Dades del titular' : '1. Datos del titular'}>
        {ca ? (
          <>
            <p>En compliment de la normativa vigent al Principat d&apos;Andorra, s&apos;informa que el titular d&apos;aquest lloc web és:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>Plataforma:</strong> Habitacio.ad</li>
              <li><strong>Correu de contacte:</strong> hola@habitacio.ad</li>
              <li><strong>País d&apos;operació:</strong> Principat d&apos;Andorra</li>
            </ul>
          </>
        ) : (
          <>
            <p>En cumplimiento de la normativa vigente en el Principado de Andorra, se informa que el titular de este sitio web es:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>Plataforma:</strong> Habitacio.ad</li>
              <li><strong>Correo de contacto:</strong> hola@habitacio.ad</li>
              <li><strong>País de operación:</strong> Principado de Andorra</li>
            </ul>
          </>
        )}
      </Section>

      <Section title={ca ? '2. Objecte i àmbit d\'aplicació' : '2. Objeto y ámbito de aplicación'}>
        {ca ? (
          <>
            <p>Habitacio.ad és una plataforma digital d&apos;intermediació que posa en contacte persones que busquen habitació de lloguer amb propietaris o arrendadors ubicats a Andorra.</p>
            <p>La plataforma actua com a mer intermediari i no és part de cap contracte d&apos;arrendament que es pugui formalitzar entre usuaris. Habitacio.ad no garanteix la disponibilitat, veracitat ni exactitud dels anuncis publicats per tercers.</p>
          </>
        ) : (
          <>
            <p>Habitacio.ad es una plataforma digital de intermediación que pone en contacto a personas que buscan habitación en alquiler con propietarios o arrendadores ubicados en Andorra.</p>
            <p>La plataforma actúa como mero intermediario y no es parte de ningún contrato de arrendamiento que se pueda formalizar entre usuarios. Habitacio.ad no garantiza la disponibilidad, veracidad ni exactitud de los anuncios publicados por terceros.</p>
          </>
        )}
      </Section>

      <Section title={ca ? "3. Condicions d'ús" : '3. Condiciones de uso'}>
        {ca ? (
          <>
            <p>L&apos;accés i ús d&apos;aquesta plataforma implica l&apos;acceptació plena de les presents condicions. L&apos;usuari es compromet a:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Fer un ús lícit, correcte i no fraudulent del servei.</li>
              <li>No publicar contingut fals, enganyós, ofensiu o que infringeixi drets de tercers.</li>
              <li>No utilitzar la plataforma per a activitats il·lícites o contràries a la normativa andorrana.</li>
              <li>Mantenir la confidencialitat de les seves credencials d&apos;accés.</li>
            </ul>
          </>
        ) : (
          <>
            <p>El acceso y uso de esta plataforma implica la aceptación plena de las presentes condiciones. El usuario se compromete a:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Hacer un uso lícito, correcto y no fraudulento del servicio.</li>
              <li>No publicar contenido falso, engañoso, ofensivo o que infrinja derechos de terceros.</li>
              <li>No utilizar la plataforma para actividades ilícitas o contrarias a la normativa andorrana.</li>
              <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
            </ul>
          </>
        )}
      </Section>

      <Section title={ca ? '4. Propietat intel·lectual' : '4. Propiedad intelectual'}>
        {ca ? (
          <>
            <p>Tots els continguts del lloc web (disseny, textos, imatges, logotips, codi font) són propietat de Habitacio.ad o dels seus respectius autors, i estan protegits per la normativa de propietat intel·lectual i industrial.</p>
            <p>Se&apos;n prohibeix la reproducció, distribució, modificació o comunicació pública sense autorització expressa i per escrit.</p>
          </>
        ) : (
          <>
            <p>Todos los contenidos del sitio web (diseño, textos, imágenes, logotipos, código fuente) son propiedad de Habitacio.ad o de sus respectivos autores, y están protegidos por la normativa de propiedad intelectual e industrial.</p>
            <p>Se prohíbe su reproducción, distribución, modificación o comunicación pública sin autorización expresa y por escrito.</p>
          </>
        )}
      </Section>

      <Section title={ca ? '5. Responsabilitat' : '5. Responsabilidad'}>
        {ca ? (
          <>
            <p>Habitacio.ad no es responsabilitza de:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>La veracitat o exactitud de la informació inclosa en els anuncis pels usuaris.</li>
              <li>Els danys o perjudicis derivats de l&apos;ús o impossibilitat d&apos;ús de la plataforma.</li>
              <li>Les relacions contractuals establertes entre usuaris a través de la plataforma.</li>
              <li>Interrupcions del servei per causes tècniques o de força major.</li>
            </ul>
          </>
        ) : (
          <>
            <p>Habitacio.ad no se responsabiliza de:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>La veracidad o exactitud de la información incluida en los anuncios por los usuarios.</li>
              <li>Los daños o perjuicios derivados del uso o imposibilidad de uso de la plataforma.</li>
              <li>Las relaciones contractuales establecidas entre usuarios a través de la plataforma.</li>
              <li>Interrupciones del servicio por causas técnicas o de fuerza mayor.</li>
            </ul>
          </>
        )}
      </Section>

      <Section title={ca ? '6. Modificacions' : '6. Modificaciones'}>
        <p>
          {ca
            ? "Habitacio.ad es reserva el dret de modificar les presents condicions en qualsevol moment. Els canvis seran efectius des de la seva publicació al lloc web. L'ús continuat de la plataforma implica l'acceptació de les condicions vigents."
            : "Habitacio.ad se reserva el derecho de modificar las presentes condiciones en cualquier momento. Los cambios serán efectivos desde su publicación en el sitio web. El uso continuado de la plataforma implica la aceptación de las condiciones vigentes."}
        </p>
      </Section>

      <Section title={ca ? '7. Legislació aplicable' : '7. Legislación aplicable'}>
        <p>
          {ca
            ? "Les presents condicions es regeixen per la legislació vigent al Principat d'Andorra. Per a qualsevol controvèrsia derivada de l'ús d'aquesta plataforma, les parts se sotmeten als tribunals competents d'Andorra."
            : "Las presentes condiciones se rigen por la legislación vigente en el Principado de Andorra. Para cualquier controversia derivada del uso de esta plataforma, las partes se someten a los tribunales competentes de Andorra."}
        </p>
      </Section>

    </div>
  )
}

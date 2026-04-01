import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Habitacio.ad',
  description: 'Términos y condiciones generales de uso de Habitacio.ad para anunciantes y huéspedes.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-[#1a3c5e] border-l-4 border-[#1a3c5e] pl-3">{title}</h2>
      <div className="text-[#374151] text-sm leading-relaxed flex flex-col gap-2">{children}</div>
    </section>
  )
}

export default async function TerminosPage() {
  const locale = await getLocale()
  const ca = locale === 'ca'

  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-10">

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#1a3c5e]">
          {ca ? 'Termes i Condicions Generals d\'Ús' : 'Términos y Condiciones Generales de Uso'}
        </h1>
        <p className="text-sm text-[#6b7280]">
          {ca ? 'Per a Anunciants i Hostes a HABITACIO.AD' : 'Para Anunciantes y Huéspedes en HABITACIO.AD'}
        </p>
        <p className="text-sm text-[#9ca3af]">
          {ca ? 'Darrera actualització: abril de 2026' : 'Última actualización: abril de 2026'}
        </p>
      </div>

      <p className="text-sm text-[#374151] leading-relaxed">
        {ca
          ? "El present document estableix els Termes i Condicions Generals d'Ús (d'ara endavant, \"TCG\") que regulen l'accés i la utilització de la plataforma web https://www.habitacio.ad/ (d'ara endavant, \"la Web\" o \"HABITACIO.AD\"), titularitat d'ALBERT ALFOCEA URBANO (d'ara endavant, el \"Prestador del Servei\"). L'ús de la plataforma per part de qualsevol usuari, ja sigui Anunciant o Hoste, implica l'acceptació plena d'aquests TCG."
          : "El presente documento establece los Términos y Condiciones Generales de Uso (en adelante, \"TCG\") que regulan el acceso y utilización de la plataforma web https://www.habitacio.ad/ (en adelante, \"la Web\" o \"HABITACIO.AD\"), titularidad de ALBERT ALFOCEA URBANO (en adelante, el \"Prestador del Servicio\"). El uso de la plataforma por parte de cualquier usuario, ya sea Anunciante o Huésped, implica la aceptación plena de estos TCG."}
      </p>

      <Section title={ca ? '1. Objecte del Servei' : '1. Objeto del Servicio'}>
        {ca ? (
          <>
            <p>HABITACIO.AD és una plataforma que té per objecte facilitar el contacte i la comunicació entre:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>Anunciants:</strong> Propietaris o usuaris que publiquen anuncis d&apos;habitacions disponibles per llogar.</li>
              <li><strong>Hostes:</strong> Usuaris que busquen habitacions mitjançant filtres i perfils de demanda.</li>
            </ul>
            <p>El Prestador del Servei actua exclusivament com a intermediari tecnològic, facilitant la publicació d&apos;anuncis i la gestió de la visibilitat de perfils perquè les parts puguin contactar amb la finalitat d&apos;una possible contractació.</p>
          </>
        ) : (
          <>
            <p>HABITACIO.AD es una plataforma que tiene por objeto facilitar el contacto y la comunicación entre:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>Anunciantes:</strong> Propietarios o usuarios que publican anuncios de habitaciones disponibles para alquilar.</li>
              <li><strong>Huéspedes:</strong> Usuarios que buscan habitaciones mediante filtros y perfiles de demanda.</li>
            </ul>
            <p>El Prestador del Servicio actúa exclusivamente como intermediario tecnológico, facilitando la publicación de anuncios y la gestión de la visibilidad de perfiles para que las partes puedan contactar con el fin de una posible contratación.</p>
          </>
        )}
      </Section>

      <Section title={ca ? '2. Obligacions de l\'Anunciant' : '2. Obligaciones del Anunciante'}>
        {ca ? (
          <>
            <p>L&apos;Anunciant, en publicar una habitació, assumeix les obligacions i responsabilitats següents:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li><strong>Habilitació Legal i Compliment Normatiu:</strong> És responsabilitat exclusiva de l&apos;Anunciant estar legalment habilitat per anunciar i llogar l&apos;habitació al territori d&apos;Andorra. L&apos;Anunciant ha de verificar i complir totes les normatives, llicències i requisits legals, tributaris, administratius o de qualsevol altra índole que siguin d&apos;aplicació per a l&apos;arrendament de l&apos;habitació.</li>
              <li><strong>Veracitat i Exactitud de l&apos;Anunci:</strong> L&apos;Anunciant és l&apos;únic responsable de la veracitat, exactitud, qualitat i legalitat de tota la informació, textos, descripcions, fotografies, preus i disponibilitat inclosos en el seu anunci.</li>
              <li><strong>Gestió del Compte:</strong> L&apos;Anunciant és responsable de la creació i gestió del seu compte d&apos;usuari i dels pagaments realitzats a través de la plataforma per serveis addicionals (p. ex., destacats, promocions).</li>
              <li><strong>Pagament de serveis:</strong> L&apos;Anunciant s&apos;obliga al pagament dels serveis contractats a través de la plataforma, reservant-se HABITACIO.AD el dret a suspendre o desactivar l&apos;anunci en cas d&apos;impagament.</li>
              <li><strong>Prohibició d&apos;Spam i Pràctiques Enganyoses:</strong> L&apos;Anunciant es compromet a no utilitzar la plataforma per enviar comunicacions no sol·licitades (spam) a Hostes o altres usuaris, ni a participar en pràctiques que manipulin o enganyin els usuaris sobre la naturalesa, disponibilitat o condicions de l&apos;habitació anunciada.</li>
            </ul>
          </>
        ) : (
          <>
            <p>El Anunciante, al publicar una habitación, asume las siguientes obligaciones y responsabilidades:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li><strong>Habilitación Legal y Cumplimiento Normativo:</strong> Es responsabilidad exclusiva del Anunciante estar legalmente habilitado para anunciar y alquilar la habitación en el territorio de Andorra. El Anunciante debe verificar y cumplir con todas las normativas, licencias y requisitos legales, tributarios, administrativos o de cualquier otra índole que sean de aplicación para el arrendamiento de la habitación.</li>
              <li><strong>Veracidad y Exactitud del Anuncio:</strong> El Anunciante es el único responsable de la veracidad, exactitud, calidad y legalidad de toda la información, textos, descripciones, fotografías, precios y disponibilidad incluidos en su anuncio.</li>
              <li><strong>Gestión de la Cuenta:</strong> El Anunciante es responsable de la creación y gestión de su cuenta de usuario y de los pagos realizados a través de la plataforma por servicios adicionales (p. ej., destacados, promociones).</li>
              <li><strong>Pago de servicios:</strong> El Anunciante se obliga al pago de los servicios contratados a través de la plataforma, reservándose HABITACIO.AD el derecho a suspender o desactivar el anuncio en caso de impago.</li>
              <li><strong>Prohibición de Spam y Prácticas Engañosas:</strong> El Anunciante se compromete a no utilizar la plataforma para enviar comunicaciones no solicitadas (spam) a Huéspedes u otros usuarios, ni a participar en prácticas que manipulen o engañen a los usuarios sobre la naturaleza, disponibilidad o condiciones de la habitación anunciada.</li>
            </ul>
          </>
        )}
      </Section>

      <Section title={ca ? '3. Obligacions de l\'Hoste' : '3. Obligaciones del Huésped'}>
        {ca ? (
          <>
            <p>L&apos;Hoste es compromet a:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li><strong>Ús Conforme a la Llei:</strong> Utilitzar la Web, els seus continguts i serveis de conformitat amb la Llei d&apos;Andorra, aquests TCG, els bons costums i l&apos;ordre públic.</li>
              <li><strong>Veracitat del Perfil de Demanda:</strong> És responsable de la informació proporcionada en el seu perfil de demanda (zona, pressupost, data d&apos;entrada, preferències).</li>
              <li><strong>Prohibició d&apos;Ús Il·lícit:</strong> No utilitzar la Web amb fins o efectes il·lícits o lesius d&apos;interessos o drets de tercers.</li>
            </ul>
          </>
        ) : (
          <>
            <p>El Huésped se compromete a:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li><strong>Uso Conforme a la Ley:</strong> Utilizar la Web, sus contenidos y servicios de conformidad con la Ley de Andorra, estos TCG, las buenas costumbres y el orden público.</li>
              <li><strong>Veracidad del Perfil de Demanda:</strong> Es responsable de la información proporcionada en su perfil de demanda (zona, presupuesto, fecha de entrada, preferencias).</li>
              <li><strong>Prohibición de Uso Ilícito:</strong> No utilizar la Web con fines o efectos ilícitos o lesivos de intereses o derechos de terceros.</li>
            </ul>
          </>
        )}
      </Section>

      <Section title={ca ? '4. Obligacions Comunes d\'Anunciants i Hostes' : '4. Obligaciones Comunes de Anunciantes y Huéspedes'}>
        {ca ? (
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li><strong>Ús d&apos;Eines Automatitzades i Contingut:</strong> Es prohibeix expressament als usuaris utilitzar o introduir motors, robots, aranyes (spiders) o qualsevol altre mecanisme automatitzat per a la recollida, indexació o mineria de dades dels continguts, informació, bases de dades o perfils de la Web, excepte aquells específicament autoritzats pel Prestador del Servei.</li>
            <li><strong>Respecte a la Propietat Intel·lectual:</strong> Respectar els drets de propietat intel·lectual i industrial sobre la Web i els seus continguts, quedant prohibida tota reproducció, distribució, comunicació pública o transformació de qualsevol element sense el consentiment exprés de HABITACIO.AD.</li>
            <li><strong>Integritat de la Plataforma:</strong> Abstenir-se de dur a terme qualsevol acció que pugui destruir, alterar, inutilitzar o danyar els programes o documents electrònics de la Web.</li>
          </ul>
        ) : (
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li><strong>Uso de Herramientas Automatizadas y Contenido:</strong> Se prohíbe expresamente a los usuarios utilizar o introducir motores, robots, arañas (spiders) o cualquier otro mecanismo automatizado para la recopilación, indexación o minería de datos de los contenidos, información, bases de datos o perfiles de la Web, salvo aquellos específicamente autorizados por el Prestador del Servicio.</li>
            <li><strong>Respeto a la Propiedad Intelectual:</strong> Respetar los derechos de propiedad intelectual e industrial sobre la Web y sus contenidos, quedando prohibida toda reproducción, distribución, comunicación pública o transformación de cualquier elemento sin el consentimiento expreso de HABITACIO.AD.</li>
            <li><strong>Integridad de la Plataforma:</strong> Abstenerse de llevar a cabo cualquier acción que pueda destruir, alterar, inutilizar o dañar los programas o documentos electrónicos de la Web.</li>
          </ul>
        )}
      </Section>

      <Section title={ca ? '5. Limitació de Responsabilitat de HABITACIO.AD' : '5. Limitación de Responsabilidad de HABITACIO.AD'}>
        {ca ? (
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li><strong>Exclusió de Responsabilitat per la Relació Directa:</strong> HABITACIO.AD actua exclusivament com a plataforma de posada en contacte. <strong>La responsabilitat de la Web es limita en tot moment als serveis d&apos;intermediació tecnològica.</strong> En conseqüència, HABITACIO.AD no es fa responsable de la relació directa que s&apos;estableixi entre l&apos;Anunciant i l&apos;Hoste un cop posats en contacte a través de la plataforma.</li>
            <li><strong>Acords i Contractació:</strong> El Prestador del Servei no forma part, ni intervé, ni assumeix responsabilitat alguna respecte als acords, contractes, pagaments, condicions de lloguer, fiances, qualitat de l&apos;habitació, danys o perjudicis que poguessin sorgir entre l&apos;Anunciant i l&apos;Hoste.</li>
            <li><strong>Supervisió i Verificació:</strong> HABITACIO.AD no té l&apos;obligació de verificar la legalitat o la capacitat dels Anunciants per llogar, ni la veracitat de la informació dels anuncis o perfils.</li>
            <li><strong>Danys Derivats:</strong> El Prestador del Servei no es responsabilitza de qualsevol conseqüència, dany o perjudici que pogués derivar-se de l&apos;arrendament de l&apos;habitació o de l&apos;ús de l&apos;immoble per part de l&apos;Hoste.</li>
          </ul>
        ) : (
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li><strong>Exclusión de Responsabilidad por la Relación Directa:</strong> HABITACIO.AD actúa exclusivamente como plataforma de puesta en contacto. <strong>La responsabilidad de la Web se limita en todo momento a los servicios de intermediación tecnológica.</strong> En consecuencia, HABITACIO.AD no se hace responsable de la relación directa que se establezca entre el Anunciante y el Huésped una vez puestos en contacto a través de la plataforma.</li>
            <li><strong>Acuerdos y Contratación:</strong> El Prestador del Servicio no forma parte, ni interviene, ni asume responsabilidad alguna respecto a los acuerdos, contratos, pagos, condiciones de alquiler, fianzas, calidad de la habitación, daños o perjuicios que pudieran surgir entre el Anunciante y el Huésped.</li>
            <li><strong>Supervisión y Verificación:</strong> HABITACIO.AD no tiene la obligación de verificar la legalidad o la capacidad de los Anunciantes para alquilar, ni la veracidad de la información de los anuncios o perfiles.</li>
            <li><strong>Daños Derivados:</strong> El Prestador del Servicio no se responsabiliza de cualquier consecuencia, daño o perjuicio que pudiera derivarse del arrendamiento de la habitación o del uso del inmueble por parte del Huésped.</li>
          </ul>
        )}
      </Section>

      <Section title={ca ? '6. Legislació Aplicable i Jurisdicció Competent' : '6. Legislación Aplicable y Jurisdicción Competente'}>
        <p>
          {ca
            ? "Els presents TCG queden subjectes al que estableixen les lleis d'Andorra. Per a la resolució de qualsevol conflicte derivat de la interpretació o execució dels mateixos, les parts se sotmeten expressament a la jurisdicció dels Tribunals d'Andorra la Vella."
            : "Los presentes TCG quedan sujetos a lo establecido en las leyes de Andorra. Para la resolución de cualquier conflicto derivado de la interpretación o ejecución de los mismos, las partes se someten expresamente a la jurisdicción de los Tribunales de Andorra la Vella."}
        </p>
      </Section>

    </div>
  )
}

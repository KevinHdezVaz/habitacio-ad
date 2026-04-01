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
          {ca ? 'Darrera actualització: abril de 2026' : 'Última actualización: abril de 2026'}
        </p>
      </div>

      <Section title={ca ? '1. Dades del titular' : '1. Datos del titular'}>
        {ca ? (
          <>
            <p>En compliment de l&apos;article 6 de la Llei 20/2014, de 16 d&apos;octubre, reguladora de la contractació electrònica i dels operadors que desenvolupen la seva activitat econòmica en un espai digital, s&apos;informa que el titular d&apos;aquest lloc web és:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>Titular:</strong> ALBERT ALFOCEA URBANO</li>
              <li><strong>Plataforma:</strong> Habitacio.ad</li>
              <li><strong>Adreça:</strong> Urbanització Hort de Godí, Edif. Turó de Vila II 4t 6a, AD200 Encamp</li>
              <li><strong>Telèfon:</strong> +376 378 606</li>
              <li><strong>Correu de contacte:</strong> hola@habitacio.ad</li>
            </ul>
          </>
        ) : (
          <>
            <p>En cumplimiento del artículo 6 de la Ley 20/2014, de 16 de octubre, reguladora de la contratación electrónica y de los operadores que desarrollan su actividad económica en un espacio digital, se informa que el titular de este sitio web es:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>Titular:</strong> ALBERT ALFOCEA URBANO</li>
              <li><strong>Plataforma:</strong> Habitacio.ad</li>
              <li><strong>Dirección:</strong> Urbanització Hort de Godí, Edif. Turó de Vila II 4t 6a, AD200 Encamp</li>
              <li><strong>Teléfono:</strong> +376 378 606</li>
              <li><strong>Correo de contacto:</strong> hola@habitacio.ad</li>
            </ul>
          </>
        )}
      </Section>

      <Section title={ca ? '2. Propietat intel·lectual, industrial i responsabilitat sobre els continguts' : '2. Propiedad intelectual, industrial y responsabilidad sobre los contenidos'}>
        {ca ? (
          <ol className="list-decimal pl-5 flex flex-col gap-2">
            <li>Els drets de propietat intel·lectual del present lloc web, el seu codi font, disseny, fotografies, textos, estructura de navegació, bases de dades, marques, logotips, noms comercials i els diferents elements que conté, són titularitat del Prestador del Servei, a qui correspon l&apos;exercici exclusiu dels drets d&apos;explotació en qualsevol forma i, en especial, els drets de reproducció, distribució, comunicació pública i transformació.</li>
            <li>Queda prohibit qualsevol ús de tots els continguts del lloc web, concretament sobre els textos, disseny, obres, marques, logotips, codi font i qualsevol altre susceptible de protecció, sense l&apos;autorització expressa dels seus titulars. Qualsevol ús no permès serà degudament perseguit pels propietaris legítims. Igualment, tots els noms comercials, marques o signes distintius de qualsevol classe continguts al lloc web estan protegits per la llei.</li>
            <li>El titular del lloc web no es fa responsable dels continguts als quals es dirigeixen els enllaços ubicats en aquest.</li>
            <li>Els usuaris no podran emprar els continguts de la web, no podent prendre&apos;ls, reproduir-los i distribuir-los, ni utilitzar-los amb fins comercials ni manipular-los i realitzar obres derivades, sense haver obtingut prèviament el consentiment o autorització del Prestador del Servei.</li>
          </ol>
        ) : (
          <ol className="list-decimal pl-5 flex flex-col gap-2">
            <li>Los derechos de propiedad intelectual de la presente página web, su código fuente, diseño, fotografías, textos, estructura de navegación, bases de datos, marcas, logotipos, nombres comerciales y diferentes elementos que se contienen, son titularidad del Prestador del Servicio, a quien corresponde el ejercicio exclusivo de los derechos de explotación en cualquier forma y, en especial, los derechos de reproducción, distribución, comunicación pública y transformación.</li>
            <li>Queda prohibido cualquier uso de todos los contenidos de la página web, concretamente sobre los textos, diseño, obras, marcas, logotipos, código fuente y cualquier otro susceptible de protección, sin la autorización expresa de sus titulares. Cualquier uso no permitido será debidamente perseguido por los propietarios legítimos. Igualmente, todos los nombres comerciales, marcas o signos distintivos de cualquier clase contenidos en la página web están protegidos por la ley.</li>
            <li>El titular de la página web no se hace responsable de los contenidos a los que se dirigen los enlaces ubicados en esta.</li>
            <li>Los usuarios no podrán emplear los contenidos de la web, no pudiendo tomarlos, reproducirlos y distribuirlos, ni utilizarlos con fines comerciales ni manipularlos y realizar obras derivadas, sin haber obtenido previamente el consentimiento o autorización del Prestador del Servicio.</li>
          </ol>
        )}
      </Section>

      <Section title={ca ? '3. Drets d\'autor i marca' : '3. Derechos de autor y marca'}>
        <p>
          {ca
            ? "HABITACIO.AD informa que els continguts propis, la programació i el disseny del lloc web es troben plenament protegits pels drets d'autor, quedant expressament prohibida tota reproducció, comunicació, distribució i transformació dels referits elements protegits tret del consentiment exprés de HABITACIO.AD."
            : "HABITACIO.AD informa que los contenidos propios, la programación y el diseño de la página web se encuentran plenamente protegidos por los derechos de autor, quedando expresamente prohibida toda reproducción, comunicación, distribución y transformación de los referidos elementos protegidos salvo el consentimiento expreso de HABITACIO.AD."}
        </p>
      </Section>

      <Section title={ca ? '4. Condicions d\'ús' : '4. Condiciones de uso'}>
        {ca ? (
          <>
            <p>Pel que fa a la web, l&apos;usuari pot visualitzar, imprimir i descarregar parcialment el contingut de la web, únicament si concorren les situacions següents:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Que sigui compatible amb la finalitat del lloc web.</li>
              <li>Que es realitzi amb l&apos;ànim exclusiu d&apos;obtenir la informació continguda per a ús personal i privat. Es prohibeix, doncs, expressament, la utilització amb fins comercials.</li>
              <li>Que cap gràfic, icona o imatge disponible a la web sigui utilitzat, copiat o distribuït separadament del text o de la resta d&apos;imatges que l&apos;acompanyen.</li>
            </ul>
            <p>L&apos;usuari es compromet a utilitzar el lloc web, els continguts i serveis de conformitat amb la Llei, aquest Avís Legal, els bons costums i l&apos;ordre públic. De la mateixa manera, l&apos;usuari s&apos;obliga a no utilitzar el lloc web, els seus continguts o serveis amb fins o efectes il·lícits, contraris a aquesta política legal, lesius d&apos;interessos o drets de tercers, o que puguin danyar, inutilitzar, fer inaccessibles o deteriorar el lloc web.</p>
          </>
        ) : (
          <>
            <p>En lo que respecta a la web, el usuario puede visualizar, imprimir y descargar parcialmente el contenido de la web, únicamente si concurren las siguientes situaciones:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Que sea compatible con la finalidad del sitio web.</li>
              <li>Que se realice con el ánimo exclusivo de obtener la información contenida para uso personal y privado. Se prohíbe así, expresamente, la utilización con fines comerciales.</li>
              <li>Que ningún gráfico, icono o imagen disponible en la web sea utilizado, copiado o distribuido separadamente del texto o del resto de imágenes que lo acompañan.</li>
            </ul>
            <p>El Usuario se compromete a utilizar la página web, los contenidos y servicios de conformidad con la Ley, este Aviso Legal, las buenas costumbres y el orden público. De la misma forma, el Usuario se obliga a no utilizar la página web, sus contenidos o servicios con fines o efectos ilícitos, contrarios a esta política legal, o lesivos de intereses o derechos de terceros, o que puedan dañar, inutilizar, hacer inaccesibles o deteriorar la página web.</p>
          </>
        )}
      </Section>

      <Section title={ca ? '5. Modificacions a la web i condicions d\'ús' : '5. Modificaciones en la web y condiciones de uso'}>
        <p>
          {ca
            ? "El Prestador del Servei es reserva el dret de modificar i actualitzar la informació continguda a la web, així com la seva configuració, presentació i condicions d'accés. Així mateix, el Prestador del Servei es reserva el dret d'actualitzar aquest avís legal sense previ avís als usuaris, quan la normativa o l'actualitat ho requereixi."
            : "El Prestador del Servicio se reserva el derecho de modificar y actualizar la información contenida en la web, así como su configuración, presentación y condiciones de acceso. Asimismo, el Prestador del Servicio se reserva el derecho de actualizar este aviso legal sin previo aviso a los usuarios, cuando así la normativa o la actualidad lo requiera."}
        </p>
      </Section>

      <Section title={ca ? '6. Limitació de responsabilitat' : '6. Limitación de responsabilidad'}>
        {ca ? (
          <>
            <p>El Prestador del Servei no garanteix la inexistència d&apos;errors o interrupcions en l&apos;accés a la web o al seu contingut ni que aquest estigui actualitzat. No obstant això, el Prestador del Servei durà a terme totes les accions que estiguin al seu abast per a la solució de qualsevol error, desconnexió o manca d&apos;actualització que pugui produir-se a la web.</p>
            <p>El Prestador del Servei tampoc es responsabilitza dels errors de seguretat o danys que es puguin produir com a conseqüència de:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>La presència d&apos;un virus a l&apos;ordinador dels usuaris que sigui utilitzat per a la connexió amb els serveis i els continguts de la web.</li>
              <li>Un mal funcionament del navegador.</li>
              <li>L&apos;ús de versions no actualitzades del navegador.</li>
            </ul>
          </>
        ) : (
          <>
            <p>El Prestador del Servicio no garantiza la inexistencia de errores o interrupciones en el acceso a la web o a su contenido ni que este esté actualizado. No obstante, el Prestador del Servicio llevará a cabo todas las acciones que estén a su alcance para la solución de cualquier error, desconexión o falta de actualización que pueda producirse en la web.</p>
            <p>El Prestador del Servicio tampoco se responsabiliza de los errores de seguridad o daños que se puedan producir como consecuencia de:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>La presencia de un virus en el ordenador de los usuarios que sea utilizado para la conexión con los servicios y los contenidos de la web.</li>
              <li>Un mal funcionamiento del navegador.</li>
              <li>El uso de versiones no actualizadas del navegador.</li>
            </ul>
          </>
        )}
      </Section>

      <Section title={ca ? '7. Legislació aplicable i jurisdicció competent' : '7. Legislación aplicable y jurisdicción competente'}>
        <p>
          {ca
            ? "Aquesta política legal queda subjecta al que estableixen les lleis d'Andorra. Per a qualsevol conflicte derivat de la interpretació de les mateixes, les parts se sotmeten a la jurisdicció dels Tribunals d'Andorra la Vella, sempre que això no sigui contrari al que disposa l'article 31 de la Llei 20/2014, de 16 d'octubre, reguladora de la contractació electrònica i dels operadors que desenvolupen la seva activitat econòmica en un espai digital."
            : "Esta política legal queda sujeta a lo establecido en las leyes de Andorra. Para cualquier conflicto derivado de la interpretación de las mismas, las partes se someten a la jurisdicción de los Tribunales de Andorra la Vella, siempre que ello no sea contrario a lo dispuesto en el artículo 31 de la Ley 20/2014, de 16 de octubre, reguladora de la contratación electrónica y de los operadores que desarrollan su actividad económica en un espacio digital."}
        </p>
      </Section>

    </div>
  )
}

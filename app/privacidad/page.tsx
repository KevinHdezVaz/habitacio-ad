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
          {ca ? 'Darrera actualització: abril de 2026' : 'Última actualización: abril de 2026'}
        </p>
      </div>

      {/* Tabla responsable */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th colSpan={2} className="border border-gray-300 p-2 bg-gray-50 text-center font-semibold">
                {ca ? 'Informació sobre protecció de dades' : 'Información sobre protección de datos'}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-medium w-36 align-top">
                {ca ? 'Denominació social' : 'Denominación social'}
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex flex-col gap-1">
                  <span><strong>{ca ? 'Identitat' : 'Identidad'}:</strong> ALBERT ALFOCEA URBANO</span>
                  <span><strong>{ca ? 'Adreça postal' : 'Dir. Postal'}:</strong> Urbanització Hort de Godí, Edif. Turó de Vila II 4t 6a, AD200 Encamp</span>
                  <span><strong>{ca ? 'Telèfon' : 'Tfno'}:</strong> +376 378 606</span>
                  <span><strong>Email:</strong> <a href="mailto:hola@habitacio.ad" className="text-[#1a3c5e] underline">hola@habitacio.ad</a></span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Section title={ca ? 'Finalitat — Per a què fem servir les dades?' : 'Finalidad — ¿Para qué usamos los datos?'}>
        {ca ? (
          <>
            <p>La present Política de privadesa estableix els termes en què tractarem les dades personals a HABITACIO.AD; això inclou qualsevol dada personal recollida a través del nostre lloc web, així com qualsevol altra dada que tractem en l&apos;exercici de les nostres activitats empresarials.</p>

            <p className="font-semibold">ANUNCIANTS (propietaris o usuaris que publiquen habitacions)</p>
            <p>Les dades personals recollides seran utilitzades per a:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Crear i gestionar el compte d&apos;usuari.</li>
              <li>Publicar anuncis d&apos;habitacions (zona, preu, descripció, fotos i disponibilitat).</li>
              <li>Gestionar la visibilitat dels anuncis.</li>
              <li>Contractar serveis de pagament (publicació, destacats, promocions).</li>
              <li>Permetre l&apos;accés a perfils de persones interessades en llogar.</li>
              <li>Facilitar el contacte amb usuaris interessats.</li>
              <li>Gestionar pagaments realitzats a través de la plataforma.</li>
            </ul>

            <p className="font-semibold">HOSTES (usuaris que busquen habitació)</p>
            <p>Les dades personals recollides seran utilitzades per a:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Crear i gestionar el compte d&apos;usuari.</li>
              <li>Buscar habitacions mitjançant filtres.</li>
              <li>Crear un perfil de demanda (zona, pressupost, data d&apos;entrada, preferències).</li>
              <li>Permetre la visibilitat del perfil als anunciants.</li>
              <li>Facilitar el contacte amb propietaris.</li>
              <li>Gestionar serveis addicionals en cas de contractació.</li>
            </ul>
          </>
        ) : (
          <>
            <p>La siguiente Política de privacidad establece los términos en que trataremos los datos personales en HABITACIO.AD; esto incluye cualquier dato personal recogido a través de nuestra página web, así como cualquier otro dato que tratemos en ejercicio de nuestras actividades empresariales.</p>

            <p className="font-semibold">ANUNCIANTES (propietarios o usuarios que publican habitaciones)</p>
            <p>Los datos personales recogidos serán utilizados para:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Crear y gestionar la cuenta de usuario.</li>
              <li>Publicar anuncios de habitaciones (zona, precio, descripción, fotos y disponibilidad).</li>
              <li>Gestionar la visibilidad de los anuncios.</li>
              <li>Contratar servicios de pago (publicación, destacados, promociones).</li>
              <li>Permitir el acceso a perfiles de personas interesadas en alquilar.</li>
              <li>Facilitar el contacto con usuarios interesados.</li>
              <li>Gestionar pagos realizados a través de la plataforma.</li>
            </ul>

            <p className="font-semibold">HUÉSPEDES (usuarios que buscan habitación)</p>
            <p>Los datos personales recogidos serán utilizados para:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Crear y gestionar la cuenta de usuario.</li>
              <li>Buscar habitaciones mediante filtros.</li>
              <li>Crear un perfil de demanda (zona, presupuesto, fecha de entrada, preferencias).</li>
              <li>Permitir la visibilidad del perfil a los anunciantes.</li>
              <li>Facilitar el contacto con propietarios.</li>
              <li>Gestionar servicios adicionales en caso de contratación.</li>
            </ul>
          </>
        )}
      </Section>

      <Section title={ca ? 'Quant de temps custodiéem les seves dades?' : '¿Cuánto tiempo custodiamos sus datos?'}>
        {ca ? (
          <>
            <p className="font-semibold">ANUNCIANTS (propietaris o usuaris que publiquen habitacions)</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Les dades es conservaran mentre l&apos;usuari mantingui el seu compte actiu a la plataforma.</li>
              <li>En relació amb els anuncis publicats, les dades es conservaran mentre l&apos;anunci estigui actiu i durant el temps necessari per gestionar possibles responsabilitats legals derivades del servei.</li>
              <li>Les dades relacionades amb pagaments i facturació es conservaran durant els terminis legalment establerts (habitualment entre 5 i 6 anys).</li>
            </ul>
            <p className="font-semibold">HOSTES (usuaris que busquen habitació)</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Les dades es conservaran mentre l&apos;usuari mantingui el seu compte actiu o el seu perfil de cerca actiu.</li>
              <li>En cas d&apos;inactivitat, les dades podran ser eliminades o anonimitzades després d&apos;un període raonable (per exemple, 12-24 mesos sense activitat).</li>
              <li>Les dades relacionades amb serveis de pagament, si n&apos;hi hagués, es conservaran durant els terminis legals aplicables (5-6 anys).</li>
            </ul>
          </>
        ) : (
          <>
            <p className="font-semibold">ANUNCIANTES (propietarios o usuarios que publican habitaciones)</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Los datos se conservarán mientras el usuario mantenga su cuenta activa en la plataforma.</li>
              <li>En relación con los anuncios publicados, los datos se conservarán mientras el anuncio esté activo y durante el tiempo necesario para gestionar posibles responsabilidades legales derivadas del servicio.</li>
              <li>Los datos relacionados con pagos y facturación se conservarán durante los plazos legalmente establecidos (habitualmente entre 5 y 6 años).</li>
            </ul>
            <p className="font-semibold">HUÉSPEDES (usuarios que buscan habitación)</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Los datos se conservarán mientras el usuario mantenga su cuenta activa o su perfil de búsqueda activo.</li>
              <li>En caso de inactividad, los datos podrán ser eliminados o anonimizados tras un período razonable (por ejemplo, 12-24 meses sin actividad).</li>
              <li>Los datos relacionados con servicios de pago, si los hubiera, se conservarán durante los plazos legales aplicables (5-6 años).</li>
            </ul>
          </>
        )}
      </Section>

      <Section title={ca ? 'Legitimació' : 'Legitimación'}>
        <p>
          {ca
            ? "A continuació, l'informem de què ens permet tractar les seves dades, en funció de l'ús al qual siguin destinades. La base legal per tractar les dades recollides en els formularis és el consentiment de l'interessat, així com l'execució de la relació contractual en l'ús de la plataforma."
            : "A continuación, le informamos qué nos permite tratar sus datos, en función del uso al que sean destinados. La base legal para tratar los datos recogidos en los formularios es el consentimiento del interesado, así como la ejecución de la relación contractual en el uso de la plataforma."}
        </p>
      </Section>

      <Section title={ca ? 'Destinataris — Cessió de dades' : 'Destinatarios — Cesión de datos'}>
        {ca ? (
          <>
            <p>Determinada informació dels usuaris podrà ser visible per a altres usuaris de la plataforma amb la finalitat de facilitar el contacte i la possible contractació d&apos;habitacions:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Els perfils dels hostes podran ser visibles total o parcialment per als anunciants.</li>
              <li>Les dades dels anunciants seran visibles en els anuncis publicats.</li>
            </ul>
          </>
        ) : (
          <>
            <p>Determinada información de los usuarios podrá ser visible para otros usuarios de la plataforma con la finalidad de facilitar el contacto y la posible contratación de habitaciones:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Los perfiles de los huéspedes podrán ser visibles total o parcialmente para los anunciantes.</li>
              <li>Los datos de los anunciantes serán visibles en los anuncios publicados.</li>
            </ul>
          </>
        )}
      </Section>

      <Section title={ca ? 'Categoria de dades' : 'Categoría de datos'}>
        {ca ? (
          <>
            <p>Tipologia de dades tractades:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Nom i cognoms.</li>
              <li>Correu electrònic.</li>
              <li>Telèfon.</li>
              <li>Adreça postal.</li>
              <li>Dades bancàries.</li>
              <li>Dades relacionades amb l&apos;anunci o perfils (preferències, descripcions, etc.).</li>
            </ul>
          </>
        ) : (
          <>
            <p>Tipología de datos tratados:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Nombre y apellidos.</li>
              <li>Correo electrónico.</li>
              <li>Teléfono.</li>
              <li>Dirección Postal.</li>
              <li>Datos bancarios.</li>
              <li>Datos relacionados con el anuncio o perfiles (preferencias, descripciones, etc.).</li>
            </ul>
          </>
        )}
      </Section>

      <Section title={ca ? 'Drets' : 'Derechos'}>
        {ca ? (
          <>
            <p>Té dret a:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Revocar el consentiment atorgat.</li>
              <li>Accedir a les dades personals.</li>
              <li>Rectificar les dades personals.</li>
              <li>Suprimir les dades personals.</li>
              <li>Presentar una reclamació davant l&apos;Agència Andorrana de Protecció de Dades.</li>
              <li>Ser informat de qualsevol incidència de seguretat.</li>
              <li>Limitació del tractament.</li>
              <li>Portabilitat de les dades.</li>
            </ul>
            <p>Per exercir aquests drets, escriviu-nos a <a href="mailto:hola@habitacio.ad" className="text-[#1a3c5e] underline">hola@habitacio.ad</a>.</p>
          </>
        ) : (
          <>
            <p>Tiene derecho a:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Revocar el consentimiento otorgado.</li>
              <li>Acceder a los datos personales.</li>
              <li>Rectificar los datos personales.</li>
              <li>Suprimir los datos personales.</li>
              <li>Presentar una reclamación ante la Agencia Andorrana de Protección de Datos.</li>
              <li>Ser informado de cualquier incidencia de seguridad.</li>
              <li>Limitación del tratamiento.</li>
              <li>Portabilidad de los datos.</li>
            </ul>
            <p>Para ejercer estos derechos, escríbenos a <a href="mailto:hola@habitacio.ad" className="text-[#1a3c5e] underline">hola@habitacio.ad</a>.</p>
          </>
        )}
      </Section>

      <Section title={ca ? 'Seguretat' : 'Seguridad'}>
        <p>
          {ca
            ? "Apliquem mesures tècniques i organitzatives per protegir les seves dades: xifratge en trànsit (HTTPS), autenticació segura, control d'accés i còpies de seguretat periòdiques."
            : "Aplicamos medidas técnicas y organizativas para proteger sus datos: cifrado en tránsito (HTTPS), autenticación segura, control de acceso y copias de seguridad periódicas."}
        </p>
      </Section>

    </div>
  )
}

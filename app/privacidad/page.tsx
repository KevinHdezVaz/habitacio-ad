import type { Metadata } from 'next'

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

export default function PrivacidadPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-10">

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#1a3c5e]">Política de Privacidad</h1>
        <p className="text-sm text-[#9ca3af]">Última actualización: marzo de 2026</p>
      </div>

      <Section title="1. Responsable del tratamiento">
        <p>El responsable del tratamiento de tus datos personales es <strong>Habitacio.ad</strong>, plataforma operada en el Principado de Andorra.</p>
        <p>Contacto: <a href="mailto:hola@habitacio.ad" className="text-[#1a3c5e] underline">hola@habitacio.ad</a></p>
      </Section>

      <Section title="2. Datos que recopilamos">
        <p>Recopilamos los siguientes datos personales:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>Al registrarte:</strong> nombre, correo electrónico, foto de perfil (opcional), número de teléfono (opcional).</li>
          <li><strong>Al publicar un anuncio:</strong> descripción del inmueble, fotos, ubicación aproximada, precio y condiciones.</li>
          <li><strong>Al crear un perfil de búsqueda:</strong> preferencias de habitación, presupuesto, situación laboral, descripción personal.</li>
          <li><strong>Al usar el chat:</strong> contenido de los mensajes intercambiados con otros usuarios.</li>
          <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas y cookies técnicas.</li>
        </ul>
      </Section>

      <Section title="3. Finalidad del tratamiento">
        <p>Utilizamos tus datos para:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Gestionar tu cuenta y acceso a la plataforma.</li>
          <li>Publicar y mostrar tus anuncios o perfil de búsqueda.</li>
          <li>Facilitar la comunicación entre usuarios a través del chat interno.</li>
          <li>Enviarte notificaciones relacionadas con el servicio (nuevos mensajes, estado del anuncio).</li>
          <li>Mejorar la plataforma mediante análisis de uso anónimo.</li>
          <li>Cumplir con obligaciones legales aplicables.</li>
        </ul>
      </Section>

      <Section title="4. Base legal del tratamiento">
        <p>El tratamiento de tus datos se basa en:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>Ejecución de contrato:</strong> para prestarte el servicio solicitado al registrarte.</li>
          <li><strong>Consentimiento:</strong> para el envío de comunicaciones opcionales.</li>
          <li><strong>Interés legítimo:</strong> para la mejora del servicio y seguridad de la plataforma.</li>
        </ul>
      </Section>

      <Section title="5. Conservación de datos">
        <p>Conservamos tus datos mientras mantengas una cuenta activa en la plataforma. Si eliminas tu cuenta, tus datos personales serán suprimidos en un plazo máximo de 30 días, salvo que la ley exija su conservación por un período mayor.</p>
        <p>Los mensajes de chat se conservan mientras ambos usuarios mantengan sus cuentas activas.</p>
      </Section>

      <Section title="6. Cesión de datos a terceros">
        <p>No vendemos ni cedemos tus datos personales a terceros con fines comerciales. Únicamente compartimos datos con:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>Supabase:</strong> proveedor de infraestructura y base de datos (alojamiento seguro en la UE).</li>
          <li><strong>Vercel:</strong> proveedor de alojamiento web.</li>
          <li><strong>Google:</strong> para autenticación OAuth (si usas "Iniciar sesión con Google").</li>
        </ul>
        <p>Todos los proveedores cumplen con los estándares de protección de datos aplicables.</p>
      </Section>

      <Section title="7. Tus derechos">
        <p>Tienes derecho a:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>Acceso:</strong> conocer qué datos tenemos sobre ti.</li>
          <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
          <li><strong>Supresión:</strong> solicitar la eliminación de tus datos.</li>
          <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado.</li>
          <li><strong>Oposición:</strong> oponerte al tratamiento basado en interés legítimo.</li>
        </ul>
        <p>Para ejercer estos derechos, escríbenos a <a href="mailto:hola@habitacio.ad" className="text-[#1a3c5e] underline">hola@habitacio.ad</a>.</p>
      </Section>

      <Section title="8. Seguridad">
        <p>Aplicamos medidas técnicas y organizativas para proteger tus datos: cifrado en tránsito (HTTPS), autenticación segura, control de acceso y copias de seguridad periódicas.</p>
      </Section>

      <Section title="9. Cambios en esta política">
        <p>Podemos actualizar esta política periódicamente. Te notificaremos de cambios significativos por correo electrónico o mediante un aviso en la plataforma.</p>
      </Section>

    </div>
  )
}

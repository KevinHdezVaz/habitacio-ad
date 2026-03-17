import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.NODE_ENV === 'production'
  ? 'Habitacio.ad <noreply@habitacio.ad>'
  : 'Habitacio.ad <onboarding@resend.dev>'
const BASE_URL = 'https://habitacio.ad'

// ── Estilos base compartidos ──────────────────────────────────────────────────
function baseLayout(contenido: string) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Habitacio.ad</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <!-- Logo -->
        <tr><td style="padding-bottom:24px;text-align:center;">
          <a href="${BASE_URL}" style="text-decoration:none;">
            <span style="font-size:22px;font-weight:800;color:#1a3c5e;letter-spacing:-0.5px;">
              🏠 habitacio<span style="color:#0ea5a0;">.ad</span>
            </span>
          </a>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#ffffff;border-radius:20px;border:1px solid #e8edf2;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          ${contenido}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:20px;text-align:center;">
          <p style="font-size:12px;color:#9ca3af;margin:0;">
            © ${new Date().getFullYear()} Habitacio.ad · Andorra<br/>
            <a href="${BASE_URL}/legal/privacidad" style="color:#9ca3af;">Política de privacidad</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function boton(texto: string, url: string) {
  return `
<table cellpadding="0" cellspacing="0" style="margin:0 auto;">
  <tr><td style="background:linear-gradient(135deg,#0ea5a0,#0c8e8a);border-radius:12px;">
    <a href="${url}" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.1px;">
      ${texto}
    </a>
  </td></tr>
</table>`
}

// ── 1. Nuevo mensaje de chat ──────────────────────────────────────────────────
export async function emailNuevoMensaje({
  destinatarioEmail,
  destinatarioNombre,
  remitenteNombre,
  tituloAnuncio,
  extractoMensaje,
  conversacionId,
}: {
  destinatarioEmail: string
  destinatarioNombre: string
  remitenteNombre: string
  tituloAnuncio: string
  extractoMensaje: string
  conversacionId: string
}) {
  const extracto = extractoMensaje.length > 120
    ? extractoMensaje.slice(0, 120) + '…'
    : extractoMensaje

  const contenido = `
<div style="padding:32px 32px 28px;">
  <!-- Icono -->
  <div style="text-align:center;margin-bottom:20px;">
    <div style="display:inline-block;width:56px;height:56px;background:linear-gradient(135deg,#e6f7f7,#f0fafa);border-radius:16px;line-height:56px;font-size:26px;">💬</div>
  </div>

  <h1 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#1a3c5e;text-align:center;">
    Tienes un nuevo mensaje
  </h1>
  <p style="margin:0 0 24px;font-size:14px;color:#6b7280;text-align:center;">
    Hola <strong style="color:#1a3c5e;">${destinatarioNombre}</strong>, <strong>${remitenteNombre}</strong> te ha escrito.
  </p>

  <!-- Burbuja del mensaje -->
  <div style="background:#f4f5f7;border-radius:14px;padding:16px 18px;margin-bottom:20px;border-left:3px solid #0ea5a0;">
    <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#0ea5a0;text-transform:uppercase;letter-spacing:0.5px;">
      📍 ${tituloAnuncio}
    </p>
    <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">"${extracto}"</p>
  </div>

  ${boton('Ver mensaje completo', `${BASE_URL}/chat/${conversacionId}`)}
</div>

<div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e8edf2;text-align:center;">
  <p style="margin:0;font-size:12px;color:#9ca3af;">
    Responde desde la plataforma para mantener tu privacidad.
  </p>
</div>`

  return resend.emails.send({
    from: FROM,
    to: destinatarioEmail,
    subject: `💬 ${remitenteNombre} te ha enviado un mensaje — Habitacio.ad`,
    html: baseLayout(contenido),
  })
}

// ── 2. Anuncio aprobado ───────────────────────────────────────────────────────
export async function emailAnuncioAprobado({
  destinatarioEmail,
  destinatarioNombre,
  tituloAnuncio,
  anuncioId,
}: {
  destinatarioEmail: string
  destinatarioNombre: string
  tituloAnuncio: string
  anuncioId: string
}) {
  const contenido = `
<div style="padding:32px 32px 28px;">
  <div style="text-align:center;margin-bottom:20px;">
    <div style="display:inline-block;width:56px;height:56px;background:linear-gradient(135deg,#d1fae5,#ecfdf5);border-radius:16px;line-height:56px;font-size:26px;">✅</div>
  </div>

  <h1 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#1a3c5e;text-align:center;">
    ¡Tu anuncio está publicado!
  </h1>
  <p style="margin:0 0 24px;font-size:14px;color:#6b7280;text-align:center;">
    Hola <strong style="color:#1a3c5e;">${destinatarioNombre}</strong>, tu anuncio ha sido revisado y aprobado.
  </p>

  <!-- Chip del anuncio -->
  <div style="background:#f0fafa;border:1px solid #a7f3d0;border-radius:12px;padding:14px 18px;margin-bottom:24px;text-align:center;">
    <p style="margin:0;font-size:14px;font-weight:700;color:#0a8c88;">🏠 ${tituloAnuncio}</p>
    <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Ya visible para todos los usuarios</p>
  </div>

  ${boton('Ver mi anuncio publicado', `${BASE_URL}/habitaciones/${anuncioId}`)}
</div>

<div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e8edf2;text-align:center;">
  <p style="margin:0;font-size:12px;color:#9ca3af;">
    Recibirás un email cuando alguien te contacte.
  </p>
</div>`

  return resend.emails.send({
    from: FROM,
    to: destinatarioEmail,
    subject: `✅ Tu anuncio "${tituloAnuncio}" ha sido aprobado — Habitacio.ad`,
    html: baseLayout(contenido),
  })
}

// ── 3. Anuncio rechazado ──────────────────────────────────────────────────────
export async function emailAnuncioRechazado({
  destinatarioEmail,
  destinatarioNombre,
  tituloAnuncio,
}: {
  destinatarioEmail: string
  destinatarioNombre: string
  tituloAnuncio: string
}) {
  const contenido = `
<div style="padding:32px 32px 28px;">
  <div style="text-align:center;margin-bottom:20px;">
    <div style="display:inline-block;width:56px;height:56px;background:#fff7ed;border-radius:16px;line-height:56px;font-size:26px;">⚠️</div>
  </div>

  <h1 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#1a3c5e;text-align:center;">
    Tu anuncio necesita cambios
  </h1>
  <p style="margin:0 0 24px;font-size:14px;color:#6b7280;text-align:center;">
    Hola <strong style="color:#1a3c5e;">${destinatarioNombre}</strong>, hemos revisado tu anuncio y no ha podido ser aprobado en este momento.
  </p>

  <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:14px 18px;margin-bottom:24px;">
    <p style="margin:0;font-size:14px;font-weight:700;color:#c2410c;">🏠 ${tituloAnuncio}</p>
    <p style="margin:6px 0 0;font-size:13px;color:#6b7280;line-height:1.5;">
      Por favor, revisa que las fotos sean reales, la descripción sea completa y el precio sea correcto. Puedes editar y volver a enviar el anuncio.
    </p>
  </div>

  ${boton('Editar mi anuncio', `${BASE_URL}/perfil`)}
</div>

<div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e8edf2;text-align:center;">
  <p style="margin:0;font-size:12px;color:#9ca3af;">
    Si crees que es un error, contáctanos en <a href="mailto:hola@habitacio.ad" style="color:#0ea5a0;">hola@habitacio.ad</a>
  </p>
</div>`

  return resend.emails.send({
    from: FROM,
    to: destinatarioEmail,
    subject: `⚠️ Tu anuncio "${tituloAnuncio}" necesita cambios — Habitacio.ad`,
    html: baseLayout(contenido),
  })
}

// ── 4. Confirmación de publicación ────────────────────────────────────────────
export async function emailAnuncioEnRevision({
  destinatarioEmail,
  destinatarioNombre,
  tituloAnuncio,
}: {
  destinatarioEmail: string
  destinatarioNombre: string
  tituloAnuncio: string
}) {
  const contenido = `
<div style="padding:32px 32px 28px;">
  <div style="text-align:center;margin-bottom:20px;">
    <div style="display:inline-block;width:56px;height:56px;background:linear-gradient(135deg,#e6f0fa,#eef4ff);border-radius:16px;line-height:56px;font-size:26px;">🔍</div>
  </div>

  <h1 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#1a3c5e;text-align:center;">
    Anuncio recibido, en revisión
  </h1>
  <p style="margin:0 0 24px;font-size:14px;color:#6b7280;text-align:center;">
    Hola <strong style="color:#1a3c5e;">${destinatarioNombre}</strong>, hemos recibido tu anuncio correctamente.
  </p>

  <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:14px 18px;margin-bottom:16px;">
    <p style="margin:0;font-size:14px;font-weight:700;color:#1d4ed8;">🏠 ${tituloAnuncio}</p>
    <p style="margin:6px 0 0;font-size:13px;color:#6b7280;line-height:1.5;">
      Nuestro equipo lo revisará en las próximas horas. Te avisaremos cuando esté publicado.
    </p>
  </div>

  <!-- Timeline -->
  <div style="padding:0 4px;margin-bottom:24px;">
    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;">
      <div style="width:24px;height:24px;background:#0ea5a0;border-radius:50%;text-align:center;line-height:24px;font-size:12px;color:white;font-weight:700;flex-shrink:0;">1</div>
      <p style="margin:0;font-size:13px;color:#374151;">Anuncio enviado ✓</p>
    </div>
    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;">
      <div style="width:24px;height:24px;background:#e8edf2;border-radius:50%;text-align:center;line-height:24px;font-size:12px;color:#9ca3af;font-weight:700;flex-shrink:0;">2</div>
      <p style="margin:0;font-size:13px;color:#9ca3af;">Revisión del equipo (en curso…)</p>
    </div>
    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;">
      <div style="width:24px;height:24px;background:#e8edf2;border-radius:50%;text-align:center;line-height:24px;font-size:12px;color:#9ca3af;font-weight:700;flex-shrink:0;">3</div>
      <p style="margin:0;font-size:13px;color:#9ca3af;">Publicado y visible para todos</p>
    </div>
  </div>

  ${boton('Ver mis anuncios', `${BASE_URL}/perfil`)}
</div>

<div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e8edf2;text-align:center;">
  <p style="margin:0;font-size:12px;color:#9ca3af;">
    Tiempo estimado de revisión: menos de 24 horas.
  </p>
</div>`

  return resend.emails.send({
    from: FROM,
    to: destinatarioEmail,
    subject: `🔍 Tu anuncio "${tituloAnuncio}" está en revisión — Habitacio.ad`,
    html: baseLayout(contenido),
  })
}

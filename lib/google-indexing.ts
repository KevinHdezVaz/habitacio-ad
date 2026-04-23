import { createSign } from 'crypto'

const INDEXING_SCOPE = 'https://www.googleapis.com/auth/indexing'
const TOKEN_URL      = 'https://oauth2.googleapis.com/token'
const INDEXING_URL   = 'https://indexing.googleapis.com/v3/urlNotifications:publish'

function base64url(buf: Buffer | string): string {
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf)
  return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function getAccessToken(): Promise<string> {
  const clientEmail  = process.env.GOOGLE_INDEXING_CLIENT_EMAIL!
  const privateKey   = (process.env.GOOGLE_INDEXING_PRIVATE_KEY ?? '').replace(/\\n/g, '\n')

  const now = Math.floor(Date.now() / 1000)
  const header  = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64url(JSON.stringify({
    iss: clientEmail,
    scope: INDEXING_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }))

  const unsigned = `${header}.${payload}`
  const sign     = createSign('RSA-SHA256')
  sign.update(unsigned)
  const signature = base64url(sign.sign(privateKey))
  const jwt = `${unsigned}.${signature}`

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  const json = await res.json()
  if (!json.access_token) throw new Error(`Token error: ${JSON.stringify(json)}`)
  return json.access_token
}

/**
 * Notifica a Google que indexe (o re-indexe) una URL.
 * type: 'URL_UPDATED' para publicar/actualizar, 'URL_DELETED' para borrar
 */
export async function notificarGoogleIndexing(
  url: string,
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'
): Promise<void> {
  if (!process.env.GOOGLE_INDEXING_CLIENT_EMAIL || !process.env.GOOGLE_INDEXING_PRIVATE_KEY) {
    console.warn('[Indexing] Variables de entorno no configuradas — omitiendo')
    return
  }

  try {
    const token = await getAccessToken()
    const res = await fetch(INDEXING_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url, type }),
    })
    const data = await res.json()
    if (res.ok) {
      console.log(`[Indexing] ✅ ${type} → ${url}`)
    } else {
      console.error(`[Indexing] ❌ Error:`, data)
    }
  } catch (err) {
    console.error('[Indexing] Error llamando a la API:', err)
  }
}

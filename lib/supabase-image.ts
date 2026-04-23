/**
 * Convierte una URL pública de Supabase Storage en una URL de imagen
 * transformada (Imgproxy) con ancho y calidad optimizados.
 *
 * Input:  .../storage/v1/object/public/habitaciones/...
 * Output: .../storage/v1/render/image/public/habitaciones/...?width=X&quality=Y
 *
 * Si la URL no es de Supabase Storage, la devuelve sin cambios.
 */
export function supabaseImg(
  url: string | null | undefined,
  { width, quality = 75 }: { width: number; quality?: number }
): string {
  if (!url) return ''
  if (!url.includes('/storage/v1/object/public/')) return url
  return url
    .replace('/storage/v1/object/public/', '/storage/v1/render/image/public/')
    .split('?')[0] + `?width=${width}&quality=${quality}`
}

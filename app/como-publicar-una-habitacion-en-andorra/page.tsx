import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cómo publicar una habitación en Andorra para recibir más mensajes | habitacio.ad',
  description: 'Descubre cómo publicar una habitación en Andorra de forma más clara y eficaz para generar más interés y recibir mejores mensajes.',
}

export default function ArticlePage() {
  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#1a3c5e] leading-tight">Cómo publicar una habitación en Andorra para recibir más mensajes</h1>
        <p className="text-sm text-[#9ca3af]">Habitacio.ad · Andorra</p>
      </div>

      {/* Image placeholder */}
      <div className="w-full h-52 bg-gradient-to-br from-[#e8f0f7] to-[#d1e3f0] rounded-2xl flex items-center justify-center">
        <p className="text-xs text-[#9ca3af] text-center px-4">Foto de habitación lista para alquilar, ordenada y luminosa</p>
      </div>

      <div className="flex flex-col gap-6 text-[#374151] text-sm leading-relaxed">
        <p>
          Publicar una habitación no consiste solo en subir cuatro fotos y poner un precio. Si quieres recibir más interés y evitar perder tiempo, el anuncio tiene que estar claro. Muchas publicaciones fallan por lo mismo: falta información, fotos pobres o mensajes confusos.
        </p>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">1. Indica bien la zona</h2>
          <p>
            La parroquia o zona es una de las primeras cosas que mira quien busca habitación. Si no lo explicas bien, pierdes clics y mensajes.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">2. Pon el precio claro</h2>
          <p>
            Evita los anuncios ambiguos. Es mejor dejar claro el precio desde el inicio para filtrar mejor y recibir mensajes más útiles. Si necesitas contexto, revisa{' '}
            <Link href="/cuanto-cuesta-una-habitacion-en-andorra" className="text-[#0ea5a0] underline hover:text-[#0c8e8a] transition-colors">
              cuánto cuesta una habitación en Andorra
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">3. Explica la disponibilidad</h2>
          <p>
            Una habitación puede interesar mucho menos si no se entiende cuándo se puede entrar o si es para temporada o para todo el año.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">4. Cuida las fotos</h2>
          <p>
            Las fotos importan mucho. No hace falta hacer una producción de cine, pero sí enseñar la habitación con luz, orden y claridad.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">5. Di qué tipo de convivencia hay</h2>
          <p>
            Esto también ayuda mucho. Quien busca habitación quiere saber si encaja con el ambiente general del piso.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">6. Haz una descripción simple y humana</h2>
          <p>No hace falta escribir una novela. Basta con explicar bien:</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#374151]">
            <li>Qué se ofrece</li>
            <li>Qué incluye</li>
            <li>Cuándo está disponible</li>
            <li>Qué perfil puede encajar</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">7. Responde rápido</h2>
          <p>
            Muchos anuncios pierden oportunidades porque quien publica tarda demasiado en contestar.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">Conclusión</h2>
          <p>
            Publicar una habitación en Andorra de forma clara mejora mucho la calidad de los mensajes que recibes. Cuanto más claro sea el anuncio, más fácil será conectar con la persona adecuada. También puedes leer{' '}
            <Link href="/como-encontrar-habitacion-en-andorra" className="text-[#0ea5a0] underline hover:text-[#0c8e8a] transition-colors">
              cómo encontrar habitación en Andorra
            </Link>{' '}
            para entender mejor qué buscan los inquilinos. Publica tu habitación en las{' '}
            <Link href="/habitaciones" className="text-[#0ea5a0] underline hover:text-[#0c8e8a] transition-colors">
              habitaciones en Andorra
            </Link>{' '}
            de habitacio.ad.
          </p>
        </div>
      </div>

      {/* CTA block */}
      <div className="bg-gradient-to-r from-[#1a3c5e] to-[#2d5a8e] rounded-2xl p-6 flex flex-col gap-3 text-white">
        <p className="font-bold text-lg">¿Quieres dar más visibilidad a tu habitación en Andorra? Publica o descubre cómo funciona.</p>
        <Link href="/publicar" className="inline-flex items-center gap-2 bg-[#0ea5a0] hover:bg-[#0c8e8a] transition-colors text-white font-bold px-5 py-3 rounded-xl text-sm w-fit">
          Publicar mi habitación →
        </Link>
      </div>
    </div>
  )
}

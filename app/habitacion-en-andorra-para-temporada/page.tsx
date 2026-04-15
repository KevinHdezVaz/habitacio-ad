import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Habitación en Andorra para temporada: qué mirar antes de alquilar | habitacio.ad',
  description: 'Si buscas habitación en Andorra para temporada, esto es lo que deberías mirar antes de decidirte: zona, precio, condiciones y convivencia.',
}

export default function ArticlePage() {
  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#1a3c5e] leading-tight">Habitación en Andorra para temporada: qué mirar antes de alquilar</h1>
        <p className="text-sm text-[#9ca3af]">Habitacio.ad · Andorra</p>
      </div>

      {/* Image placeholder */}
      <div className="w-full h-52 bg-gradient-to-br from-[#e8f0f7] to-[#d1e3f0] rounded-2xl flex items-center justify-center">
        <p className="text-xs text-[#9ca3af] text-center px-4">Foto de habitación acogedora o escena de temporada en Andorra</p>
      </div>

      <div className="flex flex-col gap-6 text-[#374151] text-sm leading-relaxed">
        <p>
          Buscar una habitación en Andorra para temporada no es lo mismo que buscarla para todo el año. Normalmente todo va más rápido, hay más presión por cerrar algo pronto y muchas personas compiten por las mismas opciones. Por eso conviene mirar bien ciertos puntos antes de decidir.
        </p>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">1. La fecha de entrada real</h2>
          <p>
            Antes de escribir a nadie, ten clara tu fecha aproximada de entrada. Eso evita perder tiempo con habitaciones que no estarán disponibles cuando las necesitas.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">2. La parroquia o zona</h2>
          <p>
            Si vienes por temporada, la ubicación es clave. No tiene sentido cerrar una habitación solo porque sí, sin mirar si luego te complica mucho los desplazamientos o el día a día. Si dudas entre zonas, revisa las{' '}
            <Link href="/mejores-zonas-de-andorra-para-buscar-habitacion" className="text-[#0ea5a0] underline hover:text-[#0c8e8a] transition-colors">
              mejores zonas de Andorra para buscar habitación
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">3. El precio total, no solo el anuncio</h2>
          <p>
            Mira bien si el precio incluye todo o si luego se suman gastos. También conviene confirmar si hay fianza y qué condiciones piden. Para eso te puede ayudar mirar antes{' '}
            <Link href="/cuanto-cuesta-una-habitacion-en-andorra" className="text-[#0ea5a0] underline hover:text-[#0c8e8a] transition-colors">
              cuánto cuesta una habitación en Andorra
            </Link>{' '}
            y comparar mejor.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">4. El ambiente de la vivienda</h2>
          <p>
            Cuando buscas habitación para temporada, muchas veces te fijas solo en entrar cuanto antes. Pero también importa saber con quién vas a convivir, si hay normas claras y si la vivienda encaja con el tipo de estancia que buscas.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">5. Si la habitación está lista para entrar</h2>
          <p>
            Conviene saber si la habitación está realmente equipada y si la vivienda está preparada para entrar sin historias raras de última hora.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">6. La claridad del anuncio y de la persona que responde</h2>
          <p>
            Si el anuncio es confuso o la persona responde mal, tarde o de forma muy poco clara, mala señal. En algo tan importante como una habitación, vale más una opción clara que una supuesta ganga mal explicada.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">Conclusión</h2>
          <p>
            Buscar una habitación en Andorra para temporada exige moverse rápido, sí, pero no a ciegas. Revisar bien precio, zona, disponibilidad y condiciones te puede ahorrar muchos problemas. Consulta las{' '}
            <Link href="/habitaciones" className="text-[#0ea5a0] underline hover:text-[#0c8e8a] transition-colors">
              habitaciones en Andorra
            </Link>{' '}
            disponibles ahora.
          </p>
        </div>
      </div>

      {/* CTA block */}
      <div className="bg-gradient-to-r from-[#1a3c5e] to-[#2d5a8e] rounded-2xl p-6 flex flex-col gap-3 text-white">
        <p className="font-bold text-lg">Si buscas habitación en Andorra para temporada, revisa nuevas opciones o deja preparado tu perfil.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-[#0ea5a0] hover:bg-[#0c8e8a] transition-colors text-white font-bold px-5 py-3 rounded-xl text-sm w-fit">
          Ver habitaciones en Andorra →
        </Link>
      </div>
    </div>
  )
}

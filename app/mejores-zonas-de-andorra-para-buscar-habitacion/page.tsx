import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mejores zonas de Andorra para buscar habitación | habitacio.ad',
  description: 'Descubre qué tener en cuenta al buscar habitación en distintas zonas de Andorra y cómo elegir mejor según tu situación y presupuesto.',
}

export default function ArticlePage() {
  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#1a3c5e] leading-tight">Mejores zonas de Andorra para buscar habitación</h1>
        <p className="text-sm text-[#9ca3af]">Habitacio.ad · Andorra</p>
      </div>

      {/* Image placeholder */}
      <div className="w-full h-52 bg-gradient-to-br from-[#e8f0f7] to-[#d1e3f0] rounded-2xl flex items-center justify-center">
        <p className="text-xs text-[#9ca3af] text-center px-4">Imagen panorámica de Andorra o distintas parroquias</p>
      </div>

      <div className="flex flex-col gap-6 text-[#374151] text-sm leading-relaxed">
        <p>
          Cuando alguien empieza a buscar habitación en Andorra, una de las primeras dudas suele ser la misma: qué zona conviene más. La respuesta depende de tu presupuesto, de tu rutina y del tipo de estancia que busques. No hay una única zona perfecta para todo el mundo.
        </p>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">Andorra la Vella</h2>
          <p>
            Suele ser una referencia para muchas personas por comodidad y servicios. Es una opción lógica si priorizas movimiento, conexiones y tener muchas cosas a mano.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">Escaldes-Engordany</h2>
          <p>
            También es una zona muy buscada. Muchas personas la valoran por ubicación y por el entorno general.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">Encamp</h2>
          <p>
            Puede ser interesante para quien quiere valorar otras opciones dentro del país y ampliar el rango de búsqueda.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">La Massana</h2>
          <p>
            Otra zona que puede encajar bien según tu día a día, el trabajo o el estilo de vida que busques.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">Cómo elegir mejor zona</h2>
          <p>Más que buscar la mejor parroquia, conviene pensar en:</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#374151]">
            <li>Dónde trabajas o estudias</li>
            <li>Cuánto puedes pagar</li>
            <li>Cuánto quieres desplazarte</li>
            <li>Si buscas temporada o todo el año</li>
          </ul>
          <p>
            Antes de decidir, también puede ayudarte revisar{' '}
            <Link href="/como-encontrar-habitacion-en-andorra" className="text-[#0ea5a0] underline hover:text-[#0c8e8a] transition-colors">
              cómo encontrar habitación en Andorra
            </Link>{' '}
            sin perder tiempo y{' '}
            <Link href="/cuanto-cuesta-una-habitacion-en-andorra" className="text-[#0ea5a0] underline hover:text-[#0c8e8a] transition-colors">
              cuánto cuesta una habitación en Andorra
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">Consejo práctico</h2>
          <p>
            No te cierres a una sola zona demasiado pronto. A veces abrir un poco el radio de búsqueda te permite encontrar mejores opciones o moverte más rápido.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">Conclusión</h2>
          <p>
            La mejor zona para buscar habitación en Andorra depende de tu situación. Lo importante es tener claro qué valoras más y buscar con lógica, no solo por impulso. Explora las{' '}
            <Link href="/habitaciones" className="text-[#0ea5a0] underline hover:text-[#0c8e8a] transition-colors">
              habitaciones en Andorra
            </Link>{' '}
            disponibles por zona.
          </p>
        </div>
      </div>

      {/* CTA block */}
      <div className="bg-gradient-to-r from-[#1a3c5e] to-[#2d5a8e] rounded-2xl p-6 flex flex-col gap-3 text-white">
        <p className="font-bold text-lg">Explora habitaciones en Andorra y encuentra opciones según la zona que mejor te encaje.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-[#0ea5a0] hover:bg-[#0c8e8a] transition-colors text-white font-bold px-5 py-3 rounded-xl text-sm w-fit">
          Ver habitaciones en Andorra →
        </Link>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Cómo encontrar habitación en Andorra sin perder tiempo | habitacio.ad',
  description: 'Descubre cómo encontrar habitación en Andorra de forma más rápida, qué zonas mirar, qué errores evitar y cómo mejorar tus opciones.',
}

export default function ArticlePage() {
  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#1a3c5e] leading-tight">Cómo encontrar habitación en Andorra sin perder tiempo</h1>
        <p className="text-sm text-[#9ca3af]">Habitacio.ad · Andorra</p>
      </div>

      {/* Image placeholder */}
      <div className="relative w-full aspect-[16/9] md:aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-[#e8f0f7] to-[#d1e3f0]">
        <Image
          src="/blog/mejores-zonas-de-andorra-para-buscar-habitacion.jpeg"
          alt="Habitación luminosa y moderna en Andorra para alquilar"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>

      <div className="flex flex-col gap-6 text-[#374151] text-sm leading-relaxed">
        <p>
          Encontrar habitación en Andorra puede ser bastante más complicado de lo que parece. Muchas personas terminan buscando entre grupos, mensajes sueltos, contactos y publicaciones que desaparecen rápido. El resultado suele ser el mismo: perder horas, escribir a muchas personas y recibir pocas respuestas claras. Por eso, si quieres encontrar habitación en Andorra de forma más rápida, necesitas moverte con algo de estrategia.
        </p>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">1. Ten claro tu presupuesto real</h2>
          <p>
            Antes de empezar a buscar, lo primero es saber cuánto puedes pagar de verdad cada mes. No solo el precio de la habitación, sino también si hay gastos aparte, fianza o condiciones especiales. Buscar sin tener claro el presupuesto solo hace que pierdas tiempo con opciones que luego no encajan. Si quieres comparar mejor, también puedes revisar{' '}
            <Link href="/cuanto-cuesta-una-habitacion-en-andorra" className="text-[#0ea5a0] underline hover:text-[#0c8e8a] transition-colors">
              cuánto cuesta una habitación en Andorra
            </Link>{' '}
            para hacerte una idea más clara del mercado.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">2. Decide qué zonas te convienen más</h2>
          <p>
            No todas las parroquias encajan con todas las personas. Hay quien prioriza cercanía al trabajo, quien busca más tranquilidad y quien simplemente necesita una zona donde haya más opciones. Al buscar habitación en Andorra, conviene tener claras desde el inicio las parroquias o zonas que más te interesan. Si todavía no lo tienes claro, consulta las{' '}
            <Link href="/mejores-zonas-de-andorra-para-buscar-habitacion" className="text-[#0ea5a0] underline hover:text-[#0c8e8a] transition-colors">
              mejores zonas de Andorra para buscar habitación
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">3. Muévete rápido cuando salga una buena opción</h2>
          <p>
            En mercados pequeños, las buenas habitaciones pueden durar poco. Si tardas demasiado en contestar, pedir información o mostrar interés, es fácil que otra persona se adelante. Por eso es importante tener preparado:
          </p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#374151]">
            <li>Presupuesto</li>
            <li>Fecha de entrada</li>
            <li>Zona deseada</li>
            <li>Una breve presentación sobre ti</li>
          </ul>
          <p>Cuanto más claro seas, mejor impresión das.</p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">4. Escribe mensajes claros y normales</h2>
          <p>
            Uno de los errores más comunes es escribir mensajes vagos o demasiado secos. Si alguien publica una habitación, no basta con poner «¿Sigue disponible?». Es mejor escribir algo breve, educado y útil. Por ejemplo:
          </p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#374151]">
            <li>Quién eres</li>
            <li>Qué buscas</li>
            <li>Cuándo entrarías</li>
            <li>Si es para todo el año o temporada</li>
          </ul>
          <p>Eso transmite seriedad y aumenta las posibilidades de recibir respuesta.</p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">5. No dependas solo de grupos desordenados</h2>
          <p>
            Mucha gente empieza buscando solo en grupos, pero eso suele acabar siendo lento y caótico. Hay publicaciones repetidas, anuncios poco claros y mucho ruido. Lo ideal es combinar varias vías, pero siempre buscando una forma más ordenada de ver opciones.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">6. Si no encuentras una habitación, deja visible que estás buscando</h2>
          <p>
            Aquí mucha gente falla. Se limita a mirar anuncios, pero no hace visible su perfil. En un mercado como Andorra, también puede ser útil que quienes tienen una habitación sepan que tú estás buscando. Eso abre la puerta a que te contacten cuando aparezca algo que encaje contigo.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">7. Evita estos errores</h2>
          <p>Al buscar habitación en Andorra, intenta no caer en esto:</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#374151]">
            <li>Escribir sin presentarte</li>
            <li>Tardar demasiado en responder</li>
            <li>No tener claro tu presupuesto</li>
            <li>Buscar en demasiadas zonas sin criterio</li>
            <li>Esperar a que todo aparezca solo</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">Conclusión</h2>
          <p>
            Encontrar habitación en Andorra puede ser más fácil si te mueves con orden, rapidez y claridad. Tener claro lo que buscas y hacer visible tu perfil puede marcar mucha diferencia. Descubre las{' '}
            <Link href="/habitaciones" className="text-[#0ea5a0] underline hover:text-[#0c8e8a] transition-colors">
              habitaciones en Andorra
            </Link>{' '}
            disponibles ahora.
          </p>
        </div>
      </div>

      {/* CTA block */}
      <div className="bg-gradient-to-r from-[#1a3c5e] to-[#2d5a8e] rounded-2xl p-6 flex flex-col gap-3 text-white">
        <p className="font-bold text-lg">¿Buscas habitaciones en Andorra? Descubre una forma más clara de buscar o publicar habitación.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-[#0ea5a0] hover:bg-[#0c8e8a] transition-colors text-white font-bold px-5 py-3 rounded-xl text-sm w-fit">
          Ver habitaciones en Andorra →
        </Link>
      </div>
    </div>
  )
}

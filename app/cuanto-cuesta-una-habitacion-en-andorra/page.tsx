import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cuánto cuesta una habitación en Andorra en 2026 | habitacio.ad',
  description: 'Descubre cuánto puede costar una habitación en Andorra en 2026, qué factores influyen en el precio y cómo buscar mejor según tu presupuesto.',
}

export default function ArticlePage() {
  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#1a3c5e] leading-tight">Cuánto cuesta una habitación en Andorra en 2026</h1>
        <p className="text-sm text-[#9ca3af]">Habitacio.ad · Andorra</p>
      </div>

      {/* Image placeholder */}
      <div className="w-full h-52 bg-gradient-to-br from-[#e8f0f7] to-[#d1e3f0] rounded-2xl flex items-center justify-center">
        <p className="text-xs text-[#9ca3af] text-center px-4">Foto de habitación ordenada y moderna</p>
      </div>

      <div className="flex flex-col gap-6 text-[#374151] text-sm leading-relaxed">
        <p>
          Una de las primeras preguntas que se hace cualquiera que busca habitación en Andorra es cuánto cuesta realmente alquilar una. La respuesta depende de varios factores, pero hay algo claro: el precio puede cambiar bastante según la zona, el tipo de vivienda, las condiciones y la demanda del momento.
        </p>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">Qué influye en el precio de una habitación en Andorra</h2>
          <p>No todas las habitaciones valen lo mismo, y no solo por tamaño. Normalmente influyen estos factores:</p>

          <div className="flex flex-col gap-4">
            <div>
              <p><span className="font-semibold text-[#1a3c5e]">Zona o parroquia:</span> Hay zonas donde suele haber más movimiento o más demanda, y eso puede empujar los precios hacia arriba.</p>
            </div>
            <div>
              <p>
                <span className="font-semibold text-[#1a3c5e]">Si es para todo el año o temporada:</span> Una habitación orientada a temporada puede tener condiciones distintas a una de larga duración. Si ese es tu caso, mira también esta guía sobre{' '}
                <Link href="/habitacion-en-andorra-para-temporada" className="text-[#0ea5a0] underline hover:text-[#0c8e8a] transition-colors">
                  habitación en Andorra para temporada
                </Link>
                .
              </p>
            </div>
            <div>
              <p><span className="font-semibold text-[#1a3c5e]">Si incluye gastos:</span> No es lo mismo una habitación con gastos incluidos que una donde luego se suman suministros o extras.</p>
            </div>
            <div>
              <p><span className="font-semibold text-[#1a3c5e]">Estado de la vivienda:</span> La diferencia entre una vivienda cuidada y una muy básica también pesa.</p>
            </div>
            <div>
              <p><span className="font-semibold text-[#1a3c5e]">Si es compartida:</span> El número de convivientes y el ambiente general del piso también afectan mucho al valor percibido.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">Qué presupuesto deberías tener en mente</h2>
          <p>
            Más que pensar solo en el precio ideal, conviene pensar en un rango que realmente puedas asumir sin ir apretado. Lo importante es buscar con una cifra realista y tener margen para:
          </p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#374151]">
            <li>Fianza</li>
            <li>Primer pago</li>
            <li>Posibles gastos añadidos</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">Cómo buscar mejor según tu presupuesto</h2>
          <p>Si tu presupuesto es más ajustado, conviene:</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#374151]">
            <li>Abrir varias zonas</li>
            <li>Responder rápido</li>
            <li>Tener perfil claro</li>
            <li>No esperar solo a anuncios perfectos</li>
          </ul>
          <p>Si tienes más margen, puedes ser algo más exigente en:</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#374151]">
            <li>Ubicación</li>
            <li>Tipo de piso</li>
            <li>Número de convivientes</li>
            <li>Condiciones</li>
          </ul>
          <p>
            Para moverte mejor en el proceso completo, también puedes leer{' '}
            <Link href="/como-encontrar-habitacion-en-andorra" className="text-[#0ea5a0] underline hover:text-[#0c8e8a] transition-colors">
              cómo encontrar habitación en Andorra
            </Link>{' '}
            sin perder tiempo.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">Errores al valorar el precio</h2>
          <p>Muchos anuncios pueden parecer baratos o caros sin contexto. Por eso conviene fijarse también en:</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#374151]">
            <li>Si hay gastos aparte</li>
            <li>Si piden fianza</li>
            <li>Si hay estancia mínima</li>
            <li>Si está bien ubicada</li>
            <li>Si la habitación está realmente amueblada y lista para entrar</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#1a3c5e]">Conclusión</h2>
          <p>
            El precio de una habitación en Andorra depende de muchos factores, pero lo más importante es buscar con criterio y comparar bien. Descubre las{' '}
            <Link href="/habitaciones" className="text-[#0ea5a0] underline hover:text-[#0c8e8a] transition-colors">
              habitaciones en Andorra
            </Link>{' '}
            disponibles y filtra por precio.
          </p>
        </div>
      </div>

      {/* CTA block */}
      <div className="bg-gradient-to-r from-[#1a3c5e] to-[#2d5a8e] rounded-2xl p-6 flex flex-col gap-3 text-white">
        <p className="font-bold text-lg">Descubre más habitaciones en Andorra y encuentra opciones que encajen con tu presupuesto.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-[#0ea5a0] hover:bg-[#0c8e8a] transition-colors text-white font-bold px-5 py-3 rounded-xl text-sm w-fit">
          Ver habitaciones en Andorra →
        </Link>
      </div>
    </div>
  )
}

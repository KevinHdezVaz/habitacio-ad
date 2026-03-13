export type TipoEstancia = 'anual' | 'temporero' | 'ambos'
export type EstadoAnuncio = 'pendiente' | 'activo' | 'inactivo'
export type PreferenciaSexo = 'chicas' | 'chicos' | 'indiferente'

export interface Anuncio {
  id: string
  user_id: string
  titulo: string
  descripcion: string
  normas: string
  parroquia: string
  zona: string
  precio: number
  disponible_desde: string
  tipo_estancia: TipoEstancia
  fianza: boolean
  importe_fianza: number
  gastos_incluidos: boolean
  duracion_minima: string
  metros_habitacion: number
  metros_piso: number
  num_personas: number
  vive_propietario: boolean
  admite_pareja: boolean
  admite_mascotas: boolean
  empadronamiento: boolean
  fumadores: boolean
  preferencia_sexo: PreferenciaSexo
  tipo_cama: string
  bano_privado: boolean
  wifi: boolean
  idioma_vivienda: string
  estado: EstadoAnuncio
  destacado: boolean
  created_at: string
  imagenes_anuncio?: ImagenAnuncio[]
}

export interface ImagenAnuncio {
  id: string
  anuncio_id: string
  url: string
  orden: number
}

export interface Profile {
  id: string
  nombre: string
  telefono: string
  descripcion?: string
  tipo: 'arrendador' | 'inquilino' | 'admin'
  created_at: string
}

export interface Mensaje {
  id: string
  conversacion_id: string
  sender_id: string
  contenido: string
  leido: boolean
  created_at: string
}

export interface Conversacion {
  id: string
  anuncio_id: string
  inquilino_id: string
  arrendador_id: string
  created_at: string
  anuncio?: Anuncio
}

export type TipoBusqueda   = 'anual' | 'temporero' | 'ambos'
export type SituacionLaboral = 'trabajador' | 'estudiante' | 'temporero'

export interface PerfilInquilino {
  id: string
  user_id: string
  nombre: string
  edad: number
  tipo_busqueda: TipoBusqueda
  parroquias: string[]
  presupuesto_max: number
  fecha_entrada: string
  fecha_salida: string | null
  situacion: SituacionLaboral
  sector: string
  fumador: boolean
  mascotas: boolean
  acompanado: boolean
  descripcion: string
  estado: 'activo' | 'inactivo'
  destacado: boolean
  created_at: string
}
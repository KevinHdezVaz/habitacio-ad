export type TipoEstancia = 'anual' | 'temporero' | 'ambos'
export type EstadoAnuncio = 'pendiente' | 'activo' | 'inactivo'
export type PreferenciaSexo = 'chicas' | 'chicos' | 'indiferente'
export type TipoUsuario = 'arrendador' | 'inquilino' | 'admin'

export interface ImagenAnuncio {
  id: string
  anuncio_id: string
  url: string
  orden: number
  created_at: string
}

export interface Anuncio {
  id: string
  user_id: string
  titulo: string
  descripcion: string | null
  normas: string | null
  parroquia: string | null
  zona: string | null
  precio: number
  disponible_desde: string | null
  tipo_estancia: TipoEstancia | null
  fianza: boolean
  importe_fianza: number | null
  gastos_incluidos: boolean
  duracion_minima: string | null
  metros_habitacion: number | null
  metros_piso: number | null
  num_personas: number | null
  vive_propietario: boolean
  admite_pareja: boolean
  admite_mascotas: boolean
  empadronamiento: boolean
  fumadores: boolean
  preferencia_sexo: PreferenciaSexo | null
  tipo_cama: string | null
  bano_privado: boolean
  wifi: boolean
  idioma_vivienda: string | null
  estado: EstadoAnuncio
  destacado: boolean
  created_at: string
  imagenes_anuncio?: ImagenAnuncio[]
}

export interface Profile {
  id: string
  nombre: string | null
  telefono: string | null
  tipo: TipoUsuario | null
  created_at: string
}

export interface Conversacion {
  id: string
  anuncio_id: string
  inquilino_id: string
  arrendador_id: string
  created_at: string
  anuncios?: Pick<Anuncio, 'id' | 'titulo' | 'parroquia'>
  profiles?: Pick<Profile, 'id' | 'nombre'>
}

export interface Mensaje {
  id: string
  conversacion_id: string
  sender_id: string
  contenido: string
  leido: boolean
  created_at: string
}

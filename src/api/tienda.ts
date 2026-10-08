import api from './client'

export interface TiendaConfig {
  id: number
  sistema: 'conlineweb' | 'hostingpro'
  hero_badge?: string
  hero_titulo: string
  hero_subtitulo?: string
  hero_cta_texto?: string
  hero_cta_enlace?: string
  whatsapp_contacto?: string
  whatsapp_mensaje?: string
  email_contacto?: string
  anuncio_activo: number
  anuncio_texto?: string
  actualizado_en?: string
}

export interface TiendaConfigUpdate {
  hero_badge?: string
  hero_titulo?: string
  hero_subtitulo?: string
  hero_cta_texto?: string
  hero_cta_enlace?: string
  whatsapp_contacto?: string
  whatsapp_mensaje?: string
  email_contacto?: string
  anuncio_activo?: number
  anuncio_texto?: string
}

export interface TiendaItem {
  id: number
  sistema: 'conlineweb' | 'hostingpro'
  nombre: string
  categoria?: string
  descripcion?: string
  precio: number
  periodo: string
  moneda: string
  caracteristicas?: string
  destacado: number
  activo: number
  orden: number
  creado_en?: string
  actualizado_en?: string
}

export interface TiendaItemPayload {
  sistema: 'conlineweb' | 'hostingpro'
  nombre: string
  categoria?: string
  descripcion?: string
  precio: number
  periodo?: string
  moneda?: string
  caracteristicas?: string
  destacado?: number
  activo?: number
  orden?: number
}

export interface TiendaFaq {
  id: number
  sistema: 'conlineweb' | 'hostingpro'
  pregunta: string
  respuesta: string
  orden: number
  activo: number
  creado_en?: string
}

export interface TiendaFaqPayload {
  sistema: 'conlineweb' | 'hostingpro'
  pregunta: string
  respuesta: string
  orden?: number
  activo?: number
}

export const tiendaApi = {
  // Configuración
  getConfig(sistema: 'conlineweb' | 'hostingpro') {
    return api.get<TiendaConfig>('/tienda/config', { params: { sistema } }).then(r => r.data)
  },
  updateConfig(sistema: 'conlineweb' | 'hostingpro', payload: TiendaConfigUpdate) {
    return api.put<TiendaConfig>('/tienda/config', payload, { params: { sistema } }).then(r => r.data)
  },

  // Catálogo de Items
  getItems(sistema: 'conlineweb' | 'hostingpro', soloActivos: boolean = false) {
    return api.get<TiendaItem[]>('/tienda/items', { params: { sistema, solo_activos: soloActivos } }).then(r => r.data)
  },
  createItem(payload: TiendaItemPayload) {
    return api.post<TiendaItem>('/tienda/items', payload).then(r => r.data)
  },
  updateItem(itemId: number, payload: Partial<TiendaItemPayload>) {
    return api.put<TiendaItem>(`/tienda/items/${itemId}`, payload).then(r => r.data)
  },
  deleteItem(itemId: number) {
    return api.delete<{ message: string; id: number }>(`/tienda/items/${itemId}`).then(r => r.data)
  },

  // FAQs
  getFaqs(sistema: 'conlineweb' | 'hostingpro', soloActivos: boolean = false) {
    return api.get<TiendaFaq[]>('/tienda/faqs', { params: { sistema, solo_activos: soloActivos } }).then(r => r.data)
  },
  createFaq(payload: TiendaFaqPayload) {
    return api.post<TiendaFaq>('/tienda/faqs', payload).then(r => r.data)
  },
  updateFaq(faqId: number, payload: Partial<TiendaFaqPayload>) {
    return api.put<TiendaFaq>(`/tienda/faqs/${faqId}`, payload).then(r => r.data)
  },
  deleteFaq(faqId: number) {
    return api.delete<{ message: string; id: number }>(`/tienda/faqs/${faqId}`).then(r => r.data)
  }
}

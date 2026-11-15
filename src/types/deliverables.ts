export type DeliverableType = 'file' | 'link' | 'text' | 'license_code';

export interface ProductDeliverable {
  id: string;
  product_id?: string;
  title: string;
  description?: string;
  type: DeliverableType;
  
  // Para ficheiros (PDF, ZIP, EPUB, vídeo, etc.)
  file_path?: string; // Caminho no bucket privado do Supabase Storage
  file_name?: string; // Nome original do ficheiro
  file_size_bytes?: number; // Tamanho em bytes
  file_mime_type?: string; // application/pdf, application/zip, etc.
  
  // Para links externos (Google Drive, Área de Membros, etc.)
  external_url?: string;
  
  // Para textos, instruções ou códigos de acesso
  content_text?: string;
  
  // Regras de entrega e limites
  download_limit?: number; // 0 = ilimitado
  expires_in_days?: number; // 0 = vitalício
  is_active: boolean;
  sort_order: number;
  
  created_at?: string;
  updated_at?: string;
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'manual_approved';
export type DeliveryStatus = 'pending' | 'delivered' | 'revoked';
export type DeliveryMode = 'automatic' | 'manual';

export interface Order {
  id: string;
  reference: string; // Ex: DP-20261116-A1B2C3
  product_id: string;
  product_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  amount: number;
  currency: string;
  payment_method?: string; // mpesa, emola, card, etc.
  payment_gateway: string; // paysuite
  gateway_payment_id?: string;
  checkout_url?: string;
  status: OrderStatus;
  delivery_status: DeliveryStatus;
  delivery_mode: DeliveryMode;
  access_token: string;
  access_expires_at?: string;
  paid_at?: string;
  delivered_at?: string;
  metadata?: Record<string, any>;
  deliverables?: ProductDeliverable[];
  created_at: string;
  updated_at: string;
}

export interface WebhookLog {
  id: string;
  gateway: string;
  event_type: string;
  event_id?: string;
  reference?: string;
  payload: any;
  headers?: Record<string, string>;
  signature_valid: boolean;
  status: 'processed' | 'ignored' | 'failed';
  error_message?: string;
  created_at: string;
}

export interface OrderAuditLog {
  id: string;
  order_id: string;
  action: 'manual_delivery_authorized' | 'payment_status_updated' | 'access_revoked' | 'access_resent' | 'webhook_received';
  actor_email: string;
  reason?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

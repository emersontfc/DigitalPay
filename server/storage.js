import { supabaseAdmin, STORAGE_BUCKET } from './supabaseServer.js';

/**
 * Gera URL assinada com expiração temporária (60 minutos) para arquivos privados
 * Nunca expõe URLs públicas nem permanentes para arquivos protegidos
 */
export async function generateSecureDownloadUrl(filePath, expiresInSeconds = 3600) {
  if (!filePath) return null;

  // Se o caminho já for uma URL externa ou link do Drive, não é arquivo protegido do bucket
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  try {
    const { data, error } = await supabaseAdmin
      .storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error) {
      console.warn('Aviso ao gerar URL assinada no Supabase Storage:', error.message);
      return null;
    }

    return data?.signedUrl || null;
  } catch (err) {
    console.error('Falha de conexão com Storage:', err);
    return null;
  }
}

/**
 * Upload seguro de entregável para o bucket privado
 */
export async function uploadPrivateDeliverableFile({
  productId,
  fileName,
  fileBuffer,
  mimeType
}) {
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `products/${productId}/${Date.now()}_${sanitizedName}`;

  try {
    const { data, error } = await supabaseAdmin
      .storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: true
      });

    if (error) {
      console.error('Erro ao fazer upload no Supabase Storage:', error);
      throw error;
    }

    return {
      success: true,
      filePath: storagePath,
      fileName,
      mimeType,
      sizeBytes: fileBuffer.length
    };
  } catch (err) {
    console.error('Falha ao gravar arquivo protegido:', err);
    throw err;
  }
}

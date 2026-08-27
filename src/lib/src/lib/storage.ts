import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Nome do bucket privado de artefatos
const PRIVATE_BUCKET = "artifacts";

/**
 * Gera um URL assinado e temporário para download de um artefato privado.
 * @param filePath Caminho do ficheiro no bucket (ex: "user_123/report.pdf")
 * @param expiresInSec Tempo de expiração do link em segundos (padrão: 5 minutos)
 */
export async function getPrivateArtifactUrl(filePath: string, expiresInSec: number = 300): Promise<string> {
  const { data, error } = await supabase.storage
    .from(PRIVATE_BUCKET)
    .createSignedUrl(filePath, expiresInSec);

  if (error) {
    throw new Error(`Erro ao gerar URL privado: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Faz upload de um artefato diretamente para o bucket privado.
 */
export async function uploadPrivateArtifact(filePath: string, fileBuffer: Buffer, contentType: string) {
  const { data, error } = await supabase.storage
    .from(PRIVATE_BUCKET)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Erro ao carregar artefato: ${error.message}`);
  }

  return data;
}

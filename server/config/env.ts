// Validação e bloqueio de arranjo caso existam variáveis críticas em falta

const requiredEnvVars = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
] as const;

export function validateEnv(): void {
  const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `[CRÍTICO] Arranjo abortado. Variáveis de ambiente obrigatórias em falta: ${missingVars.join(", ")}`
    );
  }
}

export const env = {
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  PORT: process.env.PORT || 3000,
};

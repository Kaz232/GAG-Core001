import request from "supertest";
import { app } from "../server/index";

describe("Testes de Segurança da API e RLS", () => {
  
  // 1. Validar rejeição de acesso sem autenticação
  it("Deve bloquear pedidos sem cabeçalho Authorization com 401", async () => {
    const response = await request(app).get("/api/registry");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  // 2. Validar rejeição com token inválido
  it("Deve rejeitar tokens JWT malformatados ou expirados", async () => {
    const response = await request(app)
      .get("/api/registry")
      .set("Authorization", "Bearer token_invalido_123");
    
    expect(response.status).toBe(401);
  });

  // 3. Validar isolamento de artefatos privados
  it("Não deve expor URLs de armazenamento público direto", async () => {
    const response = await request(app).get("/public/artifacts/secret.pdf");
    expect(response.status).toBe(404);
  });
});

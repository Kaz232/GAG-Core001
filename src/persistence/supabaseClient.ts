/**
 * GAG CORE OS — FASE 3: CENTRALIZED SUPABASE & PERSISTENCE CLIENT
 * Manages connections, authentication, query execution, storage buckets,
 * and high-availability relational persistence for the GAG Core ecosystem.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface DatabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  isConfigured: boolean;
}

// In-process resilient relational storage engine
class InMemoryRelationalEngine {
  private tables: Map<string, Map<string, any>> = new Map();

  constructor() {
    const tableNames = [
      "agents",
      "skills",
      "tools",
      "capabilities",
      "agent_capabilities",
      "executions",
      "execution_steps",
      "tasks",
      "task_dependencies",
      "handoffs",
      "retry_attempts",
      "qa_reports",
      "artifacts",
      "knowledge_items",
      "audit_events",
    ];
    for (const t of tableNames) {
      this.tables.set(t, new Map());
    }
  }

  public getTable(name: string): Map<string, any> {
    if (!this.tables.has(name)) {
      this.tables.set(name, new Map());
    }
    return this.tables.get(name)!;
  }

  public insert(table: string, record: any): any {
    const t = this.getTable(table);
    const id = record.id || `rec_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();
    const withTimestamps = {
      ...record,
      id,
      created_at: record.created_at || now,
      updated_at: record.updated_at || now,
    };
    t.set(id, withTimestamps);
    return { ...withTimestamps };
  }

  public upsert(table: string, record: any, onConflict = "id"): any {
    const t = this.getTable(table);
    let targetId = record[onConflict] || record.id;

    // Check if record exists with conflict key
    if (onConflict !== "id") {
      for (const [k, v] of t.entries()) {
        if (v[onConflict] === record[onConflict]) {
          targetId = k;
          break;
        }
      }
    }

    if (!targetId) {
      targetId = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }

    const existing = t.get(targetId) || {};
    const now = new Date().toISOString();
    const updated = {
      ...existing,
      ...record,
      id: targetId,
      created_at: existing.created_at || record.created_at || now,
      updated_at: now,
    };
    t.set(targetId, updated);
    return { ...updated };
  }

  public select(table: string, filter?: (item: any) => boolean): any[] {
    const t = this.getTable(table);
    const list = Array.from(t.values());
    if (!filter) return list;
    return list.filter(filter);
  }

  public selectById(table: string, id: string): any | null {
    const t = this.getTable(table);
    return t.get(id) || null;
  }

  public update(table: string, id: string, updates: any): any | null {
    const t = this.getTable(table);
    const existing = t.get(id);
    if (!existing) return null;
    const now = new Date().toISOString();
    const updated = { ...existing, ...updates, updated_at: now };
    t.set(id, updated);
    return { ...updated };
  }

  public delete(table: string, id: string): boolean {
    const t = this.getTable(table);
    return t.delete(id);
  }

  public count(table: string, filter?: (item: any) => boolean): number {
    return this.select(table, filter).length;
  }

  public clear(table?: string): void {
    if (table) {
      this.getTable(table).clear();
    } else {
      for (const t of this.tables.values()) {
        t.clear();
      }
    }
  }
}

export class SupabasePersistenceClient {
  private static instance: SupabasePersistenceClient;
  private client: SupabaseClient | null = null;
  private localEngine: InMemoryRelationalEngine = new InMemoryRelationalEngine();
  private config: DatabaseConfig;

  private constructor() {
    this.config = this.resolveConfig();
    this.initializeSupabase();
  }

  public static getInstance(): SupabasePersistenceClient {
    if (!SupabasePersistenceClient.instance) {
      SupabasePersistenceClient.instance = new SupabasePersistenceClient();
    }
    return SupabasePersistenceClient.instance;
  }

  private resolveConfig(): DatabaseConfig {
    let url = "";
    let anonKey = "";
    let serviceRoleKey = "";

    // Check process.env (Node / Server context)
    if (typeof process !== "undefined" && process.env) {
      url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
      anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
      serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    }

    // Check import.meta.env (Vite / Client context)
    if (!url && typeof import.meta !== "undefined" && (import.meta as any).env) {
      const meta = (import.meta as any).env;
      url = meta.VITE_SUPABASE_URL || meta.SUPABASE_URL || "";
      anonKey = meta.VITE_SUPABASE_ANON_KEY || meta.SUPABASE_ANON_KEY || "";
    }

    // Check localStorage in browser context
    if (!url && typeof localStorage !== "undefined") {
      url = localStorage.getItem("gag_supabase_url") || "";
      anonKey = localStorage.getItem("gag_supabase_anon_key") || "";
      serviceRoleKey = localStorage.getItem("gag_supabase_service_key") || "";
    }

    const isConfigured = Boolean(
      url &&
      anonKey &&
      url.startsWith("http") &&
      anonKey.length > 10
    );

    return { url, anonKey, serviceRoleKey, isConfigured };
  }

  private initializeSupabase(): void {
    if (this.config.isConfigured) {
      try {
        const keyToUse = this.config.serviceRoleKey || this.config.anonKey;
        this.client = createClient(this.config.url, keyToUse, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          },
        });
      } catch (err) {
        console.warn("Aviso ao inicializar cliente Supabase. Utilizando storage resiliente:", err);
      }
    }
  }

  public getRawClient(): SupabaseClient | null {
    return this.client;
  }

  public isConfigured(): boolean {
    return this.config.isConfigured && this.client !== null;
  }

  public getConfig(): DatabaseConfig {
    return { ...this.config };
  }

  public getLocalEngine(): InMemoryRelationalEngine {
    return this.localEngine;
  }

  // --- GENERIC CRUD DATABASE ADAPTER METHODS ---

  public async insert<T = any>(table: string, record: any): Promise<T> {
    // 1. If Supabase is active, attempt insert
    if (this.client) {
      try {
        const { data, error } = await this.client.from(table).insert(record).select().single();
        if (!error && data) {
          this.localEngine.upsert(table, data);
          return data as T;
        }
      } catch (e) {
        // Fallback to local engine on connection error
      }
    }
    // 2. Resilient local engine write
    return this.localEngine.insert(table, record) as T;
  }

  public async upsert<T = any>(table: string, record: any, onConflict = "id"): Promise<T> {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from(table)
          .upsert(record, { onConflict })
          .select()
          .single();
        if (!error && data) {
          this.localEngine.upsert(table, data, onConflict);
          return data as T;
        }
      } catch (e) {
        // Fallback
      }
    }
    return this.localEngine.upsert(table, record, onConflict) as T;
  }

  public async selectById<T = any>(table: string, id: string): Promise<T | null> {
    if (this.client) {
      try {
        const { data, error } = await this.client.from(table).select("*").eq("id", id).single();
        if (!error && data) {
          this.localEngine.upsert(table, data);
          return data as T;
        }
      } catch (e) {
        // Fallback
      }
    }
    return this.localEngine.selectById(table, id) as T | null;
  }

  public async select<T = any>(
    table: string,
    filter?: (item: any) => boolean,
    supabaseQueryModifier?: (query: any) => any
  ): Promise<T[]> {
    if (this.client && supabaseQueryModifier) {
      try {
        let q = this.client.from(table).select("*");
        q = supabaseQueryModifier(q);
        const { data, error } = await q;
        if (!error && data && data.length > 0) {
          for (const item of data) {
            this.localEngine.upsert(table, item);
          }
          return data as T[];
        }
      } catch (e) {
        // Fallback
      }
    }
    return this.localEngine.select(table, filter) as T[];
  }

  public async update<T = any>(table: string, id: string, updates: any): Promise<T | null> {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from(table)
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        if (!error && data) {
          this.localEngine.update(table, id, data);
          return data as T;
        }
      } catch (e) {
        // Fallback
      }
    }
    return this.localEngine.update(table, id, updates) as T | null;
  }

  public async delete(table: string, id: string): Promise<boolean> {
    if (this.client) {
      try {
        const { error } = await this.client.from(table).delete().eq("id", id);
        if (!error) {
          this.localEngine.delete(table, id);
          return true;
        }
      } catch (e) {
        // Fallback
      }
    }
    return this.localEngine.delete(table, id);
  }
}

export const dbClient = SupabasePersistenceClient.getInstance();

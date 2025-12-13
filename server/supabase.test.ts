import { describe, it, expect } from "vitest";

describe("Supabase Configuration", () => {
  it("should have valid Supabase environment variables", () => {
    expect(process.env.SUPABASE_URL).toBeDefined();
    expect(process.env.SUPABASE_ANON_KEY).toBeDefined();
    expect(process.env.SUPABASE_SERVICE_KEY).toBeDefined();
    
    // Validate URL format
    expect(process.env.SUPABASE_URL).toMatch(/^https:\/\/.+\.supabase\.co$/);
    
    // Validate JWT token format (should have 3 parts separated by dots)
    const anonKeyParts = process.env.SUPABASE_ANON_KEY?.split(".") || [];
    expect(anonKeyParts.length).toBe(3);
    
    const serviceKeyParts = process.env.SUPABASE_SERVICE_KEY?.split(".") || [];
    expect(serviceKeyParts.length).toBe(3);
  });

  it("should validate Supabase URL structure", () => {
    const url = process.env.SUPABASE_URL;
    expect(url).toBeDefined();
    expect(url).toContain("supabase.co");
    expect(url).toMatch(/^https:\/\/[a-z0-9]+\.supabase\.co$/);
  });

  it("should have valid JWT tokens in keys", () => {
    const anonKey = process.env.SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    
    // JWT tokens should start with "eyJ" (base64 encoded {"alg"...)
    expect(anonKey).toMatch(/^eyJ/);
    expect(serviceKey).toMatch(/^eyJ/);
  });

  it("should have access tokens configured", () => {
    expect(process.env.SUPABASE_ACCESS_TOKEN).toBeDefined();
    expect(process.env.SUPABASE_PUBLISHED_KEY).toBeDefined();
    expect(process.env.SUPABASE_SECRET_KEY).toBeDefined();
  });
});

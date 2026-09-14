import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, findAdminMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  findAdminMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ auth: authMock }));
vi.mock("@/lib/db", () => ({ db: { admin: { findUnique: findAdminMock } } }));

import { requireAdmin } from "@/lib/auth-guard";

const A_VALID_SESSION = { user: { id: "admin-1", email: "admin@example.com" } };
const THE_STORED_ADMIN = { id: "admin-1", email: "admin@example.com" };

describe("requireAdmin", () => {
  beforeEach(() => {
    authMock.mockReset();
    findAdminMock.mockReset();
    findAdminMock.mockResolvedValue(THE_STORED_ADMIN);
  });

  it("denies the request when there is no session at all", async () => {
    authMock.mockResolvedValue(null);

    const result = await requireAdmin();

    expect(result.ok).toBe(false);
  });

  it("denies the request when the session carries no user", async () => {
    authMock.mockResolvedValue({ user: undefined });

    const result = await requireAdmin();

    expect(result.ok).toBe(false);
  });

  it("denies the request when the session user has no id", async () => {
    authMock.mockResolvedValue({ user: { email: "admin@example.com" } });

    const result = await requireAdmin();

    expect(result.ok).toBe(false);
  });

  it("does not query the database when the session is already invalid", async () => {
    authMock.mockResolvedValue(null);

    await requireAdmin();

    expect(findAdminMock).not.toHaveBeenCalled();
  });

  it("denies the request when the auth lookup throws", async () => {
    authMock.mockRejectedValue(new Error("session store unavailable"));

    const result = await requireAdmin();

    expect(result.ok).toBe(false);
  });

  it("allows the request and returns the admin identity for a valid session", async () => {
    authMock.mockResolvedValue(A_VALID_SESSION);

    const result = await requireAdmin();

    expect(result).toEqual({ ok: true, admin: THE_STORED_ADMIN });
  });

  it("denies a token whose admin account has since been deleted", async () => {
    authMock.mockResolvedValue(A_VALID_SESSION);
    findAdminMock.mockResolvedValue(null);

    const result = await requireAdmin();

    expect(result.ok).toBe(false);
  });

  it("denies the request when the admin lookup throws", async () => {
    authMock.mockResolvedValue(A_VALID_SESSION);
    findAdminMock.mockRejectedValue(new Error("connect ECONNREFUSED 127.0.0.1:5432"));

    const result = await requireAdmin();

    expect(result.ok).toBe(false);
  });

  it("trusts the stored record over the token when they disagree", async () => {
    authMock.mockResolvedValue({ user: { id: "admin-1", email: "stale@example.com" } });
    findAdminMock.mockResolvedValue({ id: "admin-1", email: "current@example.com" });

    const result = await requireAdmin();

    expect(result).toEqual({
      ok: true,
      admin: { id: "admin-1", email: "current@example.com" },
    });
  });

  it("does not leak internal detail in the denial message", async () => {
    authMock.mockRejectedValue(new Error("connect ECONNREFUSED 127.0.0.1:5432"));

    const result = await requireAdmin();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).not.toContain("ECONNREFUSED");
      expect(result.error.length).toBeGreaterThan(0);
    }
  });
});

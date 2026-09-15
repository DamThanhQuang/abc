import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Mocks ──────────────────────────────────────────────────────────────────
const { authMock, findAdminMock, writtenFiles } = vi.hoisted(() => ({
  authMock: vi.fn(),
  findAdminMock: vi.fn(),
  writtenFiles: [] as Array<{ path: string; size: number }>,
}));

vi.mock("@/lib/auth", () => ({ auth: authMock }));
vi.mock("@/lib/db", () => ({ db: { admin: { findUnique: findAdminMock } } }));
vi.mock("fs/promises", () => ({
  writeFile: vi.fn(async (p: string, buf: Buffer) => {
    writtenFiles.push({ path: p, size: buf.length });
  }),
  mkdir: vi.fn(async () => undefined),
}));

import { POST } from "@/app/api/upload/route";

// ─── Helpers ────────────────────────────────────────────────────────────────
// A valid 1×1 PNG (68 bytes).
const PNG_BYTES = new Uint8Array(
  Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64"),
);

function makeRequest(file: File): Request {
  const form = new FormData();
  form.append("file", file);
  return new Request("http://localhost:3000/api/upload", { method: "POST", body: form });
}

function makeFile(name: string, bytes: Uint8Array, type: string): File {
  return new File([bytes as BlobPart], name, { type });
}

const ADMIN = { id: "admin-1", email: "admin@example.com" };

describe("POST /api/upload", () => {
  beforeEach(() => {
    writtenFiles.length = 0;
    authMock.mockReset();
    findAdminMock.mockReset();
  });

  // ── Authentication ──────────────────────────────────────────────────────
  it("rejects an anonymous request", async () => {
    authMock.mockResolvedValue(null);

    const res = await POST(makeRequest(makeFile("photo.png", PNG_BYTES, "image/png")));

    expect(res.status).toBe(401);
    expect(writtenFiles).toHaveLength(0);
  });

  it("accepts an upload from an authenticated admin", async () => {
    authMock.mockResolvedValue({ user: ADMIN });
    findAdminMock.mockResolvedValue(ADMIN);

    const res = await POST(makeRequest(makeFile("photo.png", PNG_BYTES, "image/png")));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toMatch(/\/uploads\/[a-f0-9]{32}\.webp$/);
    expect(body.format).toBe("webp");
    expect(body.size).toBeLessThan(PNG_BYTES.length);
    expect(writtenFiles).toHaveLength(1);
  });

  // ── Content verification ────────────────────────────────────────────────
  it("rejects a file whose content does not match a known image format", async () => {
    authMock.mockResolvedValue({ user: ADMIN });
    findAdminMock.mockResolvedValue(ADMIN);

    const html = new TextEncoder().encode("<html><script>alert(1)</script></html>");
    const res = await POST(makeRequest(makeFile("page.html", html, "image/png")));

    expect(res.status).toBe(400);
    expect(writtenFiles).toHaveLength(0);
  });

  it("rejects SVG regardless of content", async () => {
    authMock.mockResolvedValue({ user: ADMIN });
    findAdminMock.mockResolvedValue(ADMIN);

    const svg = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    const res = await POST(makeRequest(makeFile("icon.svg", svg, "image/svg+xml")));

    expect(res.status).toBe(400);
    expect(writtenFiles).toHaveLength(0);
  });

  // ── Extension ───────────────────────────────────────────────────────────
  it("normalizes verified image content to WebP regardless of the filename", async () => {
    authMock.mockResolvedValue({ user: ADMIN });
    findAdminMock.mockResolvedValue(ADMIN);

    // Client sends a .php extension but the content is a valid PNG.
    const res = await POST(makeRequest(makeFile("shell.php", PNG_BYTES, "image/png")));
    const body = await res.json();

    expect(body.url).toMatch(/\.webp$/);
    expect(body.url).not.toContain(".php");
  });

  // ── Size limit ──────────────────────────────────────────────────────────
  it("rejects files exceeding the size limit", async () => {
    authMock.mockResolvedValue({ user: ADMIN });
    findAdminMock.mockResolvedValue(ADMIN);

    // 5 MB + 1 byte
    const big = new Uint8Array(5 * 1024 * 1024 + 1);
    // Give it a PNG header so it passes content check
    big.set(PNG_BYTES.slice(0, 8));
    const res = await POST(makeRequest(makeFile("huge.png", big, "image/png")));

    expect(res.status).toBe(400);
    expect(writtenFiles).toHaveLength(0);
  });
});

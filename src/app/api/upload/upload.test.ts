import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Mocks ──────────────────────────────────────────────────────────────────
const { authMock, findAdminMock, uploadedObjects } = vi.hoisted(() => ({
  authMock: vi.fn(),
  findAdminMock: vi.fn(),
  uploadedObjects: [] as Array<{ key: string; size: number }>,
}));

vi.mock("@/lib/auth", () => ({ auth: authMock }));
vi.mock("@/lib/db", () => ({ db: { admin: { findUnique: findAdminMock } } }));
vi.mock("@/lib/r2", () => ({
  uploadToR2: vi.fn(async (key: string, body: Buffer) => {
    uploadedObjects.push({ key, size: body.length });
  }),
  getPublicUrl: vi.fn((key: string) => `https://r2.example.com/${key}`),
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
    uploadedObjects.length = 0;
    authMock.mockReset();
    findAdminMock.mockReset();
  });

  // ── Authentication ──────────────────────────────────────────────────────
  it("rejects an anonymous request", async () => {
    authMock.mockResolvedValue(null);

    const res = await POST(makeRequest(makeFile("photo.png", PNG_BYTES, "image/png")));

    expect(res.status).toBe(401);
    expect(uploadedObjects).toHaveLength(0);
  });

  it("accepts an upload from an authenticated admin", async () => {
    authMock.mockResolvedValue({ user: ADMIN });
    findAdminMock.mockResolvedValue(ADMIN);

    const res = await POST(makeRequest(makeFile("photo.png", PNG_BYTES, "image/png")));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toMatch(/uploads\/[a-f0-9]{32}\.webp/);
    expect(body.format).toBe("webp");
    expect(body.size).toBeLessThan(PNG_BYTES.length);
    expect(uploadedObjects).toHaveLength(1);
  });

  // ── Content verification ────────────────────────────────────────────────
  it("rejects a file whose content does not match a known image format", async () => {
    authMock.mockResolvedValue({ user: ADMIN });
    findAdminMock.mockResolvedValue(ADMIN);

    const html = new TextEncoder().encode("<html><script>alert(1)</script></html>");
    const res = await POST(makeRequest(makeFile("page.html", html, "image/png")));

    expect(res.status).toBe(400);
    expect(uploadedObjects).toHaveLength(0);
  });

  it("rejects SVG regardless of content", async () => {
    authMock.mockResolvedValue({ user: ADMIN });
    findAdminMock.mockResolvedValue(ADMIN);

    const svg = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    const res = await POST(makeRequest(makeFile("icon.svg", svg, "image/svg+xml")));

    expect(res.status).toBe(400);
    expect(uploadedObjects).toHaveLength(0);
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

    // Just above the shared client/server limit, below Vercel's payload limit.
    const big = new Uint8Array(3 * 1024 * 1024 + 1);
    // Give it a PNG header so it passes content check
    big.set(PNG_BYTES.slice(0, 8));
    const res = await POST(makeRequest(makeFile("huge.png", big, "image/png")));

    expect(res.status).toBe(400);
    expect(uploadedObjects).toHaveLength(0);
  });

  it("rejects a text field instead of a file without a server error", async () => {
    authMock.mockResolvedValue({ user: ADMIN });
    findAdminMock.mockResolvedValue(ADMIN);
    const form = new FormData();
    form.append("file", "not a file");
    const res = await POST(new Request("http://localhost:3000/api/upload", { method: "POST", body: form }));
    expect(res.status).toBe(400);
    expect(uploadedObjects).toHaveLength(0);
  });

  // ── Banner ──────────────────────────────────────────────────────────────
  describe("purpose=banner", () => {
    async function makePng(width: number, height: number) {
      const sharp = (await import("sharp")).default;
      const buffer = await sharp({
        create: { width, height, channels: 3, background: { r: 6, g: 38, b: 74 } },
      }).png().toBuffer();
      return new Uint8Array(buffer);
    }

    function makeBannerRequest(file: File): Request {
      const form = new FormData();
      form.append("file", file);
      form.append("purpose", "banner");
      return new Request("http://localhost:3000/api/upload", { method: "POST", body: form });
    }

    beforeEach(() => {
      authMock.mockResolvedValue({ user: ADMIN });
      findAdminMock.mockResolvedValue(ADMIN);
    });

    it("rejects an image smaller than the banner frame", async () => {
      const res = await POST(makeBannerRequest(makeFile("small.png", await makePng(1280, 720), "image/png")));

      expect(res.status).toBe(400);
      expect((await res.json()).error).toMatch(/quá nhỏ/);
      expect(uploadedObjects).toHaveLength(0);
    });

    it("keeps full resolution up to 2560px and returns a blur placeholder", async () => {
      const res = await POST(makeBannerRequest(makeFile("wide.png", await makePng(3200, 1800), "image/png")));

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.width).toBe(2560);
      expect(body.height).toBe(1440);
      expect(body.blurDataUrl).toMatch(/^data:image\/webp;base64,/);
      expect(uploadedObjects).toHaveLength(1);
    });

    it("does not upscale an image that already meets the minimum", async () => {
      const res = await POST(makeBannerRequest(makeFile("exact.png", await makePng(1920, 1080), "image/png")));
      const body = await res.json();

      expect(body.width).toBe(1920);
      expect(body.height).toBe(1080);
    });

    it("rejects a portrait image", async () => {
      const res = await POST(makeBannerRequest(makeFile("tall.png", await makePng(2400, 3200), "image/png")));

      expect(res.status).toBe(400);
      expect((await res.json()).error).toMatch(/ảnh dọc/);
      expect(uploadedObjects).toHaveLength(0);
    });

    it("rejects an image wider than 3:1", async () => {
      const res = await POST(makeBannerRequest(makeFile("strip.png", await makePng(6000, 1500), "image/png")));

      expect(res.status).toBe(400);
      expect((await res.json()).error).toMatch(/quá dài/);
    });

    it("never shrinks a wide image below the minimum height", async () => {
      // Thu theo chiều ngang 2560px sẽ còn 2560×1024, thấp hơn khung banner.
      const res = await POST(makeBannerRequest(makeFile("wide.png", await makePng(5000, 2000), "image/png")));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.height).toBe(1080);
      expect(body.width).toBe(2700);
    });

    it("keeps the default pipeline for regular uploads", async () => {
      const res = await POST(makeRequest(makeFile("wide.png", await makePng(3200, 1800), "image/png")));
      const body = await res.json();

      expect(body.width).toBe(1600);
      expect(body.blurDataUrl).toBeUndefined();
    });
  });
});

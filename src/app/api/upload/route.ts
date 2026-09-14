import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { requireAdmin } from "@/lib/auth-guard";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Vercel Serverless Function body limit is 4.5 MB.
const MAX_SIZE = 4.5 * 1024 * 1024;

// ─── Magic-byte detection ───────────────────────────────────────────────────
// We decide the format from the first bytes of the actual file content, not
// from the MIME type the client claims. SVG is deliberately absent: it is XML
// that can carry script and event handlers, and serving it from the same
// origin is a stored-XSS vector.
type ImageFormat = "png" | "jpg" | "webp" | "avif";

function detectImageFormat(header: Uint8Array): ImageFormat | null {
  // PNG: 89 50 4E 47
  if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47) {
    return "png";
  }
  // JPEG: FF D8 FF
  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return "jpg";
  }
  // WebP: RIFF....WEBP
  if (
    header[0] === 0x52 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x46 &&
    header[8] === 0x57 &&
    header[9] === 0x45 &&
    header[10] === 0x42 &&
    header[11] === 0x50
  ) {
    return "webp";
  }
  // AVIF: ....ftypavif (offset 4)
  if (
    header[4] === 0x66 &&
    header[5] === 0x74 &&
    header[6] === 0x79 &&
    header[7] === 0x70 &&
    header[8] === 0x61 &&
    header[9] === 0x76 &&
    header[10] === 0x69 &&
    header[11] === 0x66
  ) {
    return "avif";
  }

  return null;
}

export async function POST(request: Request) {
  // ── Auth ────────────────────────────────────────────────────────────────
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Khong co file" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File qua lon (toi da 4.5 MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ── Verify content ──────────────────────────────────────────────────
    const header = new Uint8Array(buffer.buffer, buffer.byteOffset, Math.min(buffer.length, 12));
    const format = detectImageFormat(header);

    if (!format) {
      return NextResponse.json(
        { error: "Dinh dang khong duoc ho tro. Chi chap nhan: JPEG, PNG, WebP, AVIF." },
        { status: 400 },
      );
    }

    // Extension comes from the verified format, never from the client filename.
    const filename = `${crypto.randomUUID()}.${format}`;

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload that bai" }, { status: 500 });
  }
}

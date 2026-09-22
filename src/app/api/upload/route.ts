import { NextResponse } from "next/server";
import crypto from "crypto";
import sharp from "sharp";
import { requireAdmin } from "@/lib/auth-guard";
import { IMAGE_UPLOAD } from "@/lib/image-upload-config";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { uploadToR2, getPublicUrl } from "@/lib/r2";

export const runtime = "nodejs";

// Leave room for multipart framing below Vercel's 4.5 MB request limit.
const MAX_SIZE = IMAGE_UPLOAD.maxReceivedBytes;
const UPLOAD_MAX = 20;
const UPLOAD_WINDOW_MS = 60_000;

// ─── Magic-byte detection ───────────────────────────────────────────────────
// We decide the format from the first bytes of the actual file content, not
// from the MIME type the client claims. SVG is deliberately absent: it is XML
// that can carry script and event handlers, and serving it from the same
// origin is a stored-XSS vector.
type ImageFormat = "png" | "jpg" | "webp" | "avif";

async function optimizeForStorage(buffer: Buffer) {
  const variants = [
    { dimension: IMAGE_UPLOAD.maxDimension, quality: IMAGE_UPLOAD.webpQuality },
    { dimension: 1400, quality: 70 },
    { dimension: 1200, quality: 62 },
  ];

  for (const variant of variants) {
    const result = await sharp(buffer, {
      failOn: "error",
      limitInputPixels: IMAGE_UPLOAD.maxInputPixels,
    })
      .rotate()
      .resize({
        width: variant.dimension,
        height: variant.dimension,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: variant.quality, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    if (result.data.length <= IMAGE_UPLOAD.maxStoredBytes) return result;
  }

  throw new Error("Ảnh sau khi tối ưu vẫn vượt quá 1,5 MB.");
}

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
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: 401 });
  }

  const ip = getClientIp(request.headers);
  try {
    const rl = await checkRateLimit(
      `upload:${guard.admin.id}:${ip}`,
      UPLOAD_MAX,
      UPLOAD_WINDOW_MS,
    );
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Quá nhiều yêu cầu. Vui lòng thử lại sau." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
      );
    }
  } catch (error) {
    console.error("upload rate limit:", error);
    return NextResponse.json(
      { error: "Không thể xác minh giới hạn tải lên. Vui lòng thử lại sau." },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Không có file" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      console.warn("Upload rejected: request image exceeds 3 MB", { size: file.size });
      return NextResponse.json(
        { error: "Ảnh gửi lên vượt quá 3 MB. Vui lòng để trình duyệt nén ảnh trước." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ── Verify content ──────────────────────────────────────────────────
    const header = new Uint8Array(buffer.buffer, buffer.byteOffset, Math.min(buffer.length, 12));
    const format = detectImageFormat(header);

    if (!format) {
      console.warn("Upload rejected: unsupported image content", { size: file.size });
      return NextResponse.json(
        { error: "Định dạng không được hỗ trợ. Chỉ chấp nhận JPEG, PNG, WebP, AVIF." },
        { status: 400 },
      );
    }

    let optimized: Awaited<ReturnType<typeof optimizeForStorage>>;
    try {
      optimized = await optimizeForStorage(buffer);
    } catch (optimizationError) {
      const message = optimizationError instanceof Error
        ? optimizationError.message
        : "Không thể xử lý ảnh.";
      console.warn("Upload rejected during image optimization", {
        format,
        size: file.size,
        reason: message,
      });
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const hash = crypto.createHash("sha256").update(optimized.data).digest("hex").slice(0, 32);
    const key = `uploads/${hash}.webp`;

    await uploadToR2(key, optimized.data, "image/webp");

    return NextResponse.json({
      url: getPublicUrl(key),
      size: optimized.data.length,
      originalSize: file.size,
      width: optimized.info.width,
      height: optimized.info.height,
      format: "webp",
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Tải lên thất bại" }, { status: 500 });
  }
}

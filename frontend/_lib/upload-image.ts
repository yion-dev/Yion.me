import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/_lib/admin-request";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function imageExtension(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value)) return "png";
  const text = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  if (bytes.length >= 12 && text(0, 4) === "RIFF" && text(8, 12) === "WEBP") return "webp";
  if (bytes.length >= 6 && ["GIF87a", "GIF89a"].includes(text(0, 6))) return "gif";
  if (bytes.length >= 12 && text(4, 8) === "ftyp" && ["avif", "avis"].includes(text(8, 12))) return "avif";
  return null;
}

const contentTypes: Record<string, string> = {
  jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", avif: "image/avif",
};

export async function uploadImage(request: NextRequest, folder: "blog-images" | "project-images") {
  const authError = await requireAdmin(request, true);
  if (authError) return authError;

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return NextResponse.json({ error: "Image storage is not configured" }, { status: 503 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("image");
  if (!(file instanceof File) || !file.size || file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: "Choose an image smaller than 5 MB" }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const extension = imageExtension(bytes);
  if (!extension || file.type !== contentTypes[extension]) {
    return NextResponse.json({ error: "Use a JPEG, PNG, WebP, GIF, or AVIF image" }, { status: 400 });
  }

  try {
    const blob = await put(`${folder}/${crypto.randomUUID()}.${extension}`, Buffer.from(bytes), {
      access: "public",
      addRandomSuffix: false,
      contentType: contentTypes[extension],
      token,
    });
    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json({ error: "Image upload failed" }, { status: 502 });
  }
}

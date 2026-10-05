import { del, head, list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/_lib/admin-request";
import { loadImageReferences } from "@/_lib/image-references";

export const runtime = "nodejs";

const imagePath = /\.(?:jpe?g|png|webp|gif|avif|svg|bmp|ico|tiff?)$/i;

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return NextResponse.json({ error: "Image storage is not configured" }, { status: 503 });

  try {
    const blobs: Array<{ pathname: string; url: string; size: number; uploadedAt: Date }> = [];
    let cursor: string | undefined;
    while (true) {
      const page = await list({ token, cursor, limit: 1000 });
      blobs.push(...page.blobs.filter(blob => imagePath.test(blob.pathname)));
      if (!page.hasMore) break;
      if (!page.cursor || page.cursor === cursor) throw new Error("Blob listing did not advance");
      cursor = page.cursor;
    }

    let references: ((url: string) => string[]) | null = null;
    try { references = await loadImageReferences(); } catch { /* Images can still be viewed while the backend is unavailable. */ }
    const images = blobs.map(blob => ({
      pathname: blob.pathname,
      url: blob.url,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
      references: references?.(blob.url) ?? [],
    })).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json({ images, usageAvailable: Boolean(references) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not load images from Vercel Blob" }, { status: 502 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request, true);
  if (authError) return authError;
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return NextResponse.json({ error: "Image storage is not configured" }, { status: 503 });

  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : "";
  let parsed: URL;
  try { parsed = new URL(url); } catch { return NextResponse.json({ error: "Invalid image URL" }, { status: 400 }); }
  if (parsed.protocol !== "https:" || !parsed.hostname.endsWith(".public.blob.vercel-storage.com") || parsed.search || parsed.hash) {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  let references: string[];
  try {
    references = (await loadImageReferences())(url);
  } catch {
    return NextResponse.json({ error: "Could not check whether this image is in use" }, { status: 503 });
  }
  if (references.length && body?.force !== true) {
    return NextResponse.json({ error: "This image is in use", references }, { status: 409 });
  }

  try {
    const blob = await head(url, { token });
    if (!blob.contentType.startsWith("image/")) {
      return NextResponse.json({ error: "This file is not an image" }, { status: 400 });
    }
    await del(url, { token, ifMatch: blob.etag });
    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json({ error: "Could not delete image from Vercel Blob" }, { status: 502 });
  }
}

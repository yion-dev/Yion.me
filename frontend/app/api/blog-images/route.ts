import { NextRequest } from "next/server";
import { uploadImage } from "@/_lib/upload-image";

export const runtime = "nodejs";

export function POST(request: NextRequest) {
  return uploadImage(request, "blog-images");
}

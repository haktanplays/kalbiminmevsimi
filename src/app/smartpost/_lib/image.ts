import { BACKGROUND_JPEG_QUALITY, BACKGROUND_MAX_EDGE } from "./config";

/** §5.2 — shown when the browser cannot decode the picked file (e.g. raw HEIC). */
export const UNREADABLE_PHOTO_MESSAGE =
  "Bu fotoğraf açılamadı. Fotoğraflar'dan JPEG olarak paylaşmayı dene.";

/**
 * §5.2 — decode the picked file, honour its EXIF orientation, and shrink it so
 * the long edge is at most 1920px. No cropping happens here: the crop is done
 * per format by `object-fit: cover` in PostCanvas, so one background can serve
 * both the 4:5 post and the 9:16 story.
 */
export async function normalizeBackground(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(UNREADABLE_PHOTO_MESSAGE);
  }

  try {
    // Never upscale a small photo — only shrink oversized ones.
    const scale = Math.min(
      1,
      BACKGROUND_MAX_EDGE / Math.max(bitmap.width, bitmap.height)
    );
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error(UNREADABLE_PHOTO_MESSAGE);
    context.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", BACKGROUND_JPEG_QUALITY)
    );
    if (!blob) throw new Error(UNREADABLE_PHOTO_MESSAGE);
    return blob;
  } finally {
    bitmap.close();
  }
}

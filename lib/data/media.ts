"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

/** Upload a new object. Never replace or delete an object referenced by a saved record. */
export async function uploadMedia(bucket: string, entityId: string, file: File, extension: string) {
  const client = createBrowserSupabaseClient();
  const {
    data: { user }
  } = await client.auth.getUser();
  if (!user) throw new Error("SESSION_EXPIRED");
  const objectPath = `${entityId}/${user.id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage.from(bucket).upload(objectPath, file, {
    cacheControl: "3600",
    upsert: false
  });
  if (error) throw new Error("UPLOAD_FAILED");
  return `${bucket}/${objectPath}`;
}

export async function uploadGalleryObject(objectPath: string, file: File) {
  return createBrowserSupabaseClient()
    .storage.from("business-gallery")
    .upload(objectPath, file, { cacheControl: "3600", upsert: false });
}
export async function removeUnpersistedGalleryObject(path: string) {
  return createBrowserSupabaseClient()
    .storage.from("business-gallery")
    .remove([path.slice("business-gallery/".length)]);
}

import Image from "next/image";

export function GalleryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="gallery-image-frame">
      <Image src={src} alt={alt} width={900} height={675} sizes="(max-width: 700px) 100vw, 50vw" />
    </figure>
  );
}

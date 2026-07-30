import Image from "next/image";

export function BusinessCardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="business-card-image-frame">
      <Image src={src} alt={alt} width={720} height={480} sizes="(max-width: 700px) 100vw, 33vw" />
    </div>
  );
}

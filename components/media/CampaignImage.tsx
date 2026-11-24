type CampaignImageProps = {
  desktop: string;
  mobile?: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function CampaignImage({
  desktop,
  mobile,
  alt,
  priority = false,
  className = ""
}: CampaignImageProps) {
  return (
    <picture className={`campaign-image ${className}`.trim()}>
      {mobile ? <source media="(max-width: 640px)" srcSet={mobile} /> : null}
      <img
        src={desktop}
        alt={alt}
        width={1869}
        height={842}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}

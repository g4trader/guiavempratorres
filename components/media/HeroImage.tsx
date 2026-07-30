import { CampaignImage } from "./CampaignImage";

type HeroImageProps = {
  desktop: string;
  mobile?: string | null;
  alt: string;
  priority?: boolean;
};

export function HeroImage(props: HeroImageProps) {
  return (
    <div className="hero-image-frame">
      <CampaignImage {...props} className="hero-image" />
    </div>
  );
}

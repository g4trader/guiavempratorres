import Image from "next/image";

export type LogoVariant = "default" | "light" | "dark";

type LogoProps = {
  variant?: LogoVariant;
  priority?: boolean;
  className?: string;
};

const LOGO_BY_VARIANT: Record<LogoVariant, string> = {
  default: "/brand/logo_vempratorres.png",
  light: "/brand/logo_vempratorres.png",
  dark: "/brand/logo_vempratorres.png"
};

export function Logo({ variant = "default", priority = false, className }: LogoProps) {
  return (
    <Image
      className={className}
      src={LOGO_BY_VARIANT[variant]}
      width={240}
      height={120}
      sizes="(max-width: 520px) 144px, 168px"
      priority={priority}
      alt="Vem Pra Torres"
    />
  );
}

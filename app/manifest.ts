import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Guia Vem Pra Torres",
    short_name: "Guia VPT",
    description: "Empresas, profissionais, produtos e serviços de Torres e região.",
    start_url: "/",
    display: "standalone",
    background_color: "#eef6fb",
    theme_color: "#2d9d78",
    lang: "pt-BR",
    icons: [
      {
        src: "/brand/favicon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}

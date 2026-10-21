import { notFound } from "next/navigation";
import { ImageUploadDemo } from "@/components/admin/ImageUploadDemo";

export const metadata = {
  title: "Experimente o cadastro de imagens",
  robots: { index: false, follow: false }
};

export default function ImageDemoPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <div className="container image-demo-page">
      <div className="image-demo-notice">
        Modo demonstrativo · arquivos ficam somente neste navegador
      </div>
      <header className="image-demo-heading">
        <span className="eyebrow">Cadastro mais simples</span>
        <h1>
          Uma imagem.
          <br />
          Muito menos trabalho.
        </h1>
        <p>
          Use o arquivo que você já tem. Ajuste o enquadramento aqui e veja como ficará no site,
          antes de salvar.
        </p>
      </header>
      <ImageUploadDemo />
    </div>
  );
}

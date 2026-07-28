import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { BusinessCard } from "@/components/public/BusinessCard";
import {
  getValidHomeHeroCampaigns,
  listActiveCategories,
  listFeaturedBusinesses,
  listRecentBusinesses
} from "@/lib/data/directory";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guia comercial de Torres",
  description:
    "Encontre empresas, serviços, produtos, gastronomia, hospedagem e lazer em Torres, RS.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Guia Vem Pra Torres",
    description: "Descubra empresas e serviços de Torres e região.",
    url: "/"
  }
};

export default async function Home() {
  const [campaigns, categories, featuredBusinesses, recentBusinesses] = await Promise.all([
    getValidHomeHeroCampaigns(),
    listActiveCategories(),
    listFeaturedBusinesses(),
    listRecentBusinesses()
  ]);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Guia Vem Pra Torres",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://guiavempratorres.vercel.app"}/buscar?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c")
        }}
      />
      <div className="hero container">
        <HeroCarousel campaigns={campaigns} />
      </div>
      <section className="search-section container" aria-labelledby="buscar-titulo">
        <h2 id="buscar-titulo">O que você procura em Torres?</h2>
        <form action="/buscar" className="search-form">
          <label className="sr-only" htmlFor="home-search">
            Buscar empresas, categorias ou itens
          </label>
          <input
            id="home-search"
            name="q"
            type="search"
            minLength={2}
            required
            placeholder="Empresa, categoria, produto ou serviço"
          />
          <button className="button" type="submit">
            Buscar
          </button>
        </form>
      </section>
      <section className="section container" id="categorias">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Explore</span>
            <h2>Categorias</h2>
          </div>
        </div>
        {categories.length ? (
          <div className="grid">
            {categories.map((category) => (
              <article className="card" key={category.slug}>
                <Image
                  className="card-image"
                  src={category.imageUrl}
                  alt={category.imageAlt}
                  width={640}
                  height={400}
                />
                <div className="card-body">
                  <h3>{category.name}</h3>
                  {category.description ? <p>{category.description}</p> : null}
                  <Link className="button secondary" href={`/categorias/${category.slug}`}>
                    Ver categoria
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty">Nenhuma categoria publicada.</div>
        )}
      </section>
      <BusinessSection
        title="Empresas em destaque"
        eyebrow="Recomendadas"
        businesses={featuredBusinesses}
      />
      <BusinessSection
        title="Empresas recentes"
        eyebrow="Novidades"
        businesses={recentBusinesses}
      />
    </>
  );
}

function BusinessSection({
  title,
  eyebrow,
  businesses
}: {
  title: string;
  eyebrow: string;
  businesses: Awaited<ReturnType<typeof listFeaturedBusinesses>>;
}) {
  if (!businesses.length) return null;
  return (
    <section className="section container">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="grid">
        {businesses.map((business) => (
          <BusinessCard business={business} key={business.id} />
        ))}
      </div>
    </section>
  );
}

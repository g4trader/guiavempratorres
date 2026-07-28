import Image from "next/image";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import {
  getValidHomeHeroCampaigns,
  listActiveCategories,
  listPublishedBusinessesByCategory
} from "@/lib/data/directory";
import { getDataMode } from "@/lib/env";

export default async function Home() {
  const [campaigns, categories] = await Promise.all([
    getValidHomeHeroCampaigns(),
    listActiveCategories()
  ]);
  const featuredGroups = await Promise.all(
    categories.slice(0, 3).map((category) => listPublishedBusinessesByCategory(category.slug))
  );
  const featuredBusinesses = featuredGroups.flat().slice(0, 3);
  const demoMode = getDataMode() === "demo";

  return (
    <>
      {demoMode ? (
        <div className="demo-notice" role="status">
          Modo demonstrativo: este Preview não está conectado ao Supabase.
        </div>
      ) : null}
      <div className="hero container">
        <HeroCarousel campaigns={campaigns} />
      </div>
      <section className="section container" id="categorias">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Explore</span>
            <h2>Categorias</h2>
          </div>
        </div>
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
                <p>{category.description}</p>
                <a className="button secondary" href={`/categorias/${category.slug}`}>
                  Ver categoria
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      {featuredBusinesses.length > 0 ? (
        <section className="section container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Descubra</span>
              <h2>Empresas para conhecer</h2>
            </div>
          </div>
          <div className="grid">
            {featuredBusinesses.map((business) => (
              <article className="card" key={business.slug}>
                <Image
                  className="card-image"
                  src={business.imageUrl}
                  alt={business.imageAlt}
                  width={640}
                  height={400}
                />
                <div className="card-body">
                  <h3>{business.name}</h3>
                  <p>{business.shortDescription}</p>
                  <a className="button secondary" href={`/empresas/${business.slug}`}>
                    Conhecer
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

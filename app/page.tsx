import Image from "next/image";
import Link from "next/link";
import { businesses, categories } from "@/lib/fixtures";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-card">
          <div className="hero-copy">
            <span className="eyebrow">Torres e região em um só lugar</span>
            <h1>Descubra, escolha e viva o melhor daqui.</h1>
            <p className="muted">Encontre empresas, profissionais, produtos e serviços locais.</p>
            <Link className="button" href="#categorias">
              Ver categorias
            </Link>
          </div>
          <div className="hero-image" role="img" aria-label="Praia com mar azul" />
        </div>
      </section>
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
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Novidades</span>
            <h2>Empresas para conhecer</h2>
          </div>
        </div>
        <div className="grid">
          {businesses.map((business) => (
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
    </>
  );
}

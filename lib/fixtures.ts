import type { Business, Category } from "./domain";

export const categories: Category[] = [
  {
    slug: "gastronomia",
    name: "Gastronomia",
    description: "Sabores para todos os momentos.",
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Mesa de restaurante preparada"
  },
  {
    slug: "hospedagem",
    name: "Hospedagem",
    description: "Onde ficar bem em Torres.",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Quarto de hotel iluminado"
  },
  {
    slug: "servicos",
    name: "Serviços",
    description: "Profissionais perto de você.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Paisagem natural ao pôr do sol"
  },
  {
    slug: "comercio",
    name: "Comércio",
    description: "Comércio local e boas descobertas.",
    imageUrl:
      "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Profissionais reunidos em uma mesa"
  },
  {
    slug: "turismo-e-lazer",
    name: "Turismo e lazer",
    description: "Experiências na cidade e região.",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Interior de uma loja"
  }
];

export const businesses: Business[] = [
  {
    id: "demo-business-1",
    slug: "sabores-da-praia",
    name: "Sabores da Praia",
    shortDescription: "Cozinha litorânea contemporânea com ingredientes locais.",
    description:
      "Empresa fictícia criada exclusivamente para o ambiente de desenvolvimento do Guia Vem Pra Torres.",
    categorySlugs: ["gastronomia"],
    neighborhood: "Centro",
    city: "Torres",
    addressLine: "Endereço fictício",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Salão de restaurante aconchegante",
    latitude: -29.335,
    longitude: -49.727,
    phone: null,
    whatsapp: null,
    email: null,
    websiteUrl: null,
    instagramUrl: null,
    products: [
      {
        name: "Menu do dia",
        type: "service",
        description: "Sequência sazonal preparada pela casa.",
        price: 79
      },
      { name: "Experiência do chef", type: "service", description: "Menu degustação sob reserva." }
    ]
  },
  {
    id: "demo-business-2",
    slug: "pousada-vento-sul",
    name: "Pousada Vento Sul",
    shortDescription: "Hospedagem tranquila para explorar Torres a pé.",
    description: "Empresa fictícia criada exclusivamente para desenvolvimento.",
    categorySlugs: ["hospedagem"],
    neighborhood: "Praia Grande",
    city: "Torres",
    addressLine: "Endereço fictício",
    imageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Área externa de uma pousada",
    latitude: -29.342,
    longitude: -49.724,
    phone: null,
    whatsapp: null,
    email: null,
    websiteUrl: null,
    instagramUrl: null,
    products: [
      {
        name: "Diária casal",
        type: "service",
        description: "Quarto com café da manhã.",
        price: 320
      }
    ]
  },
  {
    id: "demo-business-3",
    slug: "rota-dos-canyons",
    name: "Rota dos Canyons",
    shortDescription: "Passeios guiados fictícios pela região.",
    description: "Empresa fictícia criada exclusivamente para desenvolvimento.",
    categorySlugs: ["turismo-e-lazer"],
    neighborhood: "Centro",
    city: "Torres",
    addressLine: "Endereço fictício",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Trilha entre montanhas",
    latitude: -29.34,
    longitude: -49.73,
    phone: null,
    whatsapp: null,
    email: null,
    websiteUrl: null,
    instagramUrl: null,
    products: [
      {
        name: "Roteiro de um dia",
        type: "service",
        description: "Transporte e acompanhamento.",
        price: 190
      }
    ]
  }
];

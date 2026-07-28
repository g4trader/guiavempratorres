# Modelo de dados

O schema inicial cobre perfis/papéis, categorias, empresas, relações de categoria, contatos, horários, mídia, produtos/serviços, posições, campanhas, criativos e auditoria.

A posição `HOME_HERO` aceita cinco campanhas simultâneas. Um trigger usa lock transacional por posição e rejeita intervalos sobrepostos acima da capacidade. Slugs, estados, coordenadas, períodos, preços e textos alternativos possuem constraints.

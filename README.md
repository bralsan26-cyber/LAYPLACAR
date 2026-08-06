# LAYPLACAR
Aplicação de Lay ao placar ou a zebra. Ou mesmo ao time da casa golear!

Lay Scanner

Ferramenta separada (fora do StatsPro) para apoiar a escolha diária de entradas em lay a placar exato (lay 2x0 zebra / lay goleada) na bolsa de apostas.

Ela busca os jogos do dia em 6 competições (Brasileirão Série A, Premier League, La Liga, Bundesliga, Serie A e Ligue 1 — as cobertas pelo tier grátis do football-data.org) e cruza o histórico de mando/visita de cada time em dois scores:

Anti-zebra: quão raro é o time visitante vencer fora por 2+ gols de diferença nos últimos 15 jogos como visitante.
Anti-goleada: quão raro é qualquer um dos dois times sair de um jogo com diferença de 3+ gols (média entre o mandante em casa e o visitante fora).

Quanto mais perto de 100%, mais "seguro" historicamente para aquele tipo de lay — isso é referência estatística, não garantia. Sempre confira odds e liquidez na bolsa antes de entrar.

Estrutura
lay-scanner/
├── index.html       ← front-end (nenhum build necessário)
├── api/
│   └── football.js  ← serverless function do Vercel (proxy pra football-data.org)
└── README.md
Passo a passo pra colocar no ar
Pegue um token grátis: crie conta em https://www.football-data.org/client/register (tier grátis: 10 requisições/minuto, cobre as 6 ligas listadas acima).
Suba os arquivos: crie um repositório novo no GitHub com essa mesma estrutura de pastas (o index.html na raiz, o football.js dentro de api/) e conecte ao Vercel — do mesmo jeito que você já faz com seus outros projetos.
Configure o token no Vercel: no dashboard do projeto, vá em Settings → Environment Variables e adicione:
Nome: FOOTBALL_DATA_TOKEN
Valor: o token que você pegou no passo 1
Depois disso, faça um redeploy pra variável entrar em vigor.
Pronto: acesse a URL do deploy, escolha a data e clique em "Buscar jogos do dia". A busca dos históricos é escalonada automaticamente (~1 chamada a cada 6s) pra respeitar o limite do tier grátis — com muitos jogos no dia, pode levar 1-3 minutos. Os resultados por time ficam em cache local (6h) pra não repetir chamadas à toa.
Limitações conhecidas / próximos passos possíveis
Série B do Brasileirão não está no tier grátis do football-data.org — se quiser incluir, precisaria de scraping (mesma lógica que você já usa nas ligas do StatsPro) ou upgrade de plano.
Os scores hoje não olham H2H direto entre os dois times nem contexto (lesões, motivação, mando de campo em jogo decisivo) — dá pra somar isso depois se fizer diferença na prática.
Não considera odds/liquidez da bolsa — é só a camada de "qual jogo pesquisar", a decisão final de entrar (e o preço) continua sendo sua.

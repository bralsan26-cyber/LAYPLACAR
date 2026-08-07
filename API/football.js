// /api/football.js — proxy para a API football-data.org
// Mantém o token no servidor (variável de ambiente FOOTBALL_DATA_TOKEN),
// evitando expô-lo no navegador e resolvendo o problema de CORS.

const BASE = 'https://api.football-data.org/v4';

export default async function handler(req, res) {
  const TOKEN = process.env.FOOTBALL_DATA_TOKEN;
  if (!TOKEN) {
    return res.status(500).json({
      error: 'FOOTBALL_DATA_TOKEN não configurado nas variáveis de ambiente do Vercel.',
    });
  }

  const { type, date, comp, teamId, venue, limit } = req.query;

  let url;
  try {
    if (type === 'fixtures') {
      if (!date) return res.status(400).json({ error: 'Parâmetro "date" é obrigatório (YYYY-MM-DD).' });
      const competitions = comp || 'BSA,PL,PD,BL1,SA,FL1';
      url = `${BASE}/matches?dateFrom=${date}&dateTo=${date}&competitions=${competitions}`;
    } else if (type === 'team') {
      if (!teamId) return res.status(400).json({ error: 'Parâmetro "teamId" é obrigatório.' });
      const params = new URLSearchParams({
        status: 'FINISHED',
        limit: limit || '15',
      });
      if (venue) params.set('venue', venue.toUpperCase()); // HOME ou AWAY
      url = `${BASE}/teams/${teamId}/matches?${params.toString()}`;
    } else {
      return res.status(400).json({ error: 'Parâmetro "type" inválido. Use "fixtures" ou "team".' });
    }

    const upstream = await fetch(url, { headers: { 'X-Auth-Token': TOKEN } });
    const data = await upstream.json();

    if (!upstream.ok) {
      // Repassa erros da football-data.org (ex: rate limit 429, token inválido 403)
      return res.status(upstream.status).json({
        error: data.message || 'Erro na football-data.org',
        details: data,
      });
    }

    // Cache curto no edge do Vercel — ajuda a não estourar o limite de 10 req/min
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

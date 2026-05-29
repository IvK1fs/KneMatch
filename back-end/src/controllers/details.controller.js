// controllers/details.controller.js
const { fetchFromTMDB } = require('./base.controller');

// GET /details/:id - Detalhes principais
const getDetails = async (req, res) => {
  const { id } = req.params;
  const { type = 'movie' } = req.query;

  const endpoint = type === 'movie' ? `/movie/${id}` : `/tv/${id}`;
  const data = await fetchFromTMDB(endpoint, res);
  if (data) res.json(data);
};

// GET /details/:id/cast - Elenco
const getCast = async (req, res) => {
  const { id } = req.params;
  const { type = 'movie' } = req.query;

  const endpoint = type === 'movie' ? `/movie/${id}/credits` : `/tv/${id}/credits`;
  const data = await fetchFromTMDB(endpoint, res);
  if (data) res.json(data);
};

// GET /details/:id/videos - Trailers
const getVideos = async (req, res) => {
  const { id } = req.params;
  const { type = 'movie' } = req.query;

  const endpoint = type === 'movie' ? `/movie/${id}/videos` : `/tv/${id}/videos`;
  const data = await fetchFromTMDB(endpoint, res);
  if (data) res.json(data);
};

// GET /details/:id/providers - Onde assistir
// TMDb retorna: { results: { BR: { flatrate: [], rent: [], buy: [] } } }
// Aqui extraímos só o BR e unificamos os tipos em um array único
const getProviders = async (req, res) => {
  const { id } = req.params;
  const { type = 'movie' } = req.query;

  const endpoint = type === 'movie'
    ? `/movie/${id}/watch/providers`
    : `/tv/${id}/watch/providers`;

  const data = await fetchFromTMDB(endpoint, res);
  if (!data) return;

  const br = data.results?.BR ?? {};

  // Junta flatrate + ads + free (evita duplicatas pelo provider_id)
  const seen = new Set();
  const providers = [
    ...(br.flatrate ?? []),
    ...(br.ads ?? []),
    ...(br.free ?? []),
  ].filter((p) => {
    if (seen.has(p.provider_id)) return false;
    seen.add(p.provider_id);
    return true;
  });

  res.json({ results: providers });
};

// GET /details/:id/similar - Conteúdos similares
const getSimilar = async (req, res) => {
  const { id } = req.params;
  const { type = 'movie' } = req.query;

  const endpoint = type === 'movie'
    ? `/movie/${id}/similar`
    : `/tv/${id}/similar`;

  const data = await fetchFromTMDB(endpoint, res);
  if (data) res.json(data);
};

module.exports = {
  getDetails,
  getCast,
  getVideos,
  getProviders,
  getSimilar,
};
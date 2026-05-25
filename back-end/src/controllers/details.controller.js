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
const getProviders = async (req, res) => {
  const { id } = req.params;
  const { type = 'movie' } = req.query;

  const endpoint = type === 'movie' ? `/movie/${id}/watch/providers` : `/tv/${id}/watch/providers`;

  const data = await fetchFromTMDB(endpoint, res);
  if (data) res.json(data);
};

// GET /details/:id/similar - Conteúdos similares
const getSimilar = async (req, res) => {
  const { id } = req.params;
  const { type = 'movie' } = req.query;

  const endpoint = type === 'movie' ? `/movie/${id}/similar` : `/tv/${id}/similar`;

  const data = await fetchFromTMDB(endpoint, res);
  if (data) res.json(data);
};

module.exports = {
  getDetails,
  getCast,
  getVideos,
  getProviders,
  getSimilar
};
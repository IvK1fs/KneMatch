// controllers/top.controller.js
const { fetchFromTMDB } = require('./base.controller');

// GET /api/top?type=movie|tv&genre=ID
const getTop = async (req, res) => {
  const { type = 'movie', genre } = req.query;

  const mediaType = type === 'tv' ? 'tv' : 'movie';
  let url = `/discover/${mediaType}?sort_by=popularity.desc&vote_count.gte=500&page=1`;
  if (genre) url += `&with_genres=${genre}`;

  const data = await fetchFromTMDB(url, res);
  if (data && data.results) {
    res.json({ results: data.results.slice(0, 10) });
  } else {
    res.json({ results: [] });
  }
};

module.exports = { getTop };
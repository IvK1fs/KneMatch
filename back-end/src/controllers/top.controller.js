// controllers/top.controller.js
const { fetchFromTMDB } = require('./base.controller');

// GET /api/top/movie - Top 10 filmes
const getTopMovies = async (req, res) => {
  const { genre } = req.query;

  let url = '/discover/movie?sort_by=popularity.desc&vote_count.gte=500&page=1';
  if (genre) url += `&with_genres=${genre}`;

  const data = await fetchFromTMDB(url, res);
  if (data && data.results) {
    const top10 = data.results.slice(0, 10);
    res.json({
      results: top10
    });
  } else {
    res.json({ results: [] });
  }
};

// GET /api/top/tv - Top 10 séries
const getTopTv = async (req, res) => {
  const { genre } = req.query;

  let url = '/discover/tv?sort_by=popularity.desc&vote_count.gte=500&page=1';
  if (genre) url += `&with_genres=${genre}`;

  const data = await fetchFromTMDB(url, res);
  if (data && data.results) {
    const top10 = data.results.slice(0, 10);
    res.json({
      results: top10
    });
  } else {
    res.json({ results: [] });
  }
};

module.exports = { getTopMovies, getTopTv };
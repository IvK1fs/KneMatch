// back-end/src/controllers/search.controller.js
const { fetchFromTMDB } = require('./base.controller');

const search = async (req, res) => {
  const { q, type } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Parâmetro "q" é obrigatório' });
  }

  const searchType = type === 'tv' ? 'tv' : 'movie';
  const url = `/search/${searchType}?query=${encodeURIComponent(q)}`;

  const data = await fetchFromTMDB(url, res);
  if (data) res.json(data);
};

const searchByGenre = async (req, res) => {
  const { genre, type = 'movie', sort = 'popularity.desc', page = 1, year, rating } = req.query;

  const endpoint = type === 'movie' ? '/discover/movie' : '/discover/tv';

  let url = `${endpoint}?sort_by=${sort}&page=${page}&vote_count.gte=100`;

  if (genre) url += `&with_genres=${genre}`;
  if (year) {
    if (type === 'movie') {
      url += `&primary_release_year=${year}`;
    } else {
      url += `&first_air_date_year=${year}`;
    }
  }
  if (rating) url += `&vote_average.gte=${rating}`;

  const data = await fetchFromTMDB(url, res);
  if (data) res.json(data);
};

module.exports = { search, searchByGenre };
const { fetchFromTMDB } = require('./base.controller');

const discover = async (req, res) => {
  const { q, type, genre, sort_by, year, page } = req.query;
  const minRating = req.query['vote_average.gte'];
  const mediaType = type === 'tv' ? 'tv' : 'movie';

  let url;
  if (q && q.trim()) {
    const params = new URLSearchParams({ query: q, page: page || '1' });
    url = `/search/${mediaType}?${params.toString()}`;
  } else {
    const params = new URLSearchParams({
      sort_by: sort_by || 'popularity.desc',
      page: page || '1',
    });
    if (genre) params.append('with_genres', genre);
    if (year) params.append('primary_release_year', year);
    if (minRating && parseFloat(minRating) > 0) params.append('vote_average.gte', minRating);
    url = `/discover/${mediaType}?${params.toString()}`;
  }

  const data = await fetchFromTMDB(url, res);
  if (data) res.json(data);
};

module.exports = { discover };

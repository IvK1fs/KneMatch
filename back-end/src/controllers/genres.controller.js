const { fetchFromTMDB } = require('./base.controller');

const getGenres = async (req, res) => {
  const type = req.query.type === 'tv' ? 'tv' : 'movie';
  const data = await fetchFromTMDB(`/genre/${type}/list`, res);
  if (data) res.json(data);
};

module.exports = { getGenres };

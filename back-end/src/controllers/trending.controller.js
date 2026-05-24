const { fetchFromTMDB } = require('./base.controller');

const getTrending = async (req, res) => {
  const type = req.query.type === 'movie' ? 'movie' : req.query.type === 'tv' ? 'tv' : 'all';
  const page = req.query.page || '1';
  const url = `/trending/${type}/week?page=${page}`;
  const data = await fetchFromTMDB(url, res);
  if (data) res.json(data);
};

module.exports = { getTrending };
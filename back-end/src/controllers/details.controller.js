const { fetchFromTMDB } = require('./base.controller');

exports.search = async (req, res) => {
  const { q, type } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const searchType = type === 'tv' ? 'tv' : 'movie';
  const url = `/search/${searchType}?query=${encodeURIComponent(q)}`;

  const data = await fetchFromTMDB(url, res);
  if (data) res.json(data);
};
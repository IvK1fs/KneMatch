const { fetchFromTMDB } = require('./base.controller');

const search = async (req, res) => {
  const { q, type } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Parâmetro "q" é obrigatório' });
  }

  let url;
  if (type === 'movie' || type === 'tv') {
    url = `/search/${type}?query=${encodeURIComponent(q)}`;
  } else {
    url = `/search/multi?query=${encodeURIComponent(q)}`;
  }

  const data = await fetchFromTMDB(url, res);
  if (!data) return;

  if (!type || type === '') {
    data.results = (data.results ?? []).filter(
      (item) => item.media_type === 'movie' || item.media_type === 'tv'
    );
  }

  res.json(data);
};

module.exports = { search };

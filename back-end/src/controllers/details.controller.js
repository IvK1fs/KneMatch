const { fetchFromTMDB } = require('./base.controller');

const getDetails = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  if (!id || !type) {
    return res.status(400).json({ error: 'id e type são obrigatórios' });
  }

  const mediaType = type === 'tv' ? 'tv' : 'movie';
  const url = `/${mediaType}/${id}`;

  const data = await fetchFromTMDB(url, res);
  if (data) res.json(data);
};

module.exports = { getDetails };
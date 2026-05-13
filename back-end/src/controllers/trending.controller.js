const { fetchFromTMDB } = require('./base.controller');

const getTrending = async (req, res) => {
  const url = '/trending/all/week';
  const data = await fetchFromTMDB(url, res);
  if (data) res.json(data);
};

module.exports = { getTrending };
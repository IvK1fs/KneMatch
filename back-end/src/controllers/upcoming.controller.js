const { fetchFromTMDB } = require('./base.controller');

const getUpcoming = async (req, res) => {
  const url = '/movie/upcoming';
  const data = await fetchFromTMDB(url, res);
  if (data) res.json(data);
};

module.exports = { getUpcoming };
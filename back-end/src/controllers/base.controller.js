const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.TMDB_KEY;

const fetchFromTMDB = async (url, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${url}`, {
      params: {
        api_key: TMDB_KEY,
        language: 'pt-BR'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro TMDB:', error.message);
    if (res && !res.headersSent) {
      res.status(502).json({ error: 'Falha ao buscar dados' });
    }
    return null;
  }
};

module.exports = { fetchFromTMDB };
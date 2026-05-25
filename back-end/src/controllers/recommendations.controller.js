// controllers/recommendations.controller.js
const { fetchFromTMDB } = require('./base.controller');

// GET /api/search/genre - Busca com filtros combinados
const searchByGenre = async (req, res) => {
    const {
        genre,
        type = 'movie',
        sort = 'popularity.desc',
        page = 1,
        year,
        rating
    } = req.query;

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

// GET /api/genres - Lista de gêneros
const getGenres = async (req, res) => {
    const { type = 'movie' } = req.query;

    const endpoint = type === 'movie' ? '/genre/movie/list' : '/genre/tv/list';

    const data = await fetchFromTMDB(endpoint, res);
    if (data) res.json(data);
};

// GET /api/top - Top 10 por gênero
const getTop10 = async (req, res) => {
    const { genre, type = 'movie' } = req.query;

    const endpoint = type === 'movie' ? '/discover/movie' : '/discover/tv';

    let url = `${endpoint}?sort_by=popularity.desc&vote_count.gte=500&page=1`;

    if (genre) url += `&with_genres=${genre}`;

    const data = await fetchFromTMDB(url, res);
    if (data && data.results) {
        const top10 = data.results.slice(0, 10);
        res.json({ ...data, results: top10 });
    } else {
        res.json(data);
    }
};

// GET /api/details/:id/cast - Elenco
const getCast = async (req, res) => {
    const { id } = req.params;
    const { type = 'movie' } = req.query;

    const endpoint = type === 'movie' ? `/movie/${id}/credits` : `/tv/${id}/credits`;

    const data = await fetchFromTMDB(endpoint, res);
    if (data) res.json(data);
};

// GET /api/details/:id/videos - Trailers
const getVideos = async (req, res) => {
    const { id } = req.params;
    const { type = 'movie' } = req.query;

    const endpoint = type === 'movie' ? `/movie/${id}/videos` : `/tv/${id}/videos`;

    const data = await fetchFromTMDB(endpoint, res);
    if (data) res.json(data);
};

// GET /api/details/:id/providers - Onde assistir
const getProviders = async (req, res) => {
    const { id } = req.params;
    const { type = 'movie' } = req.query;

    const endpoint = type === 'movie' ? `/movie/${id}/watch/providers` : `/tv/${id}/watch/providers`;

    const data = await fetchFromTMDB(endpoint, res);
    if (data) res.json(data);
};

// GET /api/details/:id/similar - Conteúdos similares
const getSimilar = async (req, res) => {
    const { id } = req.params;
    const { type = 'movie' } = req.query;

    const endpoint = type === 'movie' ? `/movie/${id}/similar` : `/tv/${id}/similar`;

    const data = await fetchFromTMDB(endpoint, res);
    if (data) res.json(data);
};

module.exports = {
    searchByGenre,
    getGenres,
    getTop10,
    getCast,
    getVideos,
    getProviders,
    getSimilar
};
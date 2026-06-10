// back-end/src/controllers/search.controller.js
const { fetchFromTMDB } = require('./base.controller');

// GET /api/search - Busca normal (parâmetros já sanitizados pelo middleware)
const search = async (req, res) => {
    try {
        // Os parâmetros já vêm sanitizados pelo express-validator
        const { q, type = 'movie' } = req.query;
        
        const searchType = type === 'tv' ? 'tv' : 'movie';
        const url = `/search/${searchType}?query=${encodeURIComponent(q)}`;
        
        const data = await fetchFromTMDB(url, res);
        if (data) res.json(data);
    } catch (error) {
        console.error('Erro no search:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// GET /api/search/genre - Busca por gênero (parâmetros já sanitizados)
const searchByGenre = async (req, res) => {
    try {
        // Parâmetros já vêm sanitizados e convertidos pelo middleware
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
    } catch (error) {
        console.error('Erro no searchByGenre:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

module.exports = { search, searchByGenre };
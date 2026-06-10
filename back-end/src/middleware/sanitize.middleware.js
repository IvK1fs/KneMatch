// back-end/src/middleware/sanitize.middleware.js

// Filtra apenas os parâmetros permitidos
const filterParams = (allowedParams) => {
    return (req, res, next) => {
        // Filtra query params
        if (req.query) {
            const filteredQuery = {};
            for (const key of allowedParams) {
                if (req.query[key] !== undefined) {
                    filteredQuery[key] = req.query[key];
                }
            }
            req.query = filteredQuery;
        }

        // Filtra body params
        if (req.body && allowedParams.includes('body')) {
            // Mantém o body como está, mas podemos filtrar se necessário
            const allowedBodyParams = allowedParams.filter(p => p !== 'body');
            if (allowedBodyParams.length > 0) {
                const filteredBody = {};
                for (const key of allowedBodyParams) {
                    if (req.body[key] !== undefined) {
                        filteredBody[key] = req.body[key];
                    }
                }
                req.body = filteredBody;
            }
        }

        next();
    };
};

// Parâmetros permitidos para cada rota
const allowedParams = {
    trending: ['type', 'time', 'page'],
    upcoming: ['page'],
    search: ['q', 'type'],
    details: ['type'],
    genres: ['type'],
    discover: ['type', 'page'],
    searchGenre: ['genre', 'type', 'sort', 'page', 'year', 'rating'],
    top: ['genre', 'type'],
    favorites: ['tmdb_id', 'tipo', 'titulo', 'poster_url', 'nota'],
    lists: ['nome', 'descricao']
};

module.exports = { filterParams, allowedParams };
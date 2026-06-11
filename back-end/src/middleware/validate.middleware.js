// back-end/src/middleware/validate.middleware.js
const { query, param, body, validationResult } = require('express-validator');

// Middleware para verificar erros de validação
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Parâmetros inválidos',
            detalhes: errors.array().map(e => ({
                campo: e.path,
                mensagem: e.msg
            }))
        });
    }
    next();
};

// ==================== VALIDAÇÕES ====================

// Validação para trending
const validateTrending = [
    query('type')
        .optional()
        .isIn(['all', 'movie', 'tv']).withMessage('type deve ser "all", "movie" ou "tv"')
        .trim(),
    query('time')
        .optional()
        .isIn(['day', 'week']).withMessage('time deve ser "day" ou "week"')
        .trim(),
    query('page')
        .optional()
        .isInt({ min: 1, max: 500 }).withMessage('page deve ser entre 1 e 500')
        .toInt(),
    handleValidationErrors
];

// Validação para upcoming
const validateUpcoming = [
    query('page')
        .optional()
        .isInt({ min: 1, max: 500 }).withMessage('page deve ser entre 1 e 500')
        .toInt(),
    handleValidationErrors
];

// Validação para search
const validateSearch = [
    query('q')
        .notEmpty().withMessage('q é obrigatório')
        .isString().withMessage('q deve ser texto')
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('q deve ter entre 1 e 100 caracteres')
        .escape(),
    query('type')
        .optional()
        .isIn(['movie', 'tv']).withMessage('type deve ser "movie" ou "tv"')
        .trim(),
    handleValidationErrors
];

// Validação para details
const validateDetails = [
    param('id')
        .notEmpty().withMessage('id é obrigatório')
        .isInt({ min: 1 }).withMessage('id deve ser um número positivo')
        .toInt(),
    query('type')
        .optional()
        .isIn(['movie', 'tv']).withMessage('type deve ser "movie" ou "tv"')
        .trim(),
    handleValidationErrors
];

// Validação para genres
const validateGenres = [
    query('type')
        .optional()
        .isIn(['movie', 'tv']).withMessage('type deve ser "movie" ou "tv"')
        .trim(),
    handleValidationErrors
];

// Validação para discover
const validateDiscover = [
    query('type')
        .optional()
        .isIn(['movie', 'tv']).withMessage('type deve ser "movie" ou "tv"')
        .trim(),
    query('page')
        .optional()
        .isInt({ min: 1, max: 500 }).withMessage('page deve ser entre 1 e 500')
        .toInt(),
    handleValidationErrors
];

// Validação para search/genre
const validateSearchGenre = [
    query('genre')
        .optional()
        .isInt({ min: 1, max: 10000 }).withMessage('genre deve ser um número de ID válido')
        .toInt(),
    query('type')
        .optional()
        .isIn(['movie', 'tv']).withMessage('type deve ser "movie" ou "tv"')
        .trim(),
    query('sort')
        .optional()
        .isIn(['popularity.desc', 'popularity.asc', 'vote_average.desc', 'vote_average.asc', 'release_date.desc'])
        .withMessage('sort inválido')
        .trim(),
    query('page')
        .optional()
        .isInt({ min: 1, max: 500 }).withMessage('page deve ser entre 1 e 500')
        .toInt(),
    query('year')
        .optional()
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('year inválido')
        .toInt(),
    query('rating')
        .optional()
        .isFloat({ min: 0, max: 10 }).withMessage('rating deve ser entre 0 e 10')
        .toFloat(),
    handleValidationErrors
];

// Validação para top 10
const validateTop = [
    query('genre')
        .optional()
        .isInt({ min: 1, max: 10000 }).withMessage('genre deve ser um número de ID válido')
        .toInt(),
    query('type')
        .optional()
        .isIn(['movie', 'tv']).withMessage('type deve ser "movie" ou "tv"')
        .trim(),
    handleValidationErrors
];

// Validação para cast, videos, providers, similar
const validateMediaDetails = [
    param('id')
        .notEmpty().withMessage('id é obrigatório')
        .isInt({ min: 1 }).withMessage('id deve ser um número positivo')
        .toInt(),
    query('type')
        .optional()
        .isIn(['movie', 'tv']).withMessage('type deve ser "movie" ou "tv"')
        .trim(),
    handleValidationErrors
];

// Validação para favoritos (POST)
const validateAddFavorite = [
    body('tmdb_id')
        .notEmpty().withMessage('tmdb_id é obrigatório')
        .isString().withMessage('tmdb_id deve ser texto')
        .trim()
        .isLength({ min: 1, max: 50 }).withMessage('tmdb_id inválido')
        .escape(),
    body('tipo')
        .notEmpty().withMessage('tipo é obrigatório')
        .isIn(['filme', 'serie']).withMessage('tipo deve ser "filme" ou "serie"')
        .trim(),
    body('titulo')
        .notEmpty().withMessage('titulo é obrigatório')
        .isString().withMessage('titulo deve ser texto')
        .trim()
        .isLength({ min: 1, max: 255 }).withMessage('titulo muito longo')
        .escape(),
    body('poster_url')
        .optional()
        .isURL().withMessage('poster_url deve ser uma URL válida')
        .trim()
        .isLength({ max: 500 }).withMessage('poster_url muito longo'),
    body('nota')
        .optional()
        .isFloat({ min: 0, max: 10 }).withMessage('nota deve ser entre 0 e 10')
        .toFloat(),
    handleValidationErrors
];

// Validação para criar lista
const validateCreateList = [
    body('nome')
        .notEmpty().withMessage('nome da lista é obrigatório')
        .isString().withMessage('nome deve ser texto')
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('nome deve ter entre 1 e 100 caracteres')
        .escape(),
    body('descricao')
        .optional()
        .isString().withMessage('descricao deve ser texto')
        .trim()
        .isLength({ max: 500 }).withMessage('descricao muito longa')
        .escape(),
    handleValidationErrors
];

// Validação para adicionar item à lista
const validateAddToList = [
    param('listId')
        .notEmpty().withMessage('listId é obrigatório')
        .isInt({ min: 1 }).withMessage('listId deve ser um número positivo')
        .toInt(),
    body('tmdb_id')
        .notEmpty().withMessage('tmdb_id é obrigatório')
        .isString().withMessage('tmdb_id deve ser texto')
        .trim()
        .isLength({ min: 1, max: 50 }).withMessage('tmdb_id inválido')
        .escape(),
    body('tipo')
        .notEmpty().withMessage('tipo é obrigatório')
        .isIn(['filme', 'serie']).withMessage('tipo deve ser "filme" ou "serie"')
        .trim(),
    body('titulo')
        .notEmpty().withMessage('titulo é obrigatório')
        .isString().withMessage('titulo deve ser texto')
        .trim()
        .isLength({ min: 1, max: 255 }).withMessage('titulo muito longo')
        .escape(),
    body('poster_url')
        .optional()
        .isURL().withMessage('poster_url deve ser uma URL válida')
        .trim()
        .isLength({ max: 500 }).withMessage('poster_url muito longo'),
    body('nota')
        .optional()
        .isFloat({ min: 0, max: 10 }).withMessage('nota deve ser entre 0 e 10')
        .toFloat(),
    handleValidationErrors
];

module.exports = {
    validateTrending,
    validateUpcoming,
    validateSearch,
    validateDetails,
    validateGenres,
    validateDiscover,
    validateSearchGenre,
    validateTop,
    validateMediaDetails,
    validateAddFavorite,
    validateCreateList,
    validateAddToList
};
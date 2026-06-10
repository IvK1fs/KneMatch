// back-end/src/middleware/logger.middleware.js
const morgan = require('morgan');

// Morgan para log de requisições (formato JSON)
const requestLogger = morgan((tokens, req, res) => {
    const log = {
        nivel: 'INFO',
        timestamp: new Date().toISOString(),
        evento: 'REQUEST',
        method: tokens.method(req, res),
        rota: tokens.url(req, res),
        status: parseInt(tokens.status(req, res)),
        duracao_ms: parseInt(tokens['response-time'](req, res)),
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.get('User-Agent')
    };

    // Não loga health check para não poluir
    if (log.rota === '/health' || log.rota === '/') {
        return null;
    }

    return JSON.stringify(log);
}, {
    stream: {
        write: (message) => {
            if (message && message.trim()) {
                console.log(message.trim());
            }
        }
    }
});

// Middleware para log de erros
const errorLogger = (err, req, res, next) => {
    const log = {
        nivel: 'ERRO',
        timestamp: new Date().toISOString(),
        evento: 'ERROR',
        rota: req.method + ' ' + req.originalUrl,
        status: err.status || 500,
        mensagem: err.message || 'Erro interno do servidor',
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.get('User-Agent'),
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    };

    console.error(JSON.stringify(log));
    next(err);
};

// Middleware para rotas não encontradas
const notFoundHandler = (req, res) => {
    const log = {
        nivel: 'AVISO',
        timestamp: new Date().toISOString(),
        evento: 'NOT_FOUND',
        method: req.method,
        rota: req.originalUrl,
        ip: req.ip || req.socket.remoteAddress
    };

    console.warn(JSON.stringify(log));

    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.originalUrl
    });
};

module.exports = {
    requestLogger,
    errorLogger,
    notFoundHandler
};
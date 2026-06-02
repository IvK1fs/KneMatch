// back-end/src/middleware/error.middleware.js

// Middleware global de erro
const errorLogger = (err, req, res, next) => {
    const timestamp = new Date().toISOString();

    // Log estruturado do erro
    console.error(JSON.stringify({
        nivel: 'ERRO',
        timestamp: timestamp,
        rota: req.method + ' ' + req.originalUrl,
        status: err.status || 500,
        mensagem: err.message || 'Erro interno do servidor',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        usuarioId: req.usuarioId || 'não autenticado'
    }));

    // Envia resposta para o cliente
    res.status(err.status || 500).json({
        error: err.message || 'Erro interno do servidor',
        timestamp: timestamp
    });
};

// Middleware para rotas não encontradas (404)
const notFoundHandler = (req, res) => {
    const timestamp = new Date().toISOString();

    console.error(JSON.stringify({
        nivel: 'AVISO',
        timestamp: timestamp,
        rota: req.method + ' ' + req.originalUrl,
        status: 404,
        mensagem: 'Rota não encontrada',
        ip: req.ip
    }));

    res.status(404).json({
        error: 'Rota não encontrada',
        timestamp: timestamp
    });
};

// Wrapper para capturar erros assíncronos em controllers
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorLogger, notFoundHandler, asyncHandler };
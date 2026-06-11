// back-end/src/middleware/logger.middleware.js
const morgan = require('morgan');

// Cores para o terminal
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
};

// Função para colorir status code
const getStatusColor = (status) => {
    if (status >= 500) return colors.red;
    if (status >= 400) return colors.yellow;
    if (status >= 300) return colors.cyan;
    if (status >= 200) return colors.green;
    return colors.white;
};

// Morgan formatado para humanos (mais legível)
const requestLogger = morgan((tokens, req, res) => {
    const status = parseInt(tokens.status(req, res));
    const statusColor = getStatusColor(status);
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const duration = parseInt(tokens['response-time'](req, res));
    const userAgent = req.get('User-Agent') || 'unknown';
    
    // Limita URL para não poluir
    let shortUrl = url.length > 80 ? url.substring(0, 77) + '...' : url;
    
    // Formato legível
    return [
        `${colors.dim}[${new Date().toLocaleTimeString('pt-BR')}]${colors.reset}`,
        `${colors.bright}${method}${colors.reset}`,
        `${shortUrl}`,
        `${statusColor}${status}${colors.reset}`,
        `${colors.dim}${duration}ms${colors.reset}`,
        `${colors.dim}(${userAgent.split('/')[0]})${colors.reset}`
    ].join(' ');
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
    const timestamp = new Date().toLocaleString('pt-BR');
    
    console.log(`\n${colors.red}${colors.bright}╔════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.red}${colors.bright}║           ERRO NA REQUISICAO           ║${colors.reset}`);
    console.log(`${colors.red}${colors.bright}╚════════════════════════════════════════╝${colors.reset}`);
    console.log(`${colors.yellow}Data:${colors.reset} ${timestamp}`);
    console.log(`${colors.yellow}Rota:${colors.reset} ${req.method} ${req.originalUrl}`);
    console.log(`${colors.yellow}Status:${colors.reset} ${err.status || 500}`);
    console.log(`${colors.yellow}Mensagem:${colors.reset} ${err.message || 'Erro interno'}`);
    console.log(`${colors.yellow}IP:${colors.reset} ${req.ip || req.socket.remoteAddress}`);
    console.log(`${colors.yellow}User-Agent:${colors.reset} ${req.get('User-Agent') || 'unknown'}`);
    
    if (process.env.NODE_ENV === 'development' && err.stack) {
        console.log(`${colors.yellow}Stack:${colors.reset}\n${colors.dim}${err.stack}${colors.reset}`);
    }
    console.log('');
    
    next(err);
};

// Middleware para rotas não encontradas
const notFoundHandler = (req, res) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    
    console.log(`\n${colors.yellow}${colors.bright}╔════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.yellow}${colors.bright}║           ROTA NAO ENCONTRADA          ║${colors.reset}`);
    console.log(`${colors.yellow}${colors.bright}╚════════════════════════════════════════╝${colors.reset}`);
    console.log(`${colors.yellow}Data:${colors.reset} ${timestamp}`);
    console.log(`${colors.yellow}Rota:${colors.reset} ${req.method} ${req.originalUrl}`);
    console.log(`${colors.yellow}IP:${colors.reset} ${req.ip || req.socket.remoteAddress}`);
    console.log('');
    
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
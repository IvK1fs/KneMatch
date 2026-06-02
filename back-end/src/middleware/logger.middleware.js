
const morgan = require('morgan');

// Morgan para log de requisições
const requestLogger = morgan('combined', {
    stream: {
        write: (message) => {
            console.log(`📝 [REQUEST] ${message.trim()}`);
        }
    }
});

// Morgan para desenvolvimento (mais simples)
const devRequestLogger = morgan('dev');

module.exports = { requestLogger, devRequestLogger };
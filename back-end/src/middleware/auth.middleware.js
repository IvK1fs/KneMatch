// back-end/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const authMiddleware = async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = header.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const sessao = await pool.query(
            'SELECT usuario_id FROM sessao WHERE token = $1 AND expira_em > NOW()',
            [token]
        );

        if (sessao.rows.length === 0) {
            return res.status(401).json({ error: 'Sessão expirada ou inválida' });
        }

        req.usuarioId = decoded.id;
        req.token = token;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        return res.status(401).json({ error: 'Token inválido' });
    }
};

module.exports = { authMiddleware };

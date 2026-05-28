// back-end/src/db.js
const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // OBRIGATÓRIO para o Render - aceita certificado SSL auto-assinado
    ssl: {
        rejectUnauthorized: false  // Necessário para conexão com PostgreSQL no Render
    }
});

// Opcional: Log de conexão
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Erro ao conectar ao PostgreSQL:', err.message);
    } else {
        console.log('✅ Conectado ao PostgreSQL no Render com sucesso!');
        release();
    }
});

module.exports = { pool };
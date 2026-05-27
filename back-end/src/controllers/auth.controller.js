// back-end/src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

// ==================== SIGNUP ====================
const signupUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    if (senha.length < 6) {
        return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    try {
        // Verificar se email já existe
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(senha, salt);

        // Criar usuário
        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email`,
            [nome, email.toLowerCase(), passwordHash]
        );

        const user = result.rows[0];

        // Gerar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            usuario: {
                id: user.id,
                nome: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Erro no signup:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// ==================== LOGIN ====================
const loginUser = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        const result = await pool.query(
            'SELECT id, name, email, password_hash FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(senha, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            token,
            usuario: {
                id: user.id,
                nome: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// ==================== LOGOUT ====================
const logoutUser = async (req, res) => {
    // Como usamos JWT stateless, o logout é feito no cliente
    // O cliente simplesmente descarta o token
    res.status(200).json({ message: 'Logout realizado com sucesso' });
};

module.exports = { signupUser, loginUser, logoutUser };
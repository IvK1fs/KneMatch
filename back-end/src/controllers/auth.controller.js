// back-end/src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const signupUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    if (senha.length < 6) {
        return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    try {
        const existingUser = await pool.query(
            'SELECT id FROM usuario WHERE email = $1',
            [email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const result = await pool.query(
            `INSERT INTO usuario (nome, email, senha_hash, criado_em) 
             VALUES ($1, $2, $3, NOW()) 
             RETURNING id, nome, email, criado_em`,
            [nome, email.toLowerCase(), senhaHash]
        );

        const usuario = result.rows[0];

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        await pool.query(
            `INSERT INTO sessao (usuario_id, token, expira_em, criado_em)
             VALUES ($1, $2, NOW() + INTERVAL '7 days', NOW())`,
            [usuario.id, token]
        );

        res.status(201).json({
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

const loginUser = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        const result = await pool.query(
            'SELECT id, nome, email, senha_hash FROM usuario WHERE email = $1',
            [email.toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const usuario = result.rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaValida) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        await pool.query(
            `INSERT INTO sessao (usuario_id, token, expira_em, criado_em)
             VALUES ($1, $2, NOW() + INTERVAL '7 days', NOW())`,
            [usuario.id, token]
        );

        res.status(200).json({
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

const logoutUser = async (req, res) => {
    const usuarioId = req.usuarioId;
    const token = req.token;

    try {
        await pool.query(
            'DELETE FROM sessao WHERE usuario_id = $1 AND token = $2',
            [usuarioId, token]
        );

        res.status(200).json({ message: 'Logout realizado com sucesso' });

    } catch (error) {
        console.error('Erro no logout:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

module.exports = { signupUser, loginUser, logoutUser };

// back-end/src/controllers/user.controller.js
const { pool } = require('../db');

// ==================== FAVORITOS ====================

// GET /api/users/favorites - Listar favoritos
const getFavorites = async (req, res) => {
    const userId = req.userId;

    try {
        const result = await pool.query(
            `SELECT 
        tmdb_id as tmdb_id,
        tipo as tipo,
        titulo as titulo,
        poster_url as poster_url,
        nota as nota
       FROM favorites 
       WHERE user_id = $1 
       ORDER BY added_at DESC`,
            [userId]
        );

        res.status(200).json({ favorites: result.rows });

    } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// POST /api/users/favorites - Adicionar favorito
const addFavorite = async (req, res) => {
    const userId = req.userId;
    const { tmdb_id, tipo, titulo, poster_url, nota } = req.body;

    if (!tmdb_id || !tipo || !titulo) {
        return res.status(400).json({ error: 'tmdb_id, tipo e titulo são obrigatórios' });
    }

    if (!['filme', 'serie'].includes(tipo)) {
        return res.status(400).json({ error: 'tipo deve ser "filme" ou "serie"' });
    }

    try {
        // Verificar se já existe
        const existing = await pool.query(
            'SELECT id FROM favorites WHERE user_id = $1 AND tmdb_id = $2 AND tipo = $3',
            [userId, tmdb_id, tipo]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Item já está nos favoritos' });
        }

        // Adicionar aos favoritos
        await pool.query(
            `INSERT INTO favorites (user_id, tmdb_id, tipo, titulo, poster_url, nota, added_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [userId, tmdb_id, tipo, titulo, poster_url, nota]
        );

        res.status(201).json({ message: 'Adicionado aos favoritos' });

    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// DELETE /api/users/favorites/:tmdbId - Remover favorito
const removeFavorite = async (req, res) => {
    const userId = req.userId;
    const { tmdbId } = req.params;
    const { tipo } = req.query; // tipo pode vir como query string

    if (!tmdbId) {
        return res.status(400).json({ error: 'tmdbId é obrigatório' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM favorites WHERE user_id = $1 AND tmdb_id = $2 AND tipo = $3 RETURNING id',
            [userId, tmdbId, tipo || 'filme']
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item não encontrado nos favoritos' });
        }

        res.status(200).json({ message: 'Removido dos favoritos' });

    } catch (error) {
        console.error('Erro ao remover favorito:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// ==================== LISTAS ====================

// GET /api/users/lists - Listar todas as listas com itens
const getLists = async (req, res) => {
    const userId = req.userId;

    try {
        // Buscar todas as listas do usuário
        const listsResult = await pool.query(
            `SELECT id, nome, descricao, created_at 
       FROM user_lists 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
            [userId]
        );

        // Para cada lista, buscar seus itens
        const lists = [];
        for (const list of listsResult.rows) {
            const itemsResult = await pool.query(
                `SELECT 
          tmdb_id,
          tipo,
          titulo,
          poster_url,
          nota,
          added_at
         FROM list_items 
         WHERE list_id = $1 
         ORDER BY added_at DESC`,
                [list.id]
            );

            lists.push({
                id: list.id,
                nome: list.nome,
                descricao: list.descricao,
                created_at: list.created_at,
                itens: itemsResult.rows
            });
        }

        res.status(200).json({ listas: lists });

    } catch (error) {
        console.error('Erro ao buscar listas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// POST /api/users/lists - Criar nova lista
const createList = async (req, res) => {
    const userId = req.userId;
    const { nome, descricao } = req.body;

    if (!nome) {
        return res.status(400).json({ error: 'Nome da lista é obrigatório' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO user_lists (user_id, nome, descricao, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, nome, descricao, created_at`,
            [userId, nome, descricao || null]
        );

        res.status(201).json({
            lista: {
                id: result.rows[0].id,
                nome: result.rows[0].nome,
                descricao: result.rows[0].descricao,
                created_at: result.rows[0].created_at,
                itens: []
            }
        });

    } catch (error) {
        console.error('Erro ao criar lista:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// DELETE /api/users/lists/:listId - Deletar lista
const deleteList = async (req, res) => {
    const userId = req.userId;
    const { listId } = req.params;

    try {
        // Verificar se a lista pertence ao usuário
        const listCheck = await pool.query(
            'SELECT id FROM user_lists WHERE id = $1 AND user_id = $2',
            [listId, userId]
        );

        if (listCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }

        // Deletar a lista (itens serão deletados em cascata)
        await pool.query('DELETE FROM user_lists WHERE id = $1', [listId]);

        res.status(200).json({ message: 'Lista deletada com sucesso' });

    } catch (error) {
        console.error('Erro ao deletar lista:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// POST /api/users/lists/:listId/items - Adicionar item à lista
const addToList = async (req, res) => {
    const userId = req.userId;
    const { listId } = req.params;
    const { tmdb_id, tipo, titulo, poster_url, nota } = req.body;

    if (!tmdb_id || !tipo || !titulo) {
        return res.status(400).json({ error: 'tmdb_id, tipo e titulo são obrigatórios' });
    }

    try {
        // Verificar se a lista pertence ao usuário
        const listCheck = await pool.query(
            'SELECT id FROM user_lists WHERE id = $1 AND user_id = $2',
            [listId, userId]
        );

        if (listCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }

        // Verificar se já existe na lista
        const existing = await pool.query(
            'SELECT id FROM list_items WHERE list_id = $1 AND tmdb_id = $2 AND tipo = $3',
            [listId, tmdb_id, tipo]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Item já está nesta lista' });
        }

        // Adicionar à lista
        await pool.query(
            `INSERT INTO list_items (list_id, tmdb_id, tipo, titulo, poster_url, nota, added_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [listId, tmdb_id, tipo, titulo, poster_url, nota]
        );

        res.status(201).json({ message: 'Item adicionado à lista' });

    } catch (error) {
        console.error('Erro ao adicionar item à lista:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// DELETE /api/users/lists/:listId/items/:tmdbId - Remover item da lista
const removeFromList = async (req, res) => {
    const userId = req.userId;
    const { listId, tmdbId } = req.params;
    const { tipo } = req.query;

    try {
        // Verificar se a lista pertence ao usuário
        const listCheck = await pool.query(
            'SELECT id FROM user_lists WHERE id = $1 AND user_id = $2',
            [listId, userId]
        );

        if (listCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }

        // Remover item da lista
        const result = await pool.query(
            'DELETE FROM list_items WHERE list_id = $1 AND tmdb_id = $2 AND tipo = $3 RETURNING id',
            [listId, tmdbId, tipo || 'filme']
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item não encontrado na lista' });
        }

        res.status(200).json({ message: 'Item removido da lista' });

    } catch (error) {
        console.error('Erro ao remover item da lista:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite,
    getLists,
    createList,
    deleteList,
    addToList,
    removeFromList
};
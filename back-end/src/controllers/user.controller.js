// back-end/src/controllers/user.controller.js
const { pool } = require('../db');

// ==================== FAVORITOS ====================

// GET /api/users/favorites - Listar favoritos
const getFavorites = async (req, res) => {
    const usuarioId = req.usuarioId;

    try {
        const result = await pool.query(
            `SELECT 
                tmdb_id,
                tipo,
                titulo,
                poster_url,
                nota,
                adicionado_em
             FROM favoritos 
             WHERE usuario_id = $1 
             ORDER BY adicionado_em DESC`,
            [usuarioId]
        );

        res.status(200).json({
            favoritos: result.rows.map(fav => ({
                tmdb_id: fav.tmdb_id,
                tipo: fav.tipo,
                titulo: fav.titulo,
                poster_url: fav.poster_url,
                nota: fav.nota
            }))
        });

    } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// POST /api/users/favorites - Adicionar favorito
const addFavorite = async (req, res) => {
    const usuarioId = req.usuarioId;
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
            'SELECT id FROM favoritos WHERE usuario_id = $1 AND tmdb_id = $2 AND tipo = $3',
            [usuarioId, tmdb_id, tipo]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Item já está nos favoritos' });
        }

        // Adicionar aos favoritos
        await pool.query(
            `INSERT INTO favoritos (usuario_id, tmdb_id, tipo, titulo, poster_url, nota, adicionado_em)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [usuarioId, tmdb_id, tipo, titulo, poster_url, nota || null]
        );

        res.status(201).json({ message: 'Adicionado aos favoritos' });

    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// DELETE /api/users/favorites/:tmdbId - Remover favorito
const removeFavorite = async (req, res) => {
    const usuarioId = req.usuarioId;
    const { tmdbId } = req.params;
    const { tipo } = req.query;

    if (!tmdbId) {
        return res.status(400).json({ error: 'tmdbId é obrigatório' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM favoritos WHERE usuario_id = $1 AND tmdb_id = $2 AND tipo = $3 RETURNING id',
            [usuarioId, tmdbId, tipo || 'filme']
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
    const usuarioId = req.usuarioId;

    try {
        // Buscar todas as listas do usuário
        const listasResult = await pool.query(
            `SELECT id, nome, descricao, criado_em 
             FROM listas 
             WHERE usuario_id = $1 
             ORDER BY criado_em DESC`,
            [usuarioId]
        );

        // Para cada lista, buscar seus itens
        const listas = [];
        for (const lista of listasResult.rows) {
            const itensResult = await pool.query(
                `SELECT 
                    tmdb_id,
                    tipo,
                    titulo,
                    poster_url,
                    nota,
                    adicionado_em
                 FROM lista_itens 
                 WHERE lista_id = $1 
                 ORDER BY adicionado_em ASC`,
                [lista.id]
            );

            listas.push({
                id: lista.id,
                nome: lista.nome,
                descricao: lista.descricao,
                criada_em: lista.criado_em,
                itens: itensResult.rows.map(item => ({
                    tmdb_id: item.tmdb_id,
                    tipo: item.tipo,
                    titulo: item.titulo,
                    poster_url: item.poster_url,
                    nota: item.nota
                }))
            });
        }

        res.status(200).json({ listas });

    } catch (error) {
        console.error('Erro ao buscar listas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// POST /api/users/lists - Criar nova lista
const createList = async (req, res) => {
    const usuarioId = req.usuarioId;
    const { nome, descricao } = req.body;

    if (!nome) {
        return res.status(400).json({ error: 'Nome da lista é obrigatório' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO listas (usuario_id, nome, descricao, criado_em)
             VALUES ($1, $2, $3, NOW())
             RETURNING id, nome, descricao, criado_em`,
            [usuarioId, nome, descricao || null]
        );

        res.status(201).json({
            lista: {
                id: result.rows[0].id,
                nome: result.rows[0].nome,
                descricao: result.rows[0].descricao,
                criada_em: result.rows[0].criado_em,
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
    const usuarioId = req.usuarioId;
    const { listId } = req.params;

    try {
        // Verificar se a lista pertence ao usuário
        const listaCheck = await pool.query(
            'SELECT id FROM listas WHERE id = $1 AND usuario_id = $2',
            [listId, usuarioId]
        );

        if (listaCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }

        // Deletar a lista (itens serão deletados em cascata)
        await pool.query('DELETE FROM listas WHERE id = $1', [listId]);

        res.status(200).json({ message: 'Lista deletada com sucesso' });

    } catch (error) {
        console.error('Erro ao deletar lista:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// POST /api/users/lists/:listId/items - Adicionar item à lista
const addToList = async (req, res) => {
    const usuarioId = req.usuarioId;
    const { listId } = req.params;
    const { tmdb_id, tipo, titulo, poster_url, nota } = req.body;

    if (!tmdb_id || !tipo || !titulo) {
        return res.status(400).json({ error: 'tmdb_id, tipo e titulo são obrigatórios' });
    }

    try {
        // Verificar se a lista pertence ao usuário
        const listaCheck = await pool.query(
            'SELECT id FROM listas WHERE id = $1 AND usuario_id = $2',
            [listId, usuarioId]
        );

        if (listaCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }

        // Verificar se já existe na lista
        const existing = await pool.query(
            'SELECT id FROM lista_itens WHERE lista_id = $1 AND tmdb_id = $2 AND tipo = $3',
            [listId, tmdb_id, tipo]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Item já está nesta lista' });
        }

        // Adicionar à lista
        await pool.query(
            `INSERT INTO lista_itens (lista_id, tmdb_id, tipo, titulo, poster_url, nota, adicionado_em)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [listId, tmdb_id, tipo, titulo, poster_url, nota || null]
        );

        res.status(201).json({ message: 'Item adicionado à lista' });

    } catch (error) {
        console.error('Erro ao adicionar item à lista:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// DELETE /api/users/lists/:listId/items/:tmdbId - Remover item da lista
const removeFromList = async (req, res) => {
    const usuarioId = req.usuarioId;
    const { listId, tmdbId } = req.params;
    const { tipo } = req.query;

    try {
        // Verificar se a lista pertence ao usuário
        const listaCheck = await pool.query(
            'SELECT id FROM listas WHERE id = $1 AND usuario_id = $2',
            [listId, usuarioId]
        );

        if (listaCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }

        // Remover item da lista
        const result = await pool.query(
            'DELETE FROM lista_itens WHERE lista_id = $1 AND tmdb_id = $2 AND tipo = $3 RETURNING id',
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
const express = require('express');
const router = express.Router();
const { createAuthor, getAuthors, login, updateAuthor, deleteAuthor, getAuthorById } = require('../controllers/authorController');

// Rotas de autores
router.post('/', createAuthor);
router.get('/', getAuthors);
router.get('/:id', getAuthorById);
router.post('/login', login);
router.put('/:id', updateAuthor); // Rota para atualizar autor
router.delete('/:id', deleteAuthor); // Rota para deletar autor

module.exports = router;

const express = require('express');
const router = express.Router();
const { createBook, getBooks, updateBook, deleteBook, getBookById } = require('../controllers/bookController');

// Rotas de livros
router.post('/', createBook);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook); // Rota para atualizar livro
router.delete('/:id', deleteBook); // Rota para deletar livro

module.exports = router;

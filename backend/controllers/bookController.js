const Book = require('../models/book');

// Criar novo livro
exports.createBook = async (req, res) => {
    try {
        const { name, description, responsible, value } = req.body;
        const book = new Book({ name, description, responsible, value });
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Listar todos os livros
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('responsible', 'name');
        res.status(200).json(books);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const books = await Book.findById(req.params.id).populate('responsible', 'name');
        if (!books) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }
        res.status(200).json(books);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Atualizar livro
exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, responsible, value } = req.body;

        const updateBook = await Book.findByIdAndUpdate(
            id,
            { name, description, responsible, value },
            { new: true }
        );
        if (!updateBook) return res.status(404).json({ message: 'Livro não encontrado' });

        res.status(200).json(updateBook);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Excluir livro
exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteBook = await Book.findByIdAndDelete(id);
        if (!deleteBook) return res.status(404).json({ message: 'Livro não encontrado' });

        res.status(200).json({ message: 'Livro excluído com sucesso!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
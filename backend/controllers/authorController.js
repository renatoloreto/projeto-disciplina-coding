const Author = require('../models/author');
const bcrypt = require('bcryptjs');

// Criar novo autor
exports.createAuthor = async (req, res) => {
    try {
        const { name, password, profile } = req.body;
        const author = new Author({ name, password, profile });
        await author.save();
        res.status(201).json(author);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Listar todos os autores
exports.getAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        res.status(200).json(authors);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Buscar um autor específico por ID
exports.getAuthorById = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Autor não encontrado' });
        }
        res.status(200).json(author);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Fazer login
exports.login = async (req, res) => {
    const { name, password } = req.body;
    try {
        const author = await Author.findOne({ name });
        if (!author) return res.status(400).json({ message: 'Autor não encontrado' });

        const isMatch = await bcrypt.compare(password, author.password);
        if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

        res.status(200).json({ message: 'Login bem-sucedido! Bem-vindo!', author });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Atualizar autor
exports.updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, password, profile } = req.body;

        const updatedAuthor = await Author.findByIdAndUpdate(id, { name, password, profile }, { new: true });
        if (!updatedAuthor) return res.status(404).json({ message: 'Autor não encontrado' });

        res.status(200).json(updatedAuthor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Excluir autor
exports.deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAuthor = await Author.findByIdAndDelete(id);
        if (!deletedAuthor) return res.status(404).json({ message: 'Autor não encontrado' });

        res.status(200).json({ message: 'Autor excluído com sucesso' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    responsible: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    value: { type: Number, required: true } // Adicione este campo
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
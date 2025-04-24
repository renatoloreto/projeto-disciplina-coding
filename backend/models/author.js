const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    profile: { type: String, enum: ['admin', 'user'], required: true }
});

// Middleware para criptografar senha antes de salvar
authorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;

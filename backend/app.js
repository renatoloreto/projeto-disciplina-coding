const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authorRoutes = require('./routes/authorRoutes');
const bookRoutes = require('./routes/bookRoutes');
const app = express();
const PORT = process.env.PORT || 3004;

// Middleware para parse de JSON
app.use(express.json());

app.use(cors());

// Conectando ao MongoDB
mongoose.connect('mongodb+srv://rsaloreto:senac123@cluster0.ugdek6p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado ao MongoDB!');
}).catch(err => {
    console.log('Erro ao conectar ao MongoDB:', err);
});
// mongodb+srv://rsaloreto:senac123@cluster0.ugdek6p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// Usando rotas
app.use('/api/authors', authorRoutes);
app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

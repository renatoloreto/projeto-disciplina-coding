document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3004/api'; // Atualize para o URL correto da sua API
    const bookModalElement = document.getElementById('bookModal');
    const bookModal = $(bookModalElement);
    const bookForm = document.getElementById('bookForm');
    const addBookBtn = document.getElementById('addBookBtn');
    const modalTitleBook = document.getElementById('modalTitleBook');
    let editBookId = null;

    // Função para carregar livros
    const loadBooks = async () => {
        const response = await fetch(`${apiUrl}/books`);
        const books = await response.json();
        const tableBody = document.querySelector('#booksTable tbody');
        tableBody.innerHTML = '';

        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.name}</td>
                <td>${book.description}</td>
                <td>${book.responsible ? book.responsible.name : 'N/A'}</td>
                <td>R$ ${book.value ? parseFloat(book.value).toFixed(2) : 'N/A'}</td>
                <td>
                    <button class="editBookBtn btn btn-sm btn-info" data-id="${book._id}">Editar</button>
                    <button class="deleteBookBtn btn btn-sm btn-danger" data-id="${book._id}">Deletar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Adicionar eventos de edição e deleção (agora usando jQuery para consistência)
        $('.editBookBtn').off('click').on('click', function() {
            openEditBookModal($(this).data('id'));
        });

        $('.deleteBookBtn').off('click').on('click', function() {
            deleteBook($(this).data('id'));
        });
    };

    // Função para adicionar livro
    const addBook = async (book) => {
        await fetch(`${apiUrl}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });
        loadBooks();
    };

    // Função para atualizar livro
    const updateBook = async (id, book) => {
        await fetch(`${apiUrl}/books/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });
        loadBooks();
    };

    // Função para deletar livro
    const deleteBook = async (id) => {
        await fetch(`${apiUrl}/books/${id}`, {
            method: 'DELETE'
        });
        loadBooks();
    };

    // Abrir modal para editar livro
    const openEditBookModal = async (id) => {
        editBookId = id;
        modalTitleBook.innerText = 'Editar Livro';

        // Buscar os dados do livro para preencher o modal
        const response = await fetch(`${apiUrl}/books/${id}`);
        if (response.status === 404) {
            console.error('Livro não encontrado');
            return;
        }
        const book = await response.json();

        document.getElementById('nameBook').value = book.name;
        document.getElementById('description').value = book.description;
        document.getElementById('value').value = book.value; // Preenche o campo de valor
        await loadAuthors(book.responsible ? book.responsible._id : null);

        bookModal.modal('show'); // Use a função do Bootstrap para exibir o modal
    };

    // Abrir modal para adicionar novo livro
    const openAddBookModal = async () => {
        editBookId = null;
        modalTitleBook.innerText = 'Adicionar Livro';
        bookForm.reset();
        document.getElementById('value').value = ''; // Limpa o campo de valor ao adicionar
        await loadAuthors(); // Carrega os autores sem pré-selecionar nenhum
        bookModal.modal('show'); // Use a função do Bootstrap para exibir o modal
    };

    // Carregar autores para o select de responsável
    const loadAuthors = async (selectedAuthorId = null) => {
        const response = await fetch(`${apiUrl}/authors`);
        const authors = await response.json();
        const select = document.getElementById('responsible');
        select.innerHTML = ''; // Limpa o select

        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author._id;
            option.text = author.name;
            if (author._id === selectedAuthorId) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    };

    // Fechar modal ao clicar no "x" (já tratado pelo Bootstrap)
    document.querySelector('.close').addEventListener('click', () => {
        bookModal.modal('hide'); // Use a função do Bootstrap para fechar o modal
    });

    // Fechar modal ao clicar fora dele (já tratado pelo Bootstrap)
    window.addEventListener('click', (event) => {
        if (event.target === bookModalElement) {
            bookModal.modal('hide'); // Use a função do Bootstrap para fechar o modal
        }
    });

    // Submissão do formulário
    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bookData = {
            name: document.getElementById('nameBook').value,
            description: document.getElementById('description').value,
            responsible: document.getElementById('responsible').value,
            value: document.getElementById('value').value // Coleta o valor do input
        };

        if (editBookId) {
            await updateBook(editBookId, bookData);
        } else {
            await addBook(bookData);
        }

        bookModal.modal('hide'); // Use a função do Bootstrap para fechar o modal
        loadBooks();
    });

    // Inicializando o carregamento de livros e eventos
    addBookBtn.addEventListener('click', openAddBookModal);
    loadBooks();
});
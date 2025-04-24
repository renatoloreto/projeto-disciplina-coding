document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3004/api'; // Atualize para sua API
    const authorModalElement = document.getElementById('authorModal'); // Pegue o elemento DOM
    const authorModal = $(authorModalElement); // Crie a instância jQuery do modal
    const authorForm = document.getElementById('authorForm');
    const addAuthorBtn = document.getElementById('addAuthorBtn');
    const modalTitle = document.getElementById('modalTitle');
    let editAuthorId = null;

    // Função para carregar autores
    const loadAuthors = async () => {
        const response = await fetch(`${apiUrl}/authors`);
        const authors = await response.json();
        const tableBody = document.querySelector('#authorsTable tbody');
        tableBody.innerHTML = '';

        authors.forEach(author => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${author.name}</td>
                <td>${author.profile}</td>
                <td>
                    <button class="editAuthorBtn btn btn-sm btn-info" data-id="${author._id}">Editar</button>
                    <button class="deleteAuthorBtn btn btn-sm btn-danger" data-id="${author._id}">Deletar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Adicionar eventos de edição e deleção (agora usando jQuery para consistência)
        $('.editAuthorBtn').on('click', function() {
            openEditAuthorModal($(this).data('id'));
        });

        $('.deleteAuthorBtn').on('click', function() {
            deleteAuthor($(this).data('id'));
        });
    };

    // Função para adicionar autor
    const addAuthor = async (author) => {
        await fetch(`${apiUrl}/authors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(author)
        });
        loadAuthors();
    };

    // Função para atualizar autor
    const updateAuthor = async (id, author) => {
        await fetch(`${apiUrl}/authors/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(author)
        });
        loadAuthors();
    };

    // Função para deletar autor
    const deleteAuthor = async (id) => {
        await fetch(`${apiUrl}/authors/${id}`, {
            method: 'DELETE'
        });
        loadAuthors();
    };

    // Abrir modal para editar autor
    const openEditAuthorModal = async (id) => {
        editAuthorId = id;
        modalTitle.innerText = 'Editar Autores';

        // Buscar os dados do autor para preencher o modal
        const response = await fetch(`${apiUrl}/authors/${id}`);
        const author = await response.json();

        document.getElementById('name').value = author.name;
        document.getElementById('profile').value = author.profile;
        document.getElementById('password').value = ''; // Não exibir senha

        authorModal.modal('show'); // Use a função do Bootstrap para exibir o modal
    };

    // Abrir modal para adicionar novo autor
    const openAddAuthorModal = () => {
        editAuthorId = null;
        modalTitle.innerText = 'Adicionar Autor';
        authorForm.reset();
        authorModal.modal('show'); // Use a função do Bootstrap para exibir o modal
    };

    // Fechar modal ao clicar no "x" (já tratado pelo Bootstrap)
    document.querySelector('.close').addEventListener('click', () => {
        authorModal.modal('hide'); // Use a função do Bootstrap para fechar o modal
    });

    // Fechar modal ao clicar fora dele (já tratado pelo Bootstrap)
    window.addEventListener('click', (event) => {
        if (event.target === authorModalElement) {
            authorModal.modal('hide'); // Use a função do Bootstrap para fechar o modal
        }
    });

    // Submissão do formulário
    authorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const authorData = {
            name: document.getElementById('name').value,
            profile: document.getElementById('profile').value,
            password: document.getElementById('password').value
        };

        if (editAuthorId) {
            await updateAuthor(editAuthorId, authorData);
        } else {
            await addAuthor(authorData);
        }

        authorModal.modal('hide'); // Use a função do Bootstrap para fechar o modal
        loadAuthors();
    });

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("/frontend/service-worker.js")
                .then(() => console.log("Service Worker registrado com sucesso!"))
                .catch(err => console.log("Erro ao registrar Service Worker:", err));
        });        
    }

    // Inicializando o carregamento de usuários e eventos
    addAuthorBtn.addEventListener('click', openAddAuthorModal);
    loadAuthors();
});
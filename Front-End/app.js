const API_URL = 'http://localhost:3000/users';

const userForm = document.getElementById('userForm');
const updateForm = document.getElementById('updateForm');
const deleteForm = document.getElementById('deleteForm');
const userList = document.getElementById('userList');

// 1. Função para buscar usuários da API e mostrar na tela
async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        const users = await response.json();
        
        userList.innerHTML = ''; 
        
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `ID: ${user.id} | ${user.name} (${user.age} anos) - ${user.email}`;
            userList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

// 2. Evento do formulário de Cadastro (POST)
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, age: Number(age) })
        });

        if (response.ok) {
            userForm.reset();
            fetchUsers();
        } else {
            alert('Erro ao cadastrar usuário.');
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
    }
});

// 3. Evento do formulário de Atualizar Idade (PUT)
updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('updateId').value;
    const newAge = document.getElementById('updateAge').value;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ age: Number(newAge) })
        });

        if (response.ok) {
            updateForm.reset();
            fetchUsers(); // Atualiza a lista com a nova idade
            alert('Idade atualizada com sucesso!');
        } else if (response.status === 404) {
            alert('Usuário não encontrado com esse ID.');
        } else {
            alert('Erro ao atualizar usuário.');
        }
    } catch (error) {
        console.error('Erro ao atualizar idade:', error);
    }
});

// 4. Evento do formulário de Deletar Usuário (DELETE)
deleteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('deleteId').value;

    if (!confirm(`Tem certeza que deseja deletar o usuário com ID ${id}?`)) {
        return; // Cancela a operação se o usuário clicar em "Cancelar"
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            deleteForm.reset();
            fetchUsers(); // Atualiza a lista removendo o usuário
            alert('Usuário deletado com sucesso!');
        } else if (response.status === 404) {
            alert('Usuário não encontrado com esse ID.');
        } else {
            alert('Erro ao deletar usuário.');
        }
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
    }
});

// Carrega os usuários assim que a página abrir
fetchUsers();

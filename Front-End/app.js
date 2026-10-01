const API_URL = 'http://localhost:3000/users';

const userForm = document.getElementById('userForm');
const userList = document.getElementById('userList');

// Função para buscar usuários da API e mostrar na tela
async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        const users = await response.json();
        
        userList.innerHTML = ''; // Limpa a lista antes de atualizar
        
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.name} (${user.age} anos) - ${user.email}`;
            userList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

// Evento de envio do formulário (Cadastro)
userForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que a página recarregue

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
            userForm.reset(); // Limpa os campos do formulário
            fetchUsers(); // Atualiza a lista na tela
        } else {
            alert('Erro ao cadastrar usuário.');
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
    }
});

// Carrega os usuários assim que a página abrir
fetchUsers();

import express from 'express';
import db from './db.js'; // Importa a conexão com o banco (lembre-se do .js no final)
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); // Habilita CORS para permitir requisições de diferentes origens

// ROTA GET: Busca os usuários diretamente do banco de dados MySQL
app.get('/users', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, name, email, age FROM users');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuários no banco de dados.' });
    }
});

// ROTA POST: Insere um novo usuário no banco de dados MySQL
app.post('/users', async (req, res) => {
    const { name, email, age } = req.body;

    // Validação simples
    if (!name || !email || !age) {
        return res.status(400).json({ error: 'Todos os campos (name, email, age) são obrigatórios.' });
    }

    try {
        const query = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
        const [result] = await db.execute(query, [name, email, age]);

        // Retorna o usuário criado com o ID gerado pelo próprio MySQL
        const newUser = { id: result.insertId, name, email, age };
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao salvar o usuário no banco de dados.' });
    }
});

//ROTA PUT: Atualiza a idade de um  usuário existente no banco de dados MySQL
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { age } = req.body;
    
    // Validação simples
    if (!age) {
        return res.status(400).json({ error: 'O campo age é obrigatório.' });
    }

    try {
        const query = 'UPDATE users SET age = ? WHERE id = ?';
        const [result] = await db.execute(query, [age, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json({ message: 'Idade atualizada com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar a idade do usuário no banco de dados.' });
    }
});

//ROTA DELETE: Deleta um usuário existente no banco de dados MySQL
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await db.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar o usuário no banco de dados.' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

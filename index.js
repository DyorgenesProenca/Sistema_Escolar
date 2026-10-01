import express from 'express';
import db from './db.js'; // Importa a conexão com o banco (lembre-se do .js no final)

const app = express();
app.use(express.json());

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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

import db from '../db.js';

// 1. ROTA DE LOGIN (POST /users/login)
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    try {
        // Busca o usuário pelo e-mail
        const [users] = await db.execute('SELECT id, name, email, password, role FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        const user = users[0];

        // Verifica a senha (em texto limpo por enquanto, como inserido no script SQL)
        if (user.password !== password) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        // Se o login der certo, envia os dados do usuário (exceto a senha) para o Front-end
        res.json({
            message: 'Login realizado com sucesso!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno ao realizar login.' });
    }
};

// 2. ROTA DE CADASTRO (POST /users)
export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Todos os campos (name, email, password, role) são obrigatórios.' });
    }

    // Valida se o tipo de usuário enviado é válido
    if (role !== 'professor' && role !== 'aluno') {
        return res.status(400).json({ error: "O campo role deve ser 'professor' ou 'aluno'." });
    }

    try {
        // Insere o novo usuário na tabela 'users'
        const queryUser = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        const [resultUser] = await db.execute(queryUser, [name, email, password, role]);
        const newUserId = resultUser.insertId;

        // SE for um aluno, cria automaticamente o boletim dele zerado na tabela 'grades'
        if (role === 'aluno') {
            await db.execute('INSERT INTO grades (student_id) VALUES (?)', [newUserId]);
        }

        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            user: { id: newUserId, name, email, role }
        });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
        }
        res.status(500).json({ error: 'Erro ao salvar o usuário no banco de dados.' });
    }
};

// 3. BUSCAR TODOS OS USUÁRIOS (GET /users)
export const getUsers = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, name, email, role FROM users');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
};

// 4. DELETAR USUÁRIO (DELETE /users/:id)
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar o usuário.' });
    }
};

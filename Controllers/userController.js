import db from '../db.js';
import bcrypt from 'bcrypt';

// 1. ROTA DE LOGIN ATUALIZADA (POST /users/login)
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const [users] = await db.execute('SELECT id, name, email, password, role FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        const user = users[0];

        // 🌟 SUPORTE ADMIN / SENHAS ANTIGAS: Se a senha no banco for igual ao texto limpo digitado (ex: admin123)
        let isPasswordCorrect = user.password === password;

        // Se não for igual direto, tenta comparar usando o hash do bcrypt
        if (!isPasswordCorrect) {
            isPasswordCorrect = await bcrypt.compare(password, user.password);
        }

        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        res.json({
            message: 'Login realizado com sucesso!',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno ao realizar login.' });
    }
};

// 2. ROTA DE CADASTRO COM CHECAGEM DE E-MAIL DUPLICADO (POST /users)
export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    if (role !== 'professor' && role !== 'aluno' && role !== 'admin') {
        return res.status(400).json({ error: "Role deve ser 'professor', 'aluno' ou 'admin'." });
    }

    try {
        // 🌟 SEGURANÇA EXTRA: Verifica explicitamente antes se o e-mail já existe
        const [existingUser] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Este endereço de e-mail já está sendo utilizado.' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const queryUser = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        const [resultUser] = await db.execute(queryUser, [name, email, hashedPassword, role]);
        const newUserId = resultUser.insertId;

        // Cria boletim automático apenas se for aluno
        if (role === 'aluno') {
            await db.execute('INSERT INTO grades (student_id) VALUES (?)', [newUserId]);
        }

        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            user: { id: newUserId, name, email, role }
        });
    } catch (error) {
        console.error(error);
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
// 5. ATUALIZAR DADOS DO USUÁRIO (PUT /users/:id) - Para o Professor editar Nome/E-mail
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Nome e E-mail são obrigatórios.' });
    }

    try {
        const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
        const [result] = await db.execute(query, [name, email, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json({ message: 'Dados do usuário atualizados com sucesso!' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Este e-mail já está sendo usado por outro usuário.' });
        }
        res.status(500).json({ error: 'Erro ao atualizar dados do usuário.' });
    }
};


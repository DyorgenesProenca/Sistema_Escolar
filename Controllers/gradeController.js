import db from '../db.js';

// 1. LANÇAR OU ATUALIZAR NOTAS DE UM ALUNO (PUT /grades/:studentId)
export const updateGrades = async (req, res) => {
    const { studentId } = req.params;
    const { nota1, nota2, nota3, nota4 } = req.body;

    // Converte os valores vindos do front para números (caso venham como string)
    const n1 = Number(nota1) || 0;
    const n2 = Number(nota2) || 0;
    const n3 = Number(nota3) || 0;
    const n4 = Number(nota4) || 0;

    // Validação básica: notas devem estar entre 0 e 10
    if ([n1, n2, n3, n4].some(n => n < 0 || n > 10)) {
        return res.status(400).json({ error: 'As notas devem ser valores entre 0 e 10.' });
    }

    // Lógica matemática do negócio (Calculando a média)
    const media = (n1 + n2 + n3 + n4) / 4;

    // Regra da escola: Média maior ou igual a 6.00 é Aprovado
    const status = media >= 6 ? 'Aprovado' : 'Reprovado';

    try {
        const query = `
            UPDATE grades 
            SET nota1 = ?, nota2 = ?, nota3 = ?, nota4 = ?, media = ?, status = ? 
            WHERE student_id = ?
        `;
        const [result] = await db.execute(query, [n1, n2, n3, n4, media, status, studentId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Boletim do aluno não encontrado.' });
        }

        res.json({ 
            message: 'Notas e média atualizadas com sucesso!',
            boletim: { studentId, nota1: n1, nota2: n2, nota3: n3, nota4: n4, media, status }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao salvar as notas no banco de dados.' });
    }
};

// 2. BUSCAR NOTAS DE UM ALUNO ESPECÍFICO (GET /grades/:studentId)
export const getStudentGrades = async (req, res) => {
    const { studentId } = req.params;

    try {
        const query = `
            SELECT g.*, u.name, u.email 
            FROM grades g
            JOIN users u ON g.student_id = u.id
            WHERE g.student_id = ?
        `;
        const [rows] = await db.execute(query, [studentId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Notas não encontradas para este aluno.' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar notas do aluno.' });
    }
};

// 3. BUSCAR LISTA COMPLETA DE ALUNOS COM NOTAS (GET /grades) - Para a visão Geral/Professor
export const getAllGrades = async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.name, u.email, g.nota1, g.nota2, g.nota3, g.nota4, g.media, g.status
            FROM users u
            LEFT JOIN grades g ON u.id = g.student_id
            WHERE u.role = 'aluno'
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar listagem de notas.' });
    }
};

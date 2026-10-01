import express from 'express';
import cors from 'cors';
import * as userController from './Controllers/userController.js'; 
import * as gradeController from './Controllers/gradeController.js'; // 1. Importa o novo controller

const app = express();
app.use(express.json());
app.use(cors());

// Rotas de Usuário e Autenticação
app.post('/users/login', userController.loginUser);
app.get('/users', userController.getUsers);
app.post('/users', userController.createUser);
app.delete('/users/:id', userController.deleteUser);

// Rotas de Notas da Escola (Novas)
app.get('/grades', gradeController.getAllGrades); // Traz todos os alunos com suas notas
app.get('/grades/:studentId', gradeController.getStudentGrades); // Traz a nota de 1 aluno específico
app.put('/grades/:studentId', gradeController.updateGrades); // Lança/altera notas de um aluno

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

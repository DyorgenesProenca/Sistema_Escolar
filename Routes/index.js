import express from 'express';
import * as userController from '../Controllers/userController.js';
import * as gradeController from '../Controllers/gradeController.js';

const router = express.Router();

// Rotas de Usuários e Autenticação
router.post('/users/login', userController.loginUser);
router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Rotas de Notas
router.get('/grades', gradeController.getAllGrades);
router.get('/grades/:studentId', gradeController.getStudentGrades);
router.put('/grades/:studentId', gradeController.updateGrades);

export default router;

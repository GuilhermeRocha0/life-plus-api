import { Router } from 'express'
import {
  getUsers,
  updatePassword,
  updateEmail,
  updateProfile
} from '../controllers/userController'
import { authenticateToken } from '../middlewares/authenticateToken'

/**
 * @swagger
 * tags:
 *   name: User Routes
 *   description: Rotas relacionadas a usuários
 */
const router = Router()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [User Routes]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 */
router.get('/', getUsers)

/**
 * @swagger
 * /users/update-password:
 *   post:
 *     summary: Altera a senha do usuário logado
 *     tags: [User Routes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Erro ao alterar senha
 */
router.post('/update-password', authenticateToken, updatePassword)

/**
 * @swagger
 * /users/update-email:
 *   post:
 *     summary: Altera o e-mail do usuário logado
 *     tags: [User Routes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: E-mail atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar o e-mail
 */
router.post('/update-email', authenticateToken, updateEmail)

/**
 * @swagger
 * /users/update-profile:
 *   put:
 *     summary: Atualiza nome e data de nascimento do usuário logado
 *     tags: [User Routes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 2003-08-15
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 *       400:
 *         description: Erro ao atualizar os dados
 */
router.put('/update-profile', authenticateToken, updateProfile)

export default router

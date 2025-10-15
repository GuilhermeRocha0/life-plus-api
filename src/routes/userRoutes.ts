import { Router } from 'express'
import { getUsers, changePassword } from '../controllers/userController'
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
 * /users/change-password:
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
router.post('/change-password', authenticateToken, changePassword)

export default router

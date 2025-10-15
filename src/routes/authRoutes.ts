import { Router } from 'express'
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
} from '../controllers/authController'

/**
 * @swagger
 * tags:
 *   name: Auth Routes
 *   description: Rotas de autenticação de usuários
 */

const router = Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post('/register', registerUser)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     tags: [Auth Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', loginUser)

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Envia código de recuperação para o e-mail
 *     tags: [Auth Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@teste.com
 *     responses:
 *       200:
 *         description: Código enviado para o e-mail
 *       404:
 *         description: E-mail não encontrado
 */
router.post('/forgot-password', forgotPassword)

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Redefine a senha com base no código recebido
 *     tags: [Auth Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@teste.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "novaSenha123"
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Código inválido ou expirado
 */
router.post('/reset-password', resetPassword)

export default router

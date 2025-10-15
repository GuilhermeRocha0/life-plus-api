import { Router } from 'express'
import { getUsers } from '../controllers/userController'

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

export default router

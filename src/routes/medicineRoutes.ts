import { Router } from 'express'
import {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine
} from '../controllers/medicineController'
import { authenticateToken } from '../middlewares/authenticateToken'

/**
 * @swagger
 * tags:
 *   name: Medicine Routes
 *   description: Rotas relacionadas aos remédios dos usuários
 */
const router = Router()

/**
 * @swagger
 * /medicines:
 *   get:
 *     summary: Lista todos os remédios do usuário logado
 *     tags: [Medicine Routes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de remédios retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                     example: Dipirona
 *                   type:
 *                     type: string
 *                     enum: [PILL, LIQUID]
 *                   intervalHours:
 *                     type: number
 *                   lastTakenAt:
 *                     type: string
 *                     format: date-time
 *                   continuousUse:
 *                     type: boolean
 *                   treatmentFinished:
 *                     type: boolean
 *       401:
 *         description: Usuário não autenticado
 */
router.get('/', authenticateToken, getMedicines)

/**
 * @swagger
 * /medicines:
 *   post:
 *     summary: Cria um novo remédio para o usuário logado
 *     tags: [Medicine Routes]
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
 *                 description: Nome do remédio
 *                 example: Amoxicilina
 *               type:
 *                 type: string
 *                 enum: [PILL, LIQUID]
 *                 example: PILL
 *               intervalHours:
 *                 type: number
 *                 description: Intervalo em horas entre doses
 *                 example: 8
 *               lastTakenAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-15T08:00:00Z
 *               continuousUse:
 *                 type: boolean
 *                 example: false
 *               treatmentFinished:
 *                 type: boolean
 *                 example: false
 *               totalPills:
 *                 type: number
 *                 example: 20
 *               pillsPerDose:
 *                 type: number
 *                 example: 1
 *               totalMl:
 *                 type: number
 *                 example: 100
 *               mlPerDose:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Remédio criado com sucesso
 *       400:
 *         description: Erro ao criar o remédio
 *       401:
 *         description: Usuário não autenticado
 */
router.post('/', authenticateToken, createMedicine)

/**
 * @swagger
 * /medicines/{id}:
 *   get:
 *     summary: Retorna um remédio específico do usuário logado
 *     tags: [Medicine Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do remédio
 *     responses:
 *       200:
 *         description: Remédio retornado com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Remédio não encontrado
 */
router.get('/:id', authenticateToken, getMedicineById)

/**
 * @swagger
 * /medicines/{id}:
 *   put:
 *     summary: Atualiza os dados de um remédio
 *     tags: [Medicine Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do remédio a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Amoxicilina
 *               intervalHours:
 *                 type: number
 *                 example: 12
 *               continuousUse:
 *                 type: boolean
 *                 example: true
 *               totalPills:
 *                 type: number
 *                 example: 40
 *               pillsPerDose:
 *                 type: number
 *                 example: 2
 *               lastTakenAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-15T14:00:00Z
 *     responses:
 *       200:
 *         description: Remédio atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar remédio
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Remédio não encontrado
 */
router.put('/:id', authenticateToken, updateMedicine)

/**
 * @swagger
 * /medicines/{id}:
 *   delete:
 *     summary: Exclui um remédio do usuário logado
 *     tags: [Medicine Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do remédio a ser excluído
 *     responses:
 *       200:
 *         description: Remédio excluído com sucesso
 *       400:
 *         description: Erro ao excluir remédio
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Remédio não encontrado
 */
router.delete('/:id', authenticateToken, deleteMedicine)

export default router

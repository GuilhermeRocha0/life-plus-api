import { Router } from 'express'
import {
  createHistory,
  getHistoryByMedicine,
  getHistoryById
} from '../controllers/medicineHistoryController'
import { authenticateToken } from '../middlewares/authenticateToken'

/**
 * @swagger
 * tags:
 *   name: Medicine History Routes
 *   description: Rotas relacionadas ao histórico de doses de medicamentos
 */
const router = Router()

/**
 * @swagger
 * /medicines/{id}/history:
 *   post:
 *     summary: Registra uma nova dose de um remédio
 *     tags: [Medicine History Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do remédio
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               takenAt:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora em que a dose foi tomada
 *                 example: "2025-10-15T08:30:00Z"
 *               onTime:
 *                 type: boolean
 *                 description: Indica se a dose foi tomada no horário correto
 *                 example: true
 *     responses:
 *       201:
 *         description: Dose registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Dose registrada com sucesso.
 *                 dose:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     takenAt:
 *                       type: string
 *                       format: date-time
 *                     onTime:
 *                       type: boolean
 *       400:
 *         description: Erro ao registrar a dose
 *       401:
 *         description: Usuário não autenticado
 */
router.post('/:id/history', authenticateToken, createHistory)

/**
 * @swagger
 * /medicines/{id}/history:
 *   get:
 *     summary: Lista o histórico de doses de um remédio específico
 *     tags: [Medicine History Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do remédio
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de doses retornada com sucesso
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
 *                   takenAt:
 *                     type: string
 *                     format: date-time
 *                   onTime:
 *                     type: boolean
 *       400:
 *         description: Erro ao listar doses
 *       401:
 *         description: Usuário não autenticado
 */
router.get('/:id/history', authenticateToken, getHistoryByMedicine)

/**
 * @swagger
 * /medicines/history/{historyId}:
 *   get:
 *     summary: Retorna os detalhes de uma dose específica
 *     tags: [Medicine History Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: historyId
 *         required: true
 *         description: ID da dose
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detalhes da dose retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 takenAt:
 *                   type: string
 *                   format: date-time
 *                 onTime:
 *                   type: boolean
 *                 medicine:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     intervalHours:
 *                       type: integer
 *                     continuousUse:
 *                       type: boolean
 *                     treatmentFinished:
 *                       type: boolean
 *       404:
 *         description: Dose não encontrada
 *       401:
 *         description: Usuário não autenticado
 */
router.get('/history/:historyId', authenticateToken, getHistoryById)

export default router

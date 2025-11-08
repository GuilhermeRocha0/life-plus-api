import { Router } from 'express'
import {
  createExam,
  getExams,
  getExamById,
  getExamPhotoById,
  updateExam,
  deleteExam
} from '../controllers/examController'
import { authenticateToken } from '../middlewares/authenticateToken'
import { upload } from '../middlewares/upload'

/**
 * @swagger
 * tags:
 *   name: Exam Routes
 *   description: Rotas relacionadas aos exames dos usuários
 */
const router = Router()

/**
 * @swagger
 * /exams:
 *   get:
 *     summary: Lista todos os exames do usuário logado
 *     tags: [Exam Routes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de exames retornada com sucesso
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
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   result:
 *                     type: string
 *                   photos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         fileName:
 *                           type: string
 *                         mimeType:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Usuário não autenticado
 */
router.get('/', authenticateToken, getExams)

/**
 * @swagger
 * /exams:
 *   post:
 *     summary: Cria um novo exame para o usuário logado
 *     tags: [Exam Routes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome ou título do exame
 *                 example: Exame de sangue completo
 *               description:
 *                 type: string
 *                 description: Descrição opcional do exame
 *                 example: Hemograma solicitado em rotina anual
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data em que o exame foi realizado
 *                 example: 2025-10-15
 *               result:
 *                 type: string
 *                 description: Resultado textual opcional do exame
 *               files:
 *                 type: array
 *                 description: Lista opcional de arquivos do exame
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Exame criado com sucesso
 *       400:
 *         description: Erro ao criar exame
 *       401:
 *         description: Usuário não autenticado
 */
router.post('/', authenticateToken, upload.array('files'), createExam)

/**
 * @swagger
 * /exams/{id}:
 *   get:
 *     summary: Retorna um exame específico do usuário logado
 *     tags: [Exam Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do exame
 *     responses:
 *       200:
 *         description: Exame retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 result:
 *                   type: string
 *                 photos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       fileName:
 *                         type: string
 *                       mimeType:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Exame não encontrado
 */
router.get('/:id', authenticateToken, getExamById)

/**
 * @swagger
 * /exams/photos/{photoId}:
 *   get:
 *     summary: Retorna o arquivo de uma foto de exame (somente do usuário logado)
 *     tags: [Exam Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da foto do exame
 *     responses:
 *       200:
 *         description: Arquivo retornado com sucesso
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Foto não encontrada ou não autorizada
 */
router.get('/photos/:photoId', authenticateToken, getExamPhotoById)

/**
 * @swagger
 * /exams/{id}:
 *   put:
 *     summary: Atualiza um exame existente do usuário logado (dados e fotos)
 *     tags: [Exam Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do exame a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Novo nome do exame
 *               description:
 *                 type: string
 *                 description: Nova descrição
 *               date:
 *                 type: string
 *                 format: date
 *               result:
 *                 type: string
 *                 description: Novo resultado (texto)
 *               removePhotos:
 *                 type: array
 *                 description: IDs das fotos que devem ser removidas
 *                 items:
 *                   type: string
 *                   format: uuid
 *               files:
 *                 type: array
 *                 description: Novos arquivos a serem adicionados
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Exame atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar exame
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Exame não encontrado
 */
router.put('/:id', authenticateToken, upload.array('files'), updateExam)

/**
 * @swagger
 * /exams/{id}:
 *   delete:
 *     summary: Exclui um exame do usuário logado
 *     tags: [Exam Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do exame a ser excluído
 *     responses:
 *       200:
 *         description: Exame excluído com sucesso
 *       400:
 *         description: Erro ao excluir exame
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Exame não encontrado
 */
router.delete('/:id', authenticateToken, deleteExam)

export default router

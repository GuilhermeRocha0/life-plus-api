import { Request, Response } from 'express'
import * as examService from '../services/examService'

export const createExam = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { name, description, date, result } = req.body

    const files = req.files as Express.Multer.File[] | undefined

    const exam = await examService.createExam({
      userId,
      name,
      description,
      date,
      result,
      photos: files || []
    })

    res.status(201).json(exam)
  } catch (error: any) {
    res.status(400).json({ erro: error.message })
  }
}

export const getExams = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const exams = await examService.getExams(userId)
    res.status(200).json(exams)
  } catch (error: any) {
    res.status(500).json({ erro: error.message })
  }
}

export const getExamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.id

    const exam = await examService.getExamById(id, userId)
    res.status(200).json(exam)
  } catch (error: any) {
    res.status(404).json({ erro: error.message })
  }
}

export const getExamPhotoById = async (req: Request, res: Response) => {
  try {
    const { photoId } = req.params
    const userId = (req as any).user.id

    const photo = await examService.getExamPhotoById(photoId, userId)

    res.setHeader('Content-Type', photo.mimeType)
    res.setHeader('Content-Disposition', `inline; filename="${photo.fileName}"`)
    res.send(photo.data)
  } catch (error: any) {
    res.status(404).json({ erro: error.message })
  }
}

export const updateExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.id
    const { name, description, date, result, removePhotos } = req.body

    const files = req.files as Express.Multer.File[] | undefined

    const updatedExam = await examService.updateExam(id, userId, {
      name,
      description,
      date,
      result,
      photos: files || [],
      removePhotos: removePhotos ? JSON.parse(removePhotos) : []
    })

    res.status(200).json(updatedExam)
  } catch (error: any) {
    res.status(400).json({ erro: error.message })
  }
}

export const deleteExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.id
    await examService.deleteExam(id, userId)
    res.status(200).json({ mensagem: 'Exame excluído com sucesso.' })
  } catch (error: any) {
    res.status(400).json({ erro: error.message })
  }
}

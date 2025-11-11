import { Request, Response } from 'express'
import * as historyService from '../services/medicineHistoryService'

export const createHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    const { takenAt, onTime } = req.body

    if (!takenAt)
      return res.status(400).json({ erro: 'O campo takenAt é obrigatório.' })

    const result = await historyService.createHistory(
      id,
      userId,
      takenAt,
      onTime
    )
    res.status(201).json(result)
  } catch (error: any) {
    res.status(400).json({ erro: error.message })
  }
}

export const getHistoryByMedicine = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    const history = await historyService.getHistoryByMedicine(id, userId)
    res.status(200).json(history)
  } catch (error: any) {
    res.status(400).json({ erro: error.message })
  }
}

export const getHistoryById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { historyId } = req.params

    const history = await historyService.getHistoryById(historyId, userId)
    res.status(200).json(history)
  } catch (error: any) {
    res.status(404).json({ erro: error.message })
  }
}

import { Request, Response } from 'express'
import * as medicineService from '../services/medicineService'

export const createMedicine = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const {
      name,
      type,
      intervalHours,
      lastTakenAt,
      continuousUse,
      treatmentFinished,
      totalPills,
      pillsPerDose,
      totalMl,
      mlPerDose
    } = req.body

    const medicine = await medicineService.createMedicine({
      userId,
      name,
      type,
      intervalHours: Number(intervalHours),
      lastTakenAt,
      continuousUse: continuousUse === 'true' || continuousUse === true,
      treatmentFinished:
        treatmentFinished === 'true' || treatmentFinished === true,
      totalPills: totalPills ? Number(totalPills) : undefined,
      pillsPerDose: pillsPerDose ? Number(pillsPerDose) : undefined,
      totalMl: totalMl ? Number(totalMl) : undefined,
      mlPerDose: mlPerDose ? Number(mlPerDose) : undefined
    })

    res.status(201).json(medicine)
  } catch (error: any) {
    res.status(400).json({ erro: error.message })
  }
}

export const getMedicines = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const medicines = await medicineService.getMedicines(userId)
    res.status(200).json(medicines)
  } catch (error: any) {
    res.status(500).json({ erro: 'Erro ao buscar os remédios.' })
  }
}

export const getMedicineById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.id
    const medicine = await medicineService.getMedicineById(id, userId)
    res.status(200).json(medicine)
  } catch (error: any) {
    res.status(404).json({ erro: error.message })
  }
}

export const updateMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.id

    const {
      name,
      type,
      intervalHours,
      lastTakenAt,
      continuousUse,
      treatmentFinished,
      totalPills,
      pillsPerDose,
      totalMl,
      mlPerDose
    } = req.body

    const updated = await medicineService.updateMedicine(id, userId, {
      name,
      type,
      intervalHours: intervalHours ? Number(intervalHours) : undefined,
      lastTakenAt,
      continuousUse:
        continuousUse === 'true' || continuousUse === true ? true : false,
      treatmentFinished:
        treatmentFinished === 'true' || treatmentFinished === true
          ? true
          : false,
      totalPills: totalPills ? Number(totalPills) : undefined,
      pillsPerDose: pillsPerDose ? Number(pillsPerDose) : undefined,
      totalMl: totalMl ? Number(totalMl) : undefined,
      mlPerDose: mlPerDose ? Number(mlPerDose) : undefined
    })

    res.status(200).json(updated)
  } catch (error: any) {
    res.status(400).json({ erro: error.message })
  }
}

export const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.id
    const result = await medicineService.deleteMedicine(id, userId)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(400).json({ erro: error.message })
  }
}

import { Request, Response } from 'express'
import * as userService from '../services/userService'

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers()
    res.json(users)
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch users',
      details: (error as Error).message
    })
  }
}

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { oldPassword, newPassword, confirmPassword } = req.body

    const result = await userService.updateUserPassword({
      userId,
      oldPassword,
      newPassword,
      confirmPassword
    })

    res.status(200).json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const updateEmail = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { newEmail } = req.body

    if (!newEmail) {
      return res.status(400).json({ error: 'O novo e-mail é obrigatório' })
    }

    const result = await userService.updateUserEmail({ userId, newEmail })

    res.status(200).json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { name, birthDate } = req.body

    const result = await userService.updateUserProfile({
      userId,
      name,
      birthDate
    })

    res.status(200).json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id

    const result = await userService.deleteUserCompletely(userId)

    res.status(200).json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getLoggedUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id

    const user = await userService.getLoggedUser(userId)

    res.status(200).json(user)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

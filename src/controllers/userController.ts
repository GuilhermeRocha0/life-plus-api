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

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { oldPassword, newPassword, confirmPassword } = req.body

    const result = await userService.changeUserPassword({
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

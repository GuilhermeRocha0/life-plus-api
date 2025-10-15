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

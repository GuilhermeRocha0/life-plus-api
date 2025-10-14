import { Request, Response } from 'express'
import * as userService from '../services/userService'

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, birthDate, role } = req.body

  try {
    const user = await userService.createUser({
      name,
      email,
      password,
      birthDate,
      role
    })
    res.status(201).json({ message: 'User created successfully', user })
  } catch (error) {
    console.error(error)
    res.status(400).json({
      error: 'Unable to create user',
      details: (error as Error).message
    })
  }
}

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

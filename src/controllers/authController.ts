import { Request, Response } from 'express'
import * as authService from '../services/authService'

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, birthDate, role } = req.body

  try {
    const user = await authService.registerUser({
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

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const token = await authService.loginUser(email, password)
    res.json({ message: 'Login successful', token })
  } catch (error) {
    res.status(401).json({
      error: 'Invalid credentials',
      details: (error as Error).message
    })
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body

  try {
    const result = await authService.forgotPassword(email)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body

  try {
    const result = await authService.resetPassword(email, code, newPassword)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

import { Request, Response } from 'express'
import * as authService from '../services/authService'

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword, birthDate, role } = req.body

  try {
    const user = await authService.registerUser({
      name,
      email,
      password,
      confirmPassword,
      birthDate,
      role
    })

    res.status(201).json({ message: 'Usuário criado com sucesso', user })
  } catch (error) {
    console.error(error)
    res.status(400).json({
      error: 'Não foi possível criar o usuário',
      details: (error as Error).message
    })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const token = await authService.loginUser({ email, password })
    res.json({ message: 'Login realizado com sucesso', token })
  } catch (error) {
    res.status(401).json({
      error: 'Credenciais inválidas',
      details: (error as Error).message
    })
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body

  try {
    const result = await authService.forgotPassword({ email })
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword, confirmPassword } = req.body

  try {
    const result = await authService.resetPassword({
      email,
      code,
      newPassword,
      confirmPassword
    })
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

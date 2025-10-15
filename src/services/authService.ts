import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

interface RegisterUserData {
  name: string
  email: string
  password: string
  birthDate: string
  role?: string
}

// Registro de usuário
export const registerUser = async ({
  name,
  email,
  password,
  birthDate,
  role = 'user'
}: RegisterUserData) => {
  // Verifica se email já existe
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) throw new Error('Email already in use')

  const hashedPassword = await bcrypt.hash(password, 10)

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      birthDate: new Date(birthDate),
      role
    }
  })
}

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('User not found')

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) throw new Error('Invalid password')

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  )

  return token
}

const recoveryCodes = new Map<string, { code: string; expiresAt: number }>()

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Email not found')

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + 30 * 60 * 1000

  recoveryCodes.set(email, { code, expiresAt })

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: `"Life+ | Solicitação de Redefinição de Senha" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Código de recuperação de senha',
    text: `Seu código de recuperação é: ${code}`
  })

  return { message: 'Código enviado para o e-mail' }
}

// Reset de senha
export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  const stored = recoveryCodes.get(email)
  if (!stored || stored.code !== code || Date.now() > stored.expiresAt) {
    throw new Error('Código inválido ou expirado')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.updateMany({
    where: { email },
    data: { password: hashedPassword }
  })

  recoveryCodes.delete(email)
  return { message: 'Senha redefinida com sucesso' }
}

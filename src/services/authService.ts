import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

interface RegisterUserData {
  name: string
  email: string
  password: string
  confirmPassword: string
  birthDate: string
  role?: string
}

interface LoginUserData {
  email: string
  password: string
}

interface ForgotPasswordData {
  email: string
}

interface ResetPasswordData {
  email: string
  code: string
  newPassword: string
  confirmPassword: string
}

const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
  return regex.test(password)
}

const recoveryCodes = new Map<string, { code: string; expiresAt: number }>()

export const registerUser = async ({
  name,
  email,
  password,
  confirmPassword,
  birthDate,
  role = 'user'
}: RegisterUserData) => {
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) throw new Error('E-mail já está em uso')

  if (password !== confirmPassword) {
    throw new Error('A senha e a confirmação não coincidem')
  }

  if (!validatePassword(password)) {
    throw new Error(
      'Senha inválida. Deve ter mínimo 8 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial.'
    )
  }

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

export const loginUser = async ({ email, password }: LoginUserData) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Usuário não encontrado')

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) throw new Error('Senha inválida')

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  )

  return token
}

export const forgotPassword = async ({ email }: ForgotPasswordData) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('E-mail não encontrado')

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

export const resetPassword = async ({
  email,
  code,
  newPassword,
  confirmPassword
}: ResetPasswordData) => {
  const stored = recoveryCodes.get(email)
  if (!stored || stored.code !== code || Date.now() > stored.expiresAt) {
    throw new Error('Código inválido ou expirado')
  }

  if (newPassword !== confirmPassword) {
    throw new Error('A senha e a confirmação não coincidem')
  }

  if (!validatePassword(newPassword)) {
    throw new Error(
      'Senha inválida. Deve ter mínimo 8 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial.'
    )
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.updateMany({
    where: { email },
    data: { password: hashedPassword }
  })

  recoveryCodes.delete(email)
  return { message: 'Senha redefinida com sucesso' }
}

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { encrypt } from './cryptoService'

const prisma = new PrismaClient()

interface CreateUserData {
  name: string
  email: string
  password: string
  birthDate: string
  role?: string
}

export const createUser = async ({
  name,
  email,
  password,
  birthDate,
  role = 'user'
}: CreateUserData) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  const encryptedEmail = encrypt(email)

  return prisma.user.create({
    data: {
      name,
      email: encryptedEmail,
      password: hashedPassword,
      birthDate: new Date(birthDate),
      role
    }
  })
}

export const getUsers = async () => {
  return prisma.user.findMany()
}

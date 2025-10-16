import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { validatePassword } from '../middlewares/validatePassword'

const prisma = new PrismaClient()

interface UpdatePasswordData {
  userId: string
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

interface UpdateEmailData {
  userId: string
  newEmail: string
}

interface UpdateUserData {
  userId: string
  name?: string
  birthDate?: Date
}

export const getUsers = async () => {
  return prisma.user.findMany()
}

export const updateUserPassword = async ({
  userId,
  oldPassword,
  newPassword,
  confirmPassword
}: UpdatePasswordData) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('Usuário não encontrado')

  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password)
  if (!isOldPasswordValid) throw new Error('Senha antiga incorreta')

  if (newPassword !== confirmPassword)
    throw new Error('As senhas não coincidem')

  if (!validatePassword(newPassword))
    throw new Error(
      'Senha inválida. Deve ter mínimo 8 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial.'
    )

  const hashedNewPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword }
  })

  return { message: 'Senha alterada com sucesso' }
}

export const updateUserEmail = async ({
  userId,
  newEmail
}: UpdateEmailData) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: newEmail }
  })

  if (existingUser) {
    throw new Error('Esse e-mail já está em uso')
  }

  await prisma.user.update({
    where: { id: userId },
    data: { email: newEmail }
  })

  return { message: 'E-mail atualizado com sucesso' }
}

export const updateUserProfile = async ({
  userId,
  name,
  birthDate
}: UpdateUserData) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('Usuário não encontrado')

  const dataToUpdate: any = {}

  if (name) dataToUpdate.name = name

  if (birthDate) {
    const date = new Date(birthDate)

    if (isNaN(date.getTime())) {
      throw new Error('Data de nascimento inválida')
    }

    const today = new Date()
    const oldestAllowed = new Date()
    oldestAllowed.setFullYear(today.getFullYear() - 120)

    if (date > today) {
      throw new Error('Data de nascimento não pode ser futura')
    }

    if (date < oldestAllowed) {
      throw new Error('Data de nascimento muito antiga')
    }

    dataToUpdate.birthDate = date
  }

  if (Object.keys(dataToUpdate).length === 0) {
    throw new Error('Nenhum dado informado para atualização')
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
    select: { id: true, name: true, email: true, birthDate: true, role: true }
  })

  return { message: 'Dados atualizados com sucesso', user: updatedUser }
}

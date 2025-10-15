import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { validatePassword } from '../middlewares/validatePassword'

const prisma = new PrismaClient()

interface ChangePasswordData {
  userId: string
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export const getUsers = async () => {
  return prisma.user.findMany()
}

export const changeUserPassword = async ({
  userId,
  oldPassword,
  newPassword,
  confirmPassword
}: ChangePasswordData) => {
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

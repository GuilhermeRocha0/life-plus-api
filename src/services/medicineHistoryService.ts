import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createHistory = async (
  medicineId: string,
  userId: string,
  takenAt: string,
  onTime: boolean
) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId }
  })

  if (!medicine || medicine.userId !== userId) {
    throw new Error('Remédio não encontrado ou não autorizado.')
  }

  let finalTakenAt: Date

  if (onTime) {
    if (!medicine.lastTakenAt) {
      throw new Error('Não há registro anterior para calcular o horário.')
    }

    finalTakenAt = new Date(medicine.lastTakenAt)
    finalTakenAt.setHours(finalTakenAt.getHours() + medicine.intervalHours)
  } else {
    finalTakenAt = new Date(takenAt)
  }

  if (
    medicine.lastTakenAt &&
    finalTakenAt.getTime() <= new Date(medicine.lastTakenAt).getTime()
  ) {
    throw new Error(
      'O novo histórico não pode ter data/hora anterior ou igual ao último registro.'
    )
  }

  const history = await prisma.medicineHistory.create({
    data: {
      medicineId,
      takenAt: finalTakenAt,
      onTime
    }
  })

  await prisma.medicine.update({
    where: { id: medicineId },
    data: { lastTakenAt: finalTakenAt }
  })

  return { mensagem: 'Histórico registrado com sucesso.', history }
}

export const getHistoryByMedicine = async (
  medicineId: string,
  userId: string
) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId }
  })

  if (!medicine || medicine.userId !== userId) {
    throw new Error('Remédio não encontrado ou não autorizado.')
  }

  const history = await prisma.medicineHistory.findMany({
    where: { medicineId },
    orderBy: { takenAt: 'desc' }
  })

  return history
}

export const getHistoryById = async (historyId: string, userId: string) => {
  const history = await prisma.medicineHistory.findUnique({
    where: { id: historyId },
    include: {
      medicine: true
    }
  })

  if (!history || history.medicine.userId !== userId) {
    throw new Error('Histórico não encontrado ou não autorizado.')
  }

  return history
}

export const deleteHistory = async (historyId: string, userId: string) => {
  const history = await prisma.medicineHistory.findUnique({
    where: { id: historyId },
    include: { medicine: true }
  })

  if (!history || history.medicine.userId !== userId) {
    throw new Error('Histórico não encontrado ou não autorizado.')
  }

  await prisma.medicineHistory.delete({ where: { id: historyId } })

  return { mensagem: 'Histórico removido com sucesso.' }
}

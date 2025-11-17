import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface MedicineData {
  userId: string
  name: string
  type: 'PILL' | 'LIQUID'
  intervalHours: number
  lastTakenAt: string
  continuousUse: boolean
  treatmentFinished?: boolean
  totalPills?: number
  pillsPerDose?: number
  totalMl?: number
  mlPerDose?: number
}

export const createMedicine = async (data: MedicineData) => {
  const {
    userId,
    name,
    type,
    intervalHours,
    lastTakenAt,
    continuousUse,
    treatmentFinished,
    totalPills,
    pillsPerDose,
    totalMl,
    mlPerDose
  } = data

  if (!name || !intervalHours || !lastTakenAt)
    throw new Error(
      'Os campos nome, intervalo e data da última dose são obrigatórios.'
    )

  const medicine = await prisma.medicine.create({
    data: {
      userId,
      name,
      type,
      intervalHours,
      lastTakenAt: new Date(lastTakenAt),
      continuousUse,
      treatmentFinished: treatmentFinished ?? false,
      totalPills,
      pillsPerDose,
      totalMl,
      mlPerDose
    }
  })

  return { mensagem: 'Remédio criado com sucesso.', medicine }
}

export const getMedicines = async (userId: string) => {
  const medicines = await prisma.medicine.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })
  return medicines
}

export const getMedicineById = async (id: string, userId: string) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: { history: true }
  })

  if (!medicine || medicine.userId !== userId)
    throw new Error('Remédio não encontrado ou acesso não autorizado.')

  return medicine
}

export const updateMedicine = async (
  id: string,
  userId: string,
  data: Partial<MedicineData>
) => {
  const medicine = await prisma.medicine.findUnique({ where: { id } })

  if (!medicine || medicine.userId !== userId)
    throw new Error('Remédio não encontrado ou acesso não autorizado.')

  const updatedMedicine = await prisma.medicine.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.intervalHours !== undefined && {
        intervalHours: data.intervalHours
      }),
      ...(data.lastTakenAt !== undefined && {
        lastTakenAt: new Date(data.lastTakenAt)
      }),
      ...(data.continuousUse !== undefined && {
        continuousUse: data.continuousUse
      }),
      ...(data.treatmentFinished !== undefined && {
        treatmentFinished: data.treatmentFinished
      }),
      ...(data.totalPills !== undefined && { totalPills: data.totalPills }),
      ...(data.pillsPerDose !== undefined && {
        pillsPerDose: data.pillsPerDose
      }),
      ...(data.totalMl !== undefined && { totalMl: data.totalMl }),
      ...(data.mlPerDose !== undefined && { mlPerDose: data.mlPerDose })
    }
  })

  return { mensagem: 'Remédio atualizado com sucesso.', updatedMedicine }
}

export const deleteMedicine = async (id: string, userId: string) => {
  const medicine = await prisma.medicine.findUnique({ where: { id } })

  if (!medicine || medicine.userId !== userId)
    throw new Error('Remédio não encontrado ou acesso não autorizado.')

  await prisma.medicineHistory.deleteMany({
    where: { medicineId: id }
  })

  await prisma.medicine.delete({ where: { id } })

  return { mensagem: 'Remédio excluído com sucesso.' }
}

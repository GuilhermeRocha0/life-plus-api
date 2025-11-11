import { PrismaClient } from '@prisma/client'
import { encrypt, decrypt } from './cryptoService'

const prisma = new PrismaClient()

interface ExamData {
  userId: string
  name?: string
  description?: string
  date?: string
  result?: string
  photos?: Express.Multer.File[]
  removePhotos?: string[]
}

export const createExam = async ({
  userId,
  name,
  description,
  date,
  result,
  photos = []
}: any) => {
  if (!name || !date) throw new Error('Nome e data são obrigatórios.')

  const exam = await prisma.exam.create({
    data: {
      userId,
      name,
      description,
      date: new Date(date),
      result: result ? encrypt(result) : null,
      photos: {
        create: photos.map((file: Express.Multer.File) => ({
          fileName: encrypt(file.originalname),
          mimeType: encrypt(file.mimetype),
          data: file.buffer
        }))
      }
    },
    include: { photos: true }
  })

  return { message: 'Exame criado com sucesso.', exam }
}

export const getExams = async (userId: string) => {
  const exams = await prisma.exam.findMany({
    where: { userId },
    include: { photos: true },
    orderBy: { date: 'desc' }
  })

  return exams.map(exam => ({
    ...exam,
    result: exam.result ? decrypt(exam.result) : null,
    photos: exam.photos.map(p => ({
      id: p.id,
      fileName: decrypt(p.fileName),
      mimeType: decrypt(p.mimeType),
      createdAt: p.createdAt
    }))
  }))
}

export const getExamById = async (id: string, userId: string) => {
  const exam = await prisma.exam.findUnique({
    where: { id },
    include: { photos: true }
  })

  if (!exam || exam.userId !== userId)
    throw new Error('Exame não encontrado ou acesso não autorizado.')

  return {
    ...exam,
    result: exam.result ? decrypt(exam.result) : null,
    photos: exam.photos.map(p => ({
      id: p.id,
      fileName: decrypt(p.fileName),
      mimeType: decrypt(p.mimeType),
      createdAt: p.createdAt
    }))
  }
}

export const getExamPhotoById = async (photoId: string, userId: string) => {
  const photo = await prisma.examPhoto.findUnique({
    where: { id: photoId },
    include: { exam: true }
  })

  if (!photo || photo.exam.userId !== userId) {
    throw new Error('Foto não encontrada ou acesso não autorizado.')
  }

  return {
    data: photo.data,
    mimeType: decrypt(photo.mimeType),
    fileName: decrypt(photo.fileName)
  }
}

export const updateExam = async (
  id: string,
  userId: string,
  data: Partial<ExamData>
) => {
  const existingExam = await prisma.exam.findUnique({
    where: { id },
    include: { photos: true }
  })

  if (!existingExam || existingExam.userId !== userId)
    throw new Error('Exame não encontrado ou acesso não autorizado.')

  const { photos, removePhotos, result, ...rest } = data
  const encryptedResult = result ? encrypt(result) : existingExam.result

  if (removePhotos && removePhotos.length > 0) {
    await prisma.examPhoto.deleteMany({
      where: {
        id: { in: removePhotos }
      }
    })
  }

  if (photos && photos.length > 0) {
    await prisma.examPhoto.createMany({
      data: photos.map((file: Express.Multer.File) => ({
        examId: id,
        fileName: encrypt(file.originalname),
        mimeType: encrypt(file.mimetype),
        data: file.buffer
      }))
    })
  }

  const updatedExam = await prisma.exam.update({
    where: { id },
    data: {
      ...rest,
      result: encryptedResult,
      date: data.date ? new Date(data.date) : existingExam.date
    },
    include: { photos: true }
  })

  return {
    message: 'Exame atualizado com sucesso.',
    updatedExam: {
      ...updatedExam,
      result: updatedExam.result ? decrypt(updatedExam.result) : null,
      photos: updatedExam.photos.map(p => ({
        id: p.id,
        fileName: decrypt(p.fileName),
        mimeType: decrypt(p.mimeType),
        createdAt: p.createdAt
      }))
    }
  }
}

export const deleteExam = async (id: string, userId: string) => {
  const exam = await prisma.exam.findUnique({
    where: { id },
    include: { photos: true }
  })

  if (!exam || exam.userId !== userId)
    throw new Error('Exame não encontrado ou acesso não autorizado.')

  await prisma.examPhoto.deleteMany({
    where: { examId: id }
  })

  await prisma.exam.delete({
    where: { id }
  })

  return { message: 'Exame excluído com sucesso.' }
}

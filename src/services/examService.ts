import { PrismaClient } from '@prisma/client'
import { encrypt, decrypt } from './cryptoService'
import { supabase } from '../config/supabase'

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
  if (!name || !date) {
    throw new Error('Nome e data são obrigatórios.')
  }

  const uploadedPhotos = []

  for (const file of photos) {
    const fileName = `${Date.now()}-${file.originalname}`

    const { error } = await supabase.storage
      .from('exam-photos')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype
      })

    if (error) {
      throw new Error(error.message)
    }

    const { data } = supabase.storage
      .from('exam-photos')
      .getPublicUrl(fileName)

    uploadedPhotos.push({
      fileName: encrypt(file.originalname),
      mimeType: encrypt(file.mimetype),
      url: data.publicUrl
    })
  }

  const exam = await prisma.exam.create({
    data: {
      userId,
      name,
      description,
      date: new Date(date),
      result: result ? encrypt(result) : null,
      photos: {
        create: uploadedPhotos
      }
    },
    include: {
      photos: true
    }
  })

  return {
    message: 'Exame criado com sucesso.',
    exam
  }
}

export const getExams = async (userId: string) => {
  const exams = await prisma.exam.findMany({
    where: { userId },
    include: { photos: true },
    orderBy: { date: 'desc' }
  })

  return exams.map((exam: any) => ({
    ...exam,
    result: exam.result ? decrypt(exam.result) : null,
    photos: exam.photos.map((p: any) => ({
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
    photos: exam.photos.map((p: any) => ({
      id: p.id,
      fileName: decrypt(p.fileName),
      mimeType: decrypt(p.mimeType),
      createdAt: p.createdAt
    }))
  }
}

export const getExamPhotoById = async (
  photoId: string,
  userId: string
) => {
  const photo = await prisma.examPhoto.findUnique({
    where: { id: photoId },
    include: { exam: true }
  })

  if (!photo || photo.exam.userId !== userId) {
    throw new Error('Foto não encontrada ou acesso não autorizado.')
  }

  return {
    url: photo.url,
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
    const photosToRemove = await prisma.examPhoto.findMany({
      where: {
        id: { in: removePhotos }
      }
    })

    for (const photo of photosToRemove) {
      if (photo.url) {
        const fileName = photo.url.split('/').pop()

        if (fileName) {
          await supabase.storage
            .from('exam-photos')
            .remove([fileName])
        }
      }
    }

    await prisma.examPhoto.deleteMany({
      where: {
        id: { in: removePhotos }
      }
    })
  }

  if (photos && photos.length > 0) {
    const uploadedPhotos = []

    for (const file of photos) {
      const fileName = `${Date.now()}-${file.originalname}`

      const { error } = await supabase.storage
        .from('exam-photos')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype
        })

      if (error) {
        throw new Error(error.message)
      }

      const { data } = supabase.storage
        .from('exam-photos')
        .getPublicUrl(fileName)

      uploadedPhotos.push({
        examId: id,
        fileName: encrypt(file.originalname),
        mimeType: encrypt(file.mimetype),
        url: data.publicUrl
      })
    }

    await prisma.examPhoto.createMany({
      data: uploadedPhotos
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
      result: updatedExam.result
        ? decrypt(updatedExam.result)
        : null,

      photos: updatedExam.photos.map((p: any) => ({
        id: p.id,
        fileName: decrypt(p.fileName),
        mimeType: decrypt(p.mimeType),
        url: p.url,
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

  if (!exam || exam.userId !== userId) {
    throw new Error('Exame não encontrado ou acesso não autorizado.')
  }

  for (const photo of exam.photos) {
    if (photo.url) {
      const fileName = photo.url.split('/').pop()

      if (fileName) {
        await supabase.storage
          .from('exam-photos')
          .remove([fileName])
      }
    }
  }

  await prisma.examPhoto.deleteMany({
    where: { examId: id }
  })

  await prisma.exam.delete({
    where: { id }
  })

  return {
    message: 'Exame excluído com sucesso.'
  }
}

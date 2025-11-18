import multer from 'multer'

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']

    if (!allowed.includes(file.mimetype)) {
      return cb(
        new Error('Formato de arquivo não permitido. Envie JPG, PNG ou PDF.')
      )
    }

    cb(null, true)
  }
})

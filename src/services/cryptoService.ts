import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const secretKey = crypto
  .createHash('sha256')
  .update(process.env.ENCRYPTION_KEY || '')
  .digest()

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decrypt(encryptedText: string) {
  const [ivHex, encryptedHex] = encryptedText.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv)
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ])
  return decrypted.toString('utf8')
}

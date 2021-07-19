import { scryptSync, createCipheriv, createDecipheriv } from 'crypto'

const encrypt = (password: string, salt: string) => (value: string) => {
  const key = scryptSync(password, salt, 32)
  const cipher = createCipheriv('aes-256-cbc', key, Buffer.from(Array(16).fill(0)))
  let encrypted = cipher.update(value, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

const decrypt = (password: string, salt: string) => (value: string) => {
  const key = scryptSync(password, salt, 32)
  const decipher = createDecipheriv('aes-256-cbc', key, Buffer.from(Array(16).fill(0)))
  let decrypted = decipher.update(value, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export const createCipher = (password: string, salt: string) => {
  return {
    encrypt: encrypt(password, salt),
    decrypt: decrypt(password, salt),
  }
}

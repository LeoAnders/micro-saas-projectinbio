import imageCompression from 'browser-image-compression'
import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeLink(link?: string) {
  if (!link) return ''

  return link
    .trim()
    .replace(/\s/g, '') // Remove todos os espaços
    .replace(/[!@#$%^&*()_+\-=[\]{};':"\\|,ˆ.<>/?]+/g, '')
    .toLowerCase()
}

export async function compressFiles(files: File[]) {
  const compressPromisses = files.map(async (file) => {
    try {
      return await compressImage(file)
    } catch (error) {
      console.error(error)
      return null
    }
  })

  return (await Promise.all(compressPromisses)).filter((file) => file !== null)
}

export const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const options = {
      maxSizeMB: 0.2, // 200KB
      maxWidthOrHeight: 900,
      useWebWorker: true,
      fileType: 'image/png',
    }

    imageCompression(file, options).then((compressedFile) => {
      resolve(compressedFile)
    })
  })
}

export function formatUrl(url: string) {
  const formattedUrl = url.startsWith('http') ? url : `https://${url}`
  return formattedUrl
}

export function triggerImageInput(id: string) {
  document.getElementById(id)?.click()
}

export function handleImageInput(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0] ?? null
  if (file) {
    const imageURL = URL.createObjectURL(file)
    return imageURL
  }
  return null
}

import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export const TRIAL_DAYS = 3

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

'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { auth } from '../lib/auth'
import { db } from '../lib/firebase'

export async function createLink(link: string): Promise<boolean> {
  if (!link || typeof link !== 'string' || link.trim() === '') {
    console.error('Link inválido fornecido.')
    return false
  }

  const session = await auth()

  if (!session?.user) {
    return false
  }

  try {
    await db.collection('profiles').doc(link).set({
      userId: session.user.id,
      totalVisits: 0,
      createdAt: Timestamp.now().toMillis(),
    })

    return true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    return false
  }
}

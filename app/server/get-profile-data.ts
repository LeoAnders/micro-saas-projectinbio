'use server'

import { db } from '../lib/firebase'

export type ProfileData = {
  userId: string
  totalVisits: number
  createdAt: number
}

export async function getProfileData(profileId: string) {
  // TODO: verificar se o link existe
  const snapshot = await db.collection('profiles').doc(profileId).get()

  return snapshot.data() as ProfileData
}

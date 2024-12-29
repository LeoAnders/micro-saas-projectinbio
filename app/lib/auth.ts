import NextAuth from 'next-auth'
import { FirestoreAdapter } from '@auth/firebase-adapter'
import { firebaseCert } from './firebase'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: FirestoreAdapter({
    credential: firebaseCert,
  }),
  providers: [Google],
})

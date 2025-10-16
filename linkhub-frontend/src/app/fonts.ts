// src/app/fonts.ts
import { Inter, Plus_Jakarta_Sans, Sora, Space_Grotesk } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
})

export const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
})

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})
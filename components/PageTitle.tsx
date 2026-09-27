'use client'

import { ReactNode } from 'react'
import { motion } from 'motion/react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <motion.h1
      className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-gray-100"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.h1>
  )
}

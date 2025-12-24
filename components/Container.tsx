import type { ReactNode } from 'react'

export function Container({
  children,
  as: Component = 'section',
  className,
}: {
  children: ReactNode
  as?: React.ElementType
  className?: string
}) {
  return (
    <Component
      className={
        'mx-auto w-full max-w-6xl px-4 sm:px-6 xl:px-12' + (className ? ` ${className}` : '')
      }
    >
      {children}
    </Component>
  )
}

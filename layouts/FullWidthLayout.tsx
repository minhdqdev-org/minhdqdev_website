import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function FullWidthLayout({ children }: Props) {
  return <div className="w-full">{children}</div>
}

import React from 'react'
import { twMerge } from 'tailwind-merge'

type Props = React.HTMLAttributes<HTMLDivElement>

export function SketchCard({ className, children, ...rest }: Props) {
  const base = 'bg-white border-2 border-black rounded-none p-6'
  return (
    <div className={twMerge(base, className)} {...rest}>
      {children}
    </div>
  )
}
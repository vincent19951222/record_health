import React from 'react'
import { twMerge } from 'tailwind-merge'

type Props = React.HTMLAttributes<HTMLSpanElement>

export function SketchTag({ className, children, ...rest }: Props) {
  const base = 'inline-block px-2 py-1 text-xs uppercase border-2 border-black rounded-none bg-white text-black'
  return (
    <span className={twMerge(base, className)} {...rest}>
      {children}
    </span>
  )
}
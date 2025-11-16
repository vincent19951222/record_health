import React from 'react'
import { twMerge } from 'tailwind-merge'

type Props = React.SelectHTMLAttributes<HTMLSelectElement>

export function SketchSelect({ className, children, ...rest }: Props) {
  const base = 'w-full px-3 py-2 bg-white border-2 border-black rounded-none focus:outline-none'
  return (
    <select className={twMerge(base, className)} {...rest}>
      {children}
    </select>
  )
}
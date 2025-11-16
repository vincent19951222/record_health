import React from 'react'
import { twMerge } from 'tailwind-merge'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'highlight'
}

export function SketchButton({ variant = 'default', className, children, ...rest }: Props) {
  const base = 'inline-flex items-center justify-center px-3 py-2 border-2 border-black bg-white text-black uppercase rounded-none transition duration-75 hover:bg-gray-100 active:translate-y-[1px]'
  const v =
    variant === 'primary'
      ? 'bg-[#50A7C2]'
      : variant === 'highlight'
      ? 'bg-[#FBCB2D]'
      : ''
  return (
    <button className={twMerge(base, v, className)} {...rest}>
      {children}
    </button>
  )
}
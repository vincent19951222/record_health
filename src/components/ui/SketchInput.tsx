import React from 'react'
import { twMerge } from 'tailwind-merge'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export function SketchInput({ className, ...rest }: Props) {
  const base = 'w-full px-3 py-2 bg-white border-2 border-black rounded-none focus:outline-none focus:ring-0'
  return <input className={twMerge(base, className)} {...rest} />
}
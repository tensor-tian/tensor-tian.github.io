import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const HeightReg = /h-\[(\d+)px\]/
export function maxHeight(cls?: string): number {
  if (!cls) return -1
  for (const c of cls.split(" ")) {
    const ret = c.match(HeightReg)
    if (ret) {
      return parseInt(ret[1], 10)
    }
  }
  return -1
}

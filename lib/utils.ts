
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export function formatHeaderTitle(key: string): string {
  return key
    // insert space before capital letters
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    // handle numbers inside words (10Pcs → 10 Pcs)
    .replace(/(\d+)([A-Za-z])/g, "$1 $2")
    // capitalize first letter of each word
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

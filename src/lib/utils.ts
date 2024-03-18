import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function RNN(a:string) {
  const regex1 = /^[\u4e00-\u9fa5]/
  const regex2 = /[\u4e00-\u9fa5][0-9]/
  const regex3 = /[\u4e00-\u9fa5A-Z()]/g
  return a.replace(regex1, "").replace(regex2, "").replace(regex3, "")
}

export function LinearToArray(positionStr: string) {
  const regex = /[A-Z()]/g;
  const positionArr = positionStr
    ?.replace(regex, "")
    .split(",")
    .map((f) =>
      f
        .split(" ")
        .reverse()
        .map((item) => Number(item))
    ) as [number, number][];
    return positionArr
}

export const dayOfAWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
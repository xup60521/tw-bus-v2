'use client'

import { useRouter, useSearchParams } from "next/navigation"

export type SetURLSearchParamsInputProps = {
    "key": string,
    "value": string
}

export function useSetURLSearchParams() {
    const searchParams = useSearchParams()
    const router = useRouter()
    return function useSetURLSearchParams(prop: SetURLSearchParamsInputProps) {
        const url = new URLSearchParams(searchParams.toString())
        url.set(prop.key, prop.value)
        router.push(`?${url.toString()}`)
    }
}
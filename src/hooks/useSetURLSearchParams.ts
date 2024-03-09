'use client'

import { useRouter, useSearchParams } from "next/navigation"

export type SetURLSearchParamsInputProps = {
    key: string,
    value: string
}

export function useSetURLSearchParams() {
    const searchParams = useSearchParams()
    const router = useRouter()
    return function useSetURLSearchParams(list: SetURLSearchParamsInputProps[]) {
        const url = new URLSearchParams(searchParams.toString())
        list.forEach((item) => {
            url.set(item.key, item.value)
        })
        router.push(`?${url.toString()}`)
    }
}
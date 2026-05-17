import type { ReactNode } from "react"

export type Review = {
    userId: number;
    nickName: string
    description: ReactNode
    userImage?: string | null
    rating?: number
    date?: string
    images?: string[]
    bgImage?: string
}

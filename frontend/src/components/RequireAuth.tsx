'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const { isLoggedIn } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login')
        }
    }, [isLoggedIn, router])

    if (!isLoggedIn) {
        return <p>リダイレクト中...</p>
    }

    return <>{children}</>  // <>...</> はフラグメント：余分なDOM要素を作らずに複数要素をまとめる
}

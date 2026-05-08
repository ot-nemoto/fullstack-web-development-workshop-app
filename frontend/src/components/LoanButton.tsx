'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createLoan } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

interface LoanButtonProps {
    bookId: number
    availableCount: number
}

export default function LoanButton({ bookId, availableCount }: LoanButtonProps) {
    const { isLoggedIn } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isLoggedIn) {
        return <p className="text-sm text-gray-500">貸出にはログインが必要です</p>
    }

    async function handleLoan() {
        setError('')

        // 返却期限を2週間後に設定する
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 14)  // setDate で日付を変更する
        const dueDateStr = dueDate.toISOString().split('T')[0]
        // toISOString() は "2026-05-01T00:00:00.000Z" 形式の文字列を返す
        // split('T')[0] で日付部分だけを取り出す

        setIsLoading(true)
        try {
            await createLoan(bookId, dueDateStr)
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : '貸出に失敗しました')
            // instanceof はオブジェクトが特定のクラスのインスタンスか確認する
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
                onClick={handleLoan}
                disabled={availableCount === 0 || isLoading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? '処理中...' : availableCount > 0 ? '借りる' : '貸出中'}
            </button>
        </div>
    )
}

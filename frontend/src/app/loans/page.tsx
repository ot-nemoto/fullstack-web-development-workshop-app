'use client'

import { useEffect, useState, useCallback } from 'react'
import { getMyLoans } from '@/lib/api'
import { Loan } from '@/types'
import RequireAuth from '@/components/RequireAuth'
import LoanList from '@/components/LoanList'

export default function LoansPage() {
    const [loans, setLoans] = useState<Loan[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchLoans = useCallback(async () => {
        // useCallback: 関数をメモ化し、依存配列が変わらない限り同じ関数参照を返す
        // useEffect の依存配列に関数を含める際、毎レンダリングで関数が再作成されるのを防ぐ
        try {
            const data = await getMyLoans()
            setLoans(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : '取得に失敗しました')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchLoans()
    }, [fetchLoans])

    return (
        <RequireAuth>
            <main className="container mx-auto p-8 max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">貸出履歴</h1>
                {isLoading && <p>読み込み中...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!isLoading && !error && (
                    <LoanList loans={loans} onUpdate={fetchLoans} />
                )}
            </main>
        </RequireAuth>
    )
}

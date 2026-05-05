'use client'

import { useEffect, useState } from 'react'
import { getMyLoans } from '@/lib/api'
import RequireAuth from '@/components/RequireAuth'
import LoanList from '@/components/LoanList'
import { Loan } from '@/types'

export default function LoansPage() {
    const [loans, setLoans] = useState<Loan[]>([])

    useEffect(() => {
        getMyLoans().then(setLoans)
    }, [])
    // [] は「マウント時に1度だけ実行」を意味する

    return (
        <RequireAuth>
            <main className="container mx-auto p-8">
                <h1 className="text-2xl font-bold mb-6">貸出履歴</h1>
                <LoanList loans={loans} />
            </main>
        </RequireAuth>
    )
}

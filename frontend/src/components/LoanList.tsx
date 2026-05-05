'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loan } from '@/types'
import { returnBook } from '@/lib/api'

interface LoanListProps {
    loans: Loan[]
}

function isOverdue(loan: Loan): boolean {
    if (loan.status !== 'active') return false  // 返却済みは延滞ではない
    const today = new Date()
    today.setHours(0, 0, 0, 0)  // 時刻を00:00:00にリセットして日付のみで比較する
    const dueDate = new Date(loan.due_date)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today  // 返却期限が今日より前なら延滞
}

export default function LoanList({ loans }: LoanListProps) {
    const router = useRouter()
    const [returningId, setReturningId] = useState<number | null>(null)

    async function handleReturn(loanId: number) {
        setReturningId(loanId)
        try {
            await returnBook(loanId)
            router.refresh()
        } catch {
            alert('返却に失敗しました')
        } finally {
            setReturningId(null)
        }
    }

    const activeLoans = loans.filter((loan) => loan.status === 'active')
    const returnedLoans = loans.filter((loan) => loan.status === 'returned')

    return (
        <div className="space-y-8">
            <section>
                <h2 className="text-xl font-semibold mb-4">貸出中（{activeLoans.length}冊）</h2>
                {activeLoans.length === 0 ? (
                    <p className="text-gray-500">貸出中の本はありません</p>
                ) : (
                    <div className="space-y-3">
                        {activeLoans.map((loan) => {
                            const overdue = isOverdue(loan)
                            return (
                                <div
                                    key={loan.id}
                                    className={`border rounded-lg p-4 ${overdue ? 'border-red-300 bg-red-50' : ''}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{loan.book_detail.title}</p>
                                            <p className="text-sm text-gray-500">
                                                返却期限: {loan.due_date}
                                            </p>
                                            {overdue && (
                                                <p className="text-red-500 text-sm font-medium">
                                                    ⚠️ 延滞中
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleReturn(loan.id)}
                                            disabled={returningId === loan.id}
                                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                                        >
                                            {returningId === loan.id ? '処理中...' : '返却する'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">返却済み（{returnedLoans.length}冊）</h2>
                {returnedLoans.length === 0 ? (
                    <p className="text-gray-500">返却済みの本はありません</p>
                ) : (
                    <div className="space-y-3">
                        {returnedLoans.map((loan) => (
                            <div key={loan.id} className="border rounded-lg p-4 bg-gray-50">
                                <p className="font-medium">{loan.book_detail.title}</p>
                                <p className="text-sm text-gray-500">
                                    貸出日: {loan.loan_date} ／ 返却日: {loan.return_date}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

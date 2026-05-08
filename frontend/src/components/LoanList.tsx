'use client'

import { returnBook } from '@/lib/api'
import { Loan } from '@/types'

interface LoanListProps {
    loans: Loan[]
    onUpdate: () => void
}

// 延滞チェック関数：status が active かつ due_date が今日より前なら延滞
function isOverdue(loan: Loan): boolean {
    if (loan.status !== 'active') return false
    const today = new Date().toISOString().split('T')[0]  // "2026-05-08" 形式
    return loan.due_date < today
}

export default function LoanList({ loans, onUpdate }: LoanListProps) {
    const activeLoans = loans.filter((loan) => loan.status === 'active')
    const returnedLoans = loans.filter((loan) => loan.status === 'returned')

    async function handleReturn(loanId: number) {
        try {
            await returnBook(loanId)
            onUpdate()  // 親コンポーネントに再取得を依頼する
        } catch (err) {
            alert(err instanceof Error ? err.message : '返却に失敗しました')
        }
    }

    return (
        <div className="space-y-8">
            {/* 貸出中セクション */}
            <section>
                <h2 className="text-xl font-bold mb-4">貸出中（{activeLoans.length}冊）</h2>
                {activeLoans.length === 0 ? (
                    <p className="text-gray-500">貸出中の本はありません</p>
                ) : (
                    <ul className="space-y-3">
                        {activeLoans.map((loan) => (
                            <li
                                key={loan.id}
                                className={`border rounded-lg p-4 flex justify-between items-center ${
                                    isOverdue(loan) ? 'bg-red-50 border-red-300' : ''
                                }`}
                            >
                                <div>
                                    <p className="font-medium">{loan.book_detail.title}</p>
                                    <p className="text-sm text-gray-500">返却期限：{loan.due_date}</p>
                                    {isOverdue(loan) && (
                                        <p className="text-sm text-red-600 font-bold">⚠️ 延滞中</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleReturn(loan.id)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    返却する
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* 返却済みセクション */}
            <section>
                <h2 className="text-xl font-bold mb-4">返却済み（{returnedLoans.length}冊）</h2>
                {returnedLoans.length === 0 ? (
                    <p className="text-gray-500">返却済みの本はありません</p>
                ) : (
                    <ul className="space-y-3">
                        {returnedLoans.map((loan) => (
                            <li key={loan.id} className="border rounded-lg p-4 bg-gray-50">
                                <p className="font-medium">{loan.book_detail.title}</p>
                                <p className="text-sm text-gray-500">返却日：{loan.return_date}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}

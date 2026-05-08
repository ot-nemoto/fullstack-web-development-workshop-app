'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteBook } from '@/lib/api'

interface DeleteButtonProps {
    bookId: number
    bookTitle: string
}

export default function DeleteButton({ bookId, bookTitle }: DeleteButtonProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete() {
        const confirmed = window.confirm(`「${bookTitle}」を削除しますか？この操作は取り消せません。`)
        // window.confirm はブラウザの確認ダイアログを表示し、OKなら true を返す
        if (!confirmed) return

        setIsDeleting(true)
        try {
            await deleteBook(bookId)
            router.push('/books')
            router.refresh()  // 一覧ページのキャッシュをクリアして最新データを取得する
        } catch {
            alert('削除に失敗しました')
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
            {isDeleting ? '削除中...' : '削除'}
        </button>
    )
}

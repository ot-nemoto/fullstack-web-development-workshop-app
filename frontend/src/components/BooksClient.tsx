'use client'

import { useState } from 'react'
import { Book } from '@/types'
import BookCard from '@/components/BookCard'

interface BooksClientProps {
    books: Book[]  // Server Componentから受け取る本の一覧
}

export default function BooksClient({ books }: BooksClientProps) {
    const [showAvailableOnly, setShowAvailableOnly] = useState(false)

    const filteredBooks = showAvailableOnly
        ? books.filter((book) => book.available_count > 0)
        // .filter() は配列から条件に合う要素だけを取り出して新しい配列を返す
        : books

    return (
        <>
            <label className="flex items-center gap-2 mb-4">
                <input
                    type="checkbox"
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    // onChange はチェック状態が変わったときに実行する
                />
                貸出可能のみ表示
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </>
    )
}

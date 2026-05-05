'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getBook, getCategories, updateBook } from '@/lib/api'
import BookForm from '@/components/BookForm'
import RequireAuth from '@/components/RequireAuth'
import { Book, Category } from '@/types'

export default function EditBookPage() {
    const params = useParams()
    const id = Number(params.id)
    const [book, setBook] = useState<Book | null>(null)
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        Promise.all([getBook(id), getCategories()]).then(([b, c]) => {
            setBook(b)
            setCategories(c)
        })
    }, [id])

    if (!book) return <p className="container mx-auto p-8">読み込み中...</p>

    return (
        <RequireAuth>
            <main className="container mx-auto p-8 max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">本の編集</h1>
                <BookForm
                    initialData={book}
                    categories={categories}
                    onSubmit={(data) => updateBook(id, data)}
                    submitLabel="更新する"
                />
            </main>
        </RequireAuth>
    )
}

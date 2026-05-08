'use client'

import { useState, useEffect } from 'react'
import { getCategories, createBook } from '@/lib/api'
import BookForm from '@/components/BookForm'
import { Category } from '@/types'

export default function NewBookPage() {
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        getCategories().then(setCategories)
    }, [])

    return (
        <main className="container mx-auto p-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">本の新規登録</h1>
            <BookForm
                categories={categories}
                onSubmit={async (data) => { await createBook(data) }}
                submitLabel="登録する"
            />
        </main>
    )
}

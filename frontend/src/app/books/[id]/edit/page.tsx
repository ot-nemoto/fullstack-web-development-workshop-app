import { getBook, getCategories, updateBook } from '@/lib/api'
import BookForm from '@/components/BookForm'
import { Book } from '@/types'

interface EditBookPageProps {
    params: Promise<{ id: string }>
}

export default async function EditBookPage({ params }: EditBookPageProps) {
    const { id } = await params
    const [book, categories] = await Promise.all([
        getBook(Number(id)),
        getCategories(),
    ])
    // Promise.all は複数の非同期処理を並列で実行して、すべて完了するまで待つ

    async function handleUpdate(data: Omit<Book, 'id'>) {
        'use server'
        await updateBook(Number(id), data)
    }

    return (
        <main className="container mx-auto p-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">本の編集</h1>
            <BookForm
                initialData={book}
                categories={categories}
                onSubmit={handleUpdate}
                submitLabel="更新する"
            />
        </main>
    )
}

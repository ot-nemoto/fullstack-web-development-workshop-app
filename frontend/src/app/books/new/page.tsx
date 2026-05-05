import RequireAuth from '@/components/RequireAuth'
import { getCategories, createBook } from '@/lib/api'
import BookForm from '@/components/BookForm'

export default async function NewBookPage() {
    const categories = await getCategories()

    return (
        <RequireAuth>
            <main className="container mx-auto p-8 max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">本の新規登録</h1>
                <BookForm
                    categories={categories}
                    onSubmit={createBook}
                    submitLabel="登録する"
                />
            </main>
        </RequireAuth>
    )
}

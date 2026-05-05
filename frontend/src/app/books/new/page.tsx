import { getCategories, createBook } from '@/lib/api'
import BookForm from '@/components/BookForm'
import { Book } from '@/types'

export default async function NewBookPage() {
    const categories = await getCategories()

    async function handleCreate(data: Omit<Book, 'id'>) {
        'use server'
        await createBook(data)
    }
    // Server Component から Client Component（BookForm）へ関数を props で渡す場合、
    // 'use server' を宣言した Server Action でなければならない

    return (
        <main className="container mx-auto p-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">本の新規登録</h1>
            <BookForm
                categories={categories}
                onSubmit={handleCreate}
                submitLabel="登録する"
            />
        </main>
    )
}

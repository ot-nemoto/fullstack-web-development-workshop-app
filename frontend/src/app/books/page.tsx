import Link from 'next/link'
import { getBooks } from '@/lib/api'
import BooksClient from '@/components/BooksClient'

export const dynamic = 'force-dynamic'

export default async function BooksPage() {
    const books = await getBooks()
    return (
        <main className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">本の一覧</h1>
                <Link
                    href="/books/new"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    新規登録
                </Link>
            </div>
            <BooksClient books={books} />
        </main>
    )
}

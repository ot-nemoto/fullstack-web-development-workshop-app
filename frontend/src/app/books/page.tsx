import Link from 'next/link'
import { getBooks } from '@/lib/api'
import BookCard from '@/components/BookCard'

export default async function BooksPage() {
    const books = await getBooks()  // Chapter 8で作ったAPI呼び出し関数

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </main>
    )
}

import { getBooks } from '@/lib/api'
import BookCard from '@/components/BookCard'

export default async function BooksPage() {
    const books = await getBooks()
    return (
        <main className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">本の一覧</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </main>
    )
}

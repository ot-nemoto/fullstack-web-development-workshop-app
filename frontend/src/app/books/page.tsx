import { mockBooks } from '@/data/mockBooks'
import BookCard from '@/components/BookCard'

export default function BooksPage() {
    return (
        <main className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">本の一覧</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockBooks.map((book) => (
                    // .map() は配列の各要素に対して処理を実行して新しい配列を返す
                    <BookCard key={book.id} book={book} />
                    // key はReactがリスト要素を識別するために必要な一意の値
                ))}
            </div>
        </main>
    )
}

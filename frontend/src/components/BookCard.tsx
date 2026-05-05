import Link from 'next/link'
import { Book } from '@/types'

interface BookCardProps {
    book: Book
}

export default function BookCard({ book }: BookCardProps) {
    return (
        <Link href={`/books/${book.id}`} className="block">
            {/* テンプレートリテラル：${} の中に変数を埋め込める */}
            <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-lg font-bold">{book.title}</h2>
                <p className="text-gray-600">{book.author}</p>
                <p className="text-sm text-gray-500">{book.publisher}</p>
                <div className="mt-2">
                    {book.available_count > 0 ? (
                        <span className="text-green-600 text-sm">
                            貸出可能（{book.available_count}冊）
                        </span>
                    ) : (
                        <span className="text-red-500 text-sm">貸出中</span>
                    )}
                </div>
            </div>
        </Link>
    )
}

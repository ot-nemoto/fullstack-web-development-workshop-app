import { Book } from '@/types'

interface BookCardProps {
    book: Book
}

export default function BookCard({ book }: BookCardProps) {
    return (
        <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-bold">{book.title}</h2>
            <p className="text-gray-600">{book.author}</p>
            <p className="text-sm text-gray-500">{book.publisher}</p>
            <div className="mt-2">
                {book.available_count > 0 ? (
                    <span className="text-green-600">貸出可能（{book.available_count}冊）</span>
                ) : (
                    <span className="text-red-500">貸出中</span>
                )}
                {/* 三項演算子: 条件 ? 真のとき : 偽のとき */}
            </div>
        </div>
    )
}

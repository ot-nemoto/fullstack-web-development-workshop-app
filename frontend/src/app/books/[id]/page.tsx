import Link from 'next/link'
import { getBook } from '@/lib/api'
import DeleteButton from '@/components/DeleteButton'
import LoanButton from '@/components/LoanButton'

export const dynamic = 'force-dynamic'  // APIフェッチがあるため静的プリレンダリングを無効化する

interface BookDetailPageProps {
    params: Promise<{ id: string }>  // paramsはURLパラメータを含むオブジェクト
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
    const { id } = await params
    const book = await getBook(Number(id))  // Number() は文字列を数値に変換する

    return (
        <main className="container mx-auto p-8 max-w-2xl">
            <div className="mb-4">
                <Link href="/books" className="text-blue-500 hover:underline">
                    ← 一覧に戻る
                </Link>
            </div>
            <div className="border rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
                <dl className="space-y-2">
                    <div className="flex gap-4">
                        <dt className="text-gray-500 w-24">著者</dt>
                        <dd>{book.author}</dd>
                    </div>
                    <div className="flex gap-4">
                        <dt className="text-gray-500 w-24">出版社</dt>
                        <dd>{book.publisher}</dd>
                    </div>
                    <div className="flex gap-4">
                        <dt className="text-gray-500 w-24">ISBN</dt>
                        <dd>{book.isbn}</dd>
                    </div>
                    <div className="flex gap-4">
                        <dt className="text-gray-500 w-24">貸出可能数</dt>
                        <dd>{book.available_count}冊</dd>
                    </div>
                </dl>
                <div className="flex gap-4 mt-6 items-center">
                    <LoanButton bookId={book.id} availableCount={book.available_count} />
                    <Link
                        href={`/books/${book.id}/edit`}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        編集
                    </Link>
                    <DeleteButton bookId={book.id} bookTitle={book.title} />
                </div>
            </div>
        </main>
    )
}

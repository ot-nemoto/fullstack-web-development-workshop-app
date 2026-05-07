'use client'  // error.tsx は Client Component でなければならない

interface ErrorProps {
    error: Error
    reset: () => void  // () => void は引数なし・戻り値なしの関数型
}

export default function Error({ error, reset }: ErrorProps) {
    return (
        <main className="container mx-auto p-8">
            <h2 className="text-red-500 font-bold">エラーが発生しました</h2>
            <p className="text-gray-600">{error.message}</p>
            <button
                onClick={reset}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                再試行する
            </button>
        </main>
    )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Book, Category } from '@/types'

interface BookFormProps {
    initialData?: Partial<Book>      // 編集時は既存データを渡す（登録時はundefined）
    categories: Category[]
    onSubmit: (data: Omit<Book, 'id'>) => Promise<void>
    submitLabel: string
}

export default function BookForm({
    initialData,
    categories,
    onSubmit,
    submitLabel,
}: BookFormProps) {
    const router = useRouter()  // ページ遷移に使う
    const [title, setTitle] = useState(initialData?.title ?? '')
    // ?. はオプショナルチェーン：initialDataがundefinedのとき .title を参照せずundefinedを返す
    // ?? はNull合体演算子：左辺がnullまたはundefinedのとき右辺を返す
    const [author, setAuthor] = useState(initialData?.author ?? '')
    const [publisher, setPublisher] = useState(initialData?.publisher ?? '')
    const [isbn, setIsbn] = useState(initialData?.isbn ?? '')
    const [category, setCategory] = useState<number | null>(initialData?.category ?? null)
    const [availableCount, setAvailableCount] = useState(initialData?.available_count ?? 1)
    const [errors, setErrors] = useState<Record<string, string>>({})
    // Record<string, string> はキーも値も文字列のオブジェクト型
    const [isSubmitting, setIsSubmitting] = useState(false)

    function validate(): boolean {  // boolean 型を返す関数
        const newErrors: Record<string, string> = {}
        if (!title) newErrors.title = 'タイトルは必須です'
        if (!author) newErrors.author = '著者は必須です'
        if (!publisher) newErrors.publisher = '出版社は必須です'
        if (!isbn) newErrors.isbn = 'ISBNは必須です'
        if (!/^\d{13}$/.test(isbn)) newErrors.isbn = 'ISBNは13桁の数字で入力してください'
        // /^\d{13}$/ は正規表現：13桁の数字かどうかを検証する
        if (availableCount < 0) newErrors.availableCount = '0以上の数値を入力してください'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0  // エラーがなければtrue
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()  // フォームのデフォルト動作（ページリロード）を防ぐ
        if (!validate()) return
        setIsSubmitting(true)
        try {
            await onSubmit({ title, author, publisher, isbn, category, available_count: availableCount })
            router.push('/books')  // 登録・更新後に一覧ページへ遷移する
        } catch (error) {
            setErrors({ form: '保存に失敗しました。もう一度お試しください。' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && <p className="text-red-500">{errors.form}</p>}

            <div>
                <label className="block text-sm font-medium mb-1">タイトル</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">著者</label>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                {errors.author && <p className="text-red-500 text-sm">{errors.author}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">出版社</label>
                <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                {errors.publisher && <p className="text-red-500 text-sm">{errors.publisher}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">ISBN（13桁）</label>
                <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                {errors.isbn && <p className="text-red-500 text-sm">{errors.isbn}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">カテゴリ</label>
                <select
                    value={category ?? ''}
                    onChange={(e) => setCategory(e.target.value ? Number(e.target.value) : null)}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="">未選択</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">貸出可能冊数</label>
                <input
                    type="number"
                    value={availableCount}
                    onChange={(e) => setAvailableCount(Number(e.target.value))}
                    min={0}
                    className="w-full border rounded px-3 py-2"
                />
                {errors.availableCount && (
                    <p className="text-red-500 text-sm">{errors.availableCount}</p>
                )}
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {isSubmitting ? '保存中...' : submitLabel}
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/books')}
                    className="px-6 py-2 border rounded hover:bg-gray-50"
                >
                    キャンセル
                </button>
            </div>
        </form>
    )
}

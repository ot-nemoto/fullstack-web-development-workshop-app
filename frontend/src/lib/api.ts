import { Book, Category } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getBooks(): Promise<Book[]> {
    // Promise<Book[]> はこの関数がBook配列を返す非同期処理であることを示す型注釈
    const res = await fetch(`${API_URL}/api/books/`)
    if (!res.ok) {  // ok は HTTPステータスが 200〜299 のとき true になる
        throw new Error(`APIエラー: ${res.status}`)
    }
    return res.json()
}

export async function getBook(id: number): Promise<Book> {
    const res = await fetch(`${API_URL}/api/books/${id}/`)
    if (!res.ok) {
        throw new Error(`APIエラー: ${res.status}`)
    }
    return res.json()
}

export async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_URL}/api/categories/`)
    if (!res.ok) {
        throw new Error(`APIエラー: ${res.status}`)
    }
    return res.json()
}

export async function createBook(data: Omit<Book, 'id'>): Promise<Book> {
    // Omit<Book, 'id'> は Book型から id を除いた型（新規作成時はidがまだない）
    const res = await fetch(`${API_URL}/api/books/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),  // JSON.stringify はJavaScriptオブジェクトをJSON文字列に変換する
    })
    if (!res.ok) {
        throw new Error(`APIエラー: ${res.status}`)
    }
    return res.json()
}

export async function updateBook(id: number, data: Partial<Book>): Promise<Book> {
    // Partial<Book> はBookの全プロパティをオプショナル（省略可能）にした型
    const res = await fetch(`${API_URL}/api/books/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error(`APIエラー: ${res.status}`)
    }
    return res.json()
}

export async function deleteBook(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/api/books/${id}/`, {
        method: 'DELETE',
    })
    if (!res.ok) {
        throw new Error(`APIエラー: ${res.status}`)
    }
}

export interface Category {  // exportで他のファイルからimportできるようにする
    id: number
    name: string
}

export interface Book {
    id: number
    title: string
    author: string
    publisher: string
    isbn: string
    category: number | null
    available_count: number
}

export interface Loan {
    id: number
    book: number
    book_detail: Book  // LoanSerializer が BookSerializer をネストして返す詳細情報
    user: number
    loan_date: string
    due_date: string
    return_date: string | null
    status: 'active' | 'returned'  // 文字列リテラル型：この2つの文字列しか入らない
}

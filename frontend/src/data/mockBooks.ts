import { Book } from '@/types'  // @/ は src/ ディレクトリへのエイリアス（別名）

export const mockBooks: Book[] = [
    {
        id: 1,
        title: '実践フルスタックWeb開発ワークショップ',
        author: '山田太郎',
        publisher: '技術出版社',
        isbn: '9784000000010',
        category: 1,
        available_count: 3,
    },
    {
        id: 2,
        title: 'データベース設計入門',
        author: '鈴木花子',
        publisher: '学習出版社',
        isbn: '9784000000027',
        category: 1,
        available_count: 0,
    },
    {
        id: 3,
        title: 'Pythonプログラミング',
        author: '佐藤次郎',
        publisher: '技術出版社',
        isbn: '9784000000034',
        category: 1,
        available_count: 2,
    },
]

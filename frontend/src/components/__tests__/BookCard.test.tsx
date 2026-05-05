import { render, screen } from '@testing-library/react'
// render: コンポーネントをテスト用DOMにレンダリングする
// screen: レンダリング結果からDOM要素を検索する
import BookCard from '../BookCard'
import { Book } from '@/types'

const mockBook: Book = {
    id: 1,
    title: 'テスト本のタイトル',
    author: 'テスト著者',
    publisher: 'テスト出版社',
    isbn: '9784000000001',
    category: 1,
    available_count: 3,
}

describe('BookCard', () => {    // describe はテストのグループをまとめる

    it('タイトルと著者名が表示される', () => {
        render(<BookCard book={mockBook} />)
        expect(screen.getByText('テスト本のタイトル')).toBeInTheDocument()
        // expect(...).toBeInTheDocument() はその要素がDOMに存在するか検証する
        expect(screen.getByText('テスト著者')).toBeInTheDocument()
    })

    it('貸出可能冊数が1以上のとき「貸出可能」と表示される', () => {
        render(<BookCard book={mockBook} />)
        expect(screen.getByText(/貸出可能/)).toBeInTheDocument()
        // /貸出可能/ は正規表現：「貸出可能」を含むテキストにマッチする
    })

    it('貸出可能冊数が0のとき「貸出中」と表示される', () => {
        render(<BookCard book={{ ...mockBook, available_count: 0 }} />)
        // スプレッド構文 {...mockBook} でオブジェクトを展開し、available_count だけ上書きする
        expect(screen.getByText('貸出中')).toBeInTheDocument()
    })
})

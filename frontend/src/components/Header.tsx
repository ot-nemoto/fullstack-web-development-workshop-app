'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
    const { isLoggedIn, logout } = useAuth()
    const router = useRouter()

    function handleLogout() {
        logout()
        router.push('/login')
    }

    return (
        <header className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    図書館貸出システム
                </Link>
                <nav className="flex gap-4 items-center">
                    <Link href="/books" className="hover:underline">本の一覧</Link>
                    {isLoggedIn && (
                        <Link href="/loans" className="hover:underline">貸出履歴</Link>
                    )}
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="hover:underline">
                            ログアウト
                        </button>
                    ) : (
                        <Link href="/login" className="hover:underline">ログイン</Link>
                    )}
                </nav>
            </div>
        </header>
    )
}

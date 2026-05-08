import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import './globals.css'

export const metadata: Metadata = {
    title: '図書館貸出システム',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja">
            <body>
                <AuthProvider>
                    <Header />
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}

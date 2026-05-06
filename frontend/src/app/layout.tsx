import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: '図書館貸出システム',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja">
            <body>
                {children}
            </body>
        </html>
    )
}

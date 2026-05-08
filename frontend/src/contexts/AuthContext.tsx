'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// createContext: コンテキストを作成する
// useContext: コンテキストの値を読み取る
// ReactNode: Reactコンポーネントを受け取る型
import { loginUser, logoutUser, getAccessToken } from '@/lib/api'

interface AuthContextType {
    isLoggedIn: boolean
    login: (username: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        // useEffect: コンポーネントのマウント時に実行される処理を定義する
        // ページ読み込み時にトークンが存在するかチェックする
        setIsLoggedIn(!!getAccessToken())  // !! は値をboolean に変換する
    }, [])  // [] は依存配列：空の場合はマウント時のみ実行される

    async function login(username: string, password: string) {
        await loginUser(username, password)
        setIsLoggedIn(true)
    }

    function logout() {
        logoutUser()
        setIsLoggedIn(false)
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth は AuthProvider の内側で使ってください')
    }
    return context
}

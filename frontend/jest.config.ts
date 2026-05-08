import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
    testEnvironment: 'jsdom',            // ブラウザ相当のDOM環境でテストを実行する
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],  // テスト環境セットアップ後に読み込むファイル
}

export default createJestConfig(config)

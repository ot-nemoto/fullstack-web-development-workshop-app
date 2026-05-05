'use client'  // useStateはClient Componentでしか使えないため宣言が必要

import { useState } from 'react'  // reactからuseStateを読み込む

export default function Counter() {
    const [count, setCount] = useState(0)
    // useState(初期値) は [現在の値, 値を更新する関数] を返す

    return (
        <div>
            <p>カウント：{count}</p>
            <button onClick={() => setCount(count + 1)}>
                {/* onClick はクリック時に実行する関数を指定する */}
                +1
            </button>
        </div>
    )
}

export default async function Home() {
  // export default: このファイルの主要な関数として外部に公開する
  // async: 非同期処理（APIの呼び出し等）を含む関数の宣言

  const res = await fetch('http://backend:8000/api/hello/')
  // const: 再代入しない変数の宣言
  // await: 非同期処理の完了を待ってから次の行に進む

  const data = await res.json()
  // res.json() はレスポンスのボディをJavaScriptのオブジェクトに変換する

  return (
    <main>
      <h1>{data.message}</h1>
      {/* JSXでは {} の中にJavaScriptの値を埋め込める */}
    </main>
  )
}

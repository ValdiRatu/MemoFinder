import Editor from '@monaco-editor/react'
import { useEffect, useState } from 'react'

import { useData } from '../contexts/DataContext'

export const CodeEditor = () => {
  const { insights } = useData()
  const [code, setCode] = useState(
    'def fib(n):\n\tif n == 0:\n\t\treturn 1\n\tif n == 1:\n\t\treturn 1\n\treturn fib(n - 1) + fib(n - 2)'
  )

  useEffect(() => {
    if (insights.length > 0) {
      const { lines } = insights[0]
      // add message before each line in lines
      const codeLines = code.split('\n')
      for (let i = 0; i < codeLines.length; i++) {
        if (lines.includes(i + 1)) {
          const tabs = codeLines[i].match(/^\s*/)?.[0] ?? ''
          codeLines[i] = `${tabs}# TODO: memoize\n${codeLines[i]}`
        }
      }
      setCode(codeLines.join('\n'))
    }
  }, [insights])

  return (
    <Editor
      defaultLanguage="python"
      value={code}
      onChange={(value) => setCode(value || '')}
      theme="light"
      options={{
        scrollBeyondLastLine: false
      }}
    />
  )
}

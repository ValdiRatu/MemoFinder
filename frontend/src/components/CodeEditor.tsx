import Editor from '@monaco-editor/react'
import { useEffect } from 'react'

import { useData } from '../contexts/DataContext'

export const CodeEditor = () => {
  const { code, setCode, memoResults } = useData()

  useEffect(() => {
    if (memoResults.length > 0) {
      // memResults is sort by estimatedTimeSaved in descending order
      const { lineNumbers } = memoResults[0]
      // add message before each line in lines
      const codeLines = code.split('\n')
      for (let i = 0; i < codeLines.length; i++) {
        if (lineNumbers.includes(i + 1)) {
          const tabs = codeLines[i].match(/^\s*/)?.[0] ?? ''
          codeLines[i] = `${tabs}# TODO: optimize\n${codeLines[i]}`
        }
      }
      setCode(codeLines.join('\n'))
    }
  }, [memoResults])

  return (
    <Editor
      defaultLanguage="python"
      value={code}
      onChange={(value) => setCode(value || '')}
      theme="light"
      options={{
        scrollBeyondLastLine: false,
        minimap: { enabled: false }
      }}
      loading=""
      className="editor"
    />
  )
}

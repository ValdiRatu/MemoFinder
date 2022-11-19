import path from 'path'
import { PythonShell } from 'python-shell'

import { config } from '../config'

export enum OperationType {
  Get = 'get',
  Post = 'post',
  Del = 'del'
}

interface IOperation {
  path: string
  type: OperationType
  func: (req, res) => void
}

export const helloOperation: IOperation = {
  path: '/hello',
  type: OperationType.Get,
  func: (req, res) => {
    res.status(200).send('Hello World!')
  }
}

export const pythonPostOperation: IOperation = {
  path: '/python',
  type: OperationType.Post,
  func: async (req, res) => {
    try {
      const { code } = req.body
      const returnMessage = await runPython(code, config.script)

      res.status(200).send(returnMessage)
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}

const runPython = (sourceCode: string, scriptName: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const scriptPath = path.resolve('../', 'function_call_counter', `${scriptName}.py`)
    PythonShell.run(scriptPath, { args: [sourceCode] }, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results ? `results: ${results}` : 'no results')
      }
    })
  })

export const operations: IOperation[] = [pythonPostOperation, helloOperation]

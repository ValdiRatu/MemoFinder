import { hsv } from 'color-convert'
import { ObjectData } from 'gojs'
import { ReactDiagram } from 'gojs-react'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

export enum GraphType {
  Tree = 'Tree',
  Grid = 'Grid'
}

interface DataContextProps {
  code: string
  setCode: (code: string) => void
  runCode: () => void
  ref: React.RefObject<ReactDiagram>
  nodesDataArray: ObjectData[]
  linksDataArray: ObjectData[] | undefined
  visualization: GraphType
  setVisualization: (visualization: GraphType) => void
}

interface Data {
  metaData: MetaData // information about the overall on a high level
  signatures: {
    [signature: string]: Signature // signature is the method name + parameters: fib(n=18)
  }
}

interface MetaData {
  runtime: number // runtime of the program in milliseconds, same as time for module (root)
  root: string // signature of the root method
  // total number of instances in the tree, equal to Object.values(signatures).reduce((acc, signature) => acc + signature.numInstances, 0)
  // if the number of signatures is too large, we won't create the nodes and links for the tree visualization
  totalInstances: number
}

interface Signature {
  numInstances: number // number of times the signature is called, equal to Object.keys(instances).length
  totalTime: number // total time spent in this method in milliseconds, equal to Object.values(instances).reduce((acc, curr) => acc + curr.time, 0)
  instances: {
    [id: string]: {
      // represents the id of the instance, unique for all function calls
      caller?: string // optional id of the caller, undefined if the function is root / standalone
      line: number // line number of the call
      time: number // time taken to execute this instance in milliseconds
      returnValue?: any // optional return value of the function call
    }
  }
}

const DataContext = createContext({} as DataContextProps)

export const DataProvider = ({ children }: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<Data>({} as Data)
  const [code, setCode] = useState(`def main():\n\tprint("Hello World!")`)
  const ref = useRef<ReactDiagram>(null)
  const [visualization, setVisualization] = useState<GraphType>(GraphType.Tree)
  const [nodesDataArray, setNodesDataArray] = useState<ObjectData[]>([])
  const [linksDataArray, setLinksDataArray] = useState<ObjectData[] | undefined>([])
  const [treeNodes, setTreeNodes] = useState<ObjectData[]>([])
  const [treeLinks, setTreeLinks] = useState<ObjectData[]>([])
  const [gridNodes, setGridNodes] = useState<ObjectData[]>([])

  useEffect(() => {
    ref.current?.clear()
    if (visualization === GraphType.Tree) {
      setNodesDataArray(treeNodes)
      setLinksDataArray(treeLinks)
    } else {
      setNodesDataArray(gridNodes)
      setLinksDataArray(undefined)
    }
  }, [visualization])

  const runCode = () => {
    // TODO: make a request to the server with the code and get the data
    //       fetch("/api/run", { method: "POST", body: code })
    //       setData(response.data);

    const mockData: Data = {
      metaData: {
        runtime: 1700,
        root: 'module',
        totalInstances: 16
      },
      signatures: {
        module: {
          numInstances: 1,
          totalTime: 1700,
          instances: {
            '0': { caller: '', line: 0, time: 1700 }
          }
        },
        'fib(n=5)': {
          numInstances: 1,
          totalTime: 1400,
          instances: {
            '11': { caller: '0', line: 4, time: 1400, returnValue: 8 }
          }
        },
        'fib(n=4)': {
          numInstances: 1,
          totalTime: 900,
          instances: {
            '1': { caller: '11', line: 4, time: 900, returnValue: 5 }
          }
        },
        'fib(n=3)': {
          numInstances: 1,
          totalTime: 1000,
          instances: {
            '2': { caller: '1', line: 4, time: 500, returnValue: 3 },
            '12': { caller: '11', line: 4, time: 500, returnValue: 3 }
          }
        },
        'fib(n=2)': {
          numInstances: 2,
          totalTime: 900,
          instances: {
            '3': { caller: '1', line: 4, time: 300, returnValue: 2 },
            '4': { caller: '2', line: 4, time: 300, returnValue: 2 },
            '13': { caller: '12', line: 4, time: 300, returnValue: 2 }
          }
        },
        'fib(n=1)': {
          numInstances: 3,
          totalTime: 500,
          instances: {
            '5': { caller: '2', line: 1, time: 100, returnValue: 1 },
            '6': { caller: '4', line: 1, time: 100, returnValue: 1 },
            '7': { caller: '3', line: 1, time: 100, returnValue: 1 },
            '14': { caller: '13', line: 1, time: 100, returnValue: 1 },
            '15': { caller: '12', line: 1, time: 100, returnValue: 1 }
          }
        },
        'fib(n=0)': {
          numInstances: 2,
          totalTime: 300,
          instances: {
            '8': { caller: '3', line: 2, time: 100, returnValue: 0 },
            '9': { caller: '4', line: 3, time: 100, returnValue: 0 },
            '16': { caller: '13', line: 2, time: 100, returnValue: 0 }
          }
        }
      }
    }

    setData(mockData)

    const treeNodes: ObjectData[] = []
    const treeLinks: ObjectData[] = []
    const gridNodes: ObjectData[] = []
    const { runtime, root } = mockData.metaData
    for (const signature in mockData.signatures) {
      const { numInstances, totalTime } = mockData.signatures[signature]
      if (signature !== root) {
        gridNodes.push({
          key: signature,
          label: signature,
          numCalls: numInstances,
          totalTime,
          color: `#${hsv.hex([120 - (totalTime / runtime) * 120, 100, 100])}`,
          // assign size based on the total time spent in the function
          height: 100 + (totalTime / runtime) * 100,
          width: 100 + (totalTime / runtime) * 100
        })
      }
      for (const instanceId in mockData.signatures[signature].instances) {
        const { caller, time, line, returnValue } =
          mockData.signatures[signature].instances[instanceId]
        treeNodes.push({
          key: instanceId,
          label: signature,
          line,
          time,
          totalTime,
          returnValue,
          // we can either use totalTime or time for color, totalTime gives a better representation of the time spent in the signature
          color: `#${hsv.hex([120 - (totalTime / runtime) * 120, 100, 100])}`
        })
        if (caller) {
          treeLinks.push({
            from: caller,
            to: instanceId,
            label: `line ${line}`
          })
        }
      }
    }

    setTreeNodes(treeNodes)
    setTreeLinks(treeLinks)
    setGridNodes(gridNodes)

    ref.current?.clear()
    if (visualization === GraphType.Tree) {
      setNodesDataArray(treeNodes)
      setLinksDataArray(treeLinks)
    } else {
      setNodesDataArray(gridNodes)
      setLinksDataArray(undefined)
    }
  }

  return (
    <DataContext.Provider
      value={{
        code,
        setCode,
        runCode,
        ref,
        nodesDataArray,
        linksDataArray,
        visualization,
        setVisualization
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)

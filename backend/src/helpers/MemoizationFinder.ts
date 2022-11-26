import { uniq, zipObject } from 'lodash'

import { IFormattedData } from './FunctionCallDataFormatter'

interface IMemoizationResult {
  signature: string
  lineNumbers: number[]
  numCalled: number[]
  estimatedTimeSaved: number
  memoizationScore: number
}

interface IMemoizationAlgorithmOptions {
  timeUnitMultiplier: number
}

const DEFAULT_OPTIONS: IMemoizationAlgorithmOptions = {
  timeUnitMultiplier: 1000 // default is milliseconds
}

export class MemoizationFinder {
  public static findMemiozations(
    data: IFormattedData,
    options: IMemoizationAlgorithmOptions = DEFAULT_OPTIONS
  ): IMemoizationResult[] {
    const result: IMemoizationResult[] = []
    for (const [signature, signatureData] of Object.entries(data.signatures)) {
      const { numInstances, totalTime, instances } = signatureData
      const returnValues = uniq(Object.values(instances).map((instance) => instance.returnValue))

      const memoizationScore =
        // Math.log(numInstances - returnValues.length + 1)*(((totalTime / numInstances) * options.timeUnitMultiplier)**2)*(totalTime * options.timeUnitMultiplier)
        Math.log(numInstances - returnValues.length + 1) *
        ((totalTime / numInstances) * options.timeUnitMultiplier) ** 2
      if (memoizationScore > 0) {
        const lineNumbers = uniq(Object.values(instances).map((instance) => instance.line))
        const estimatedTimeSaved = (totalTime / numInstances) * (numInstances - 1)
        let numCalled: number[]
        if (lineNumbers.length === 1) {
          numCalled = [numInstances]
        } else {
          const lineNumbersToNumCalled: Record<number, number> = zipObject(
            lineNumbers,
            new Array(lineNumbers.length).fill(0)
          )
          for (const instance of Object.values(instances)) {
            lineNumbersToNumCalled[instance.line] += 1
          }
          numCalled = Object.values(lineNumbersToNumCalled)
        }
        result.push({
          signature,
          lineNumbers,
          numCalled,
          estimatedTimeSaved,
          memoizationScore
        })
      }
    }

    return result.sort((a, b) => b.memoizationScore - a.memoizationScore)
  }
}

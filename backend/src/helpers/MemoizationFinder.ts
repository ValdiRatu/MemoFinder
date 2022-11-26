import { uniq } from 'lodash'

import { IFormattedData, IInstance } from './FunctionCallDataFormatter'

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
  timeUnitMultiplier: 1000
}

export class MemoizationFinder {
  public static findMemiozations(data: IFormattedData, options: IMemoizationAlgorithmOptions = DEFAULT_OPTIONS): IMemoizationResult[] {
    const result: IMemoizationResult[] = []
    for (const [signature, signatureData] of Object.entries(data.signatures)) {
      const { numInstances, totalTime, instances } = signatureData
      const returnValues = uniq(Object.values(instances).map((instance) => instance.returnValue)) 
      /**
       * ! Now that I think about it, we should prob include how the total time compares against the average time per call
       * ! otherwise in the example of a function that is called 100 times but only takes 1ms each time, that would be a bad candidate for memoization
       * ! An example of the above would be a function that just returns a constant or a function that is already memoized
       *
       * ! also for a given signature, the return value of the function could be different depending on the instance
       * ! so we should prob check for that
       */
      const memoizationScore  = Math.log(numInstances) * ((totalTime/numInstances) * options.timeUnitMultiplier)^2 * (totalTime * options.timeUnitMultiplier) / returnValues.length
      if (memoizationScore > 0) {
        // TODO figure out what the threshold should be
        // ? maybe we should check the run time of the function grouped by line in case a function at a certain line # is slower than calls to the same function at a different line #
        const lineNumbers = uniq(Object.values(instances).map((instance) => instance.line))
        let lineMap = new Map()
        lineNumbers.forEach(function(lineNumber){
          lineMap.set(lineNumber, 0)
        })
        for (const [instance, instanceData] of Object.entries(signatureData.instances)){
          const { caller, line, returnValue, time} = instanceData
          lineMap.set(instanceData.line, lineMap.get(instanceData.line) + 1)
        }
        let lineKeys: number[] = []
        let lineCalled: number[] = []
        lineMap.forEach(function(value: number, key: number) {
          lineKeys.push(key)
          lineCalled.push(value)
      });
        const estimatedTimeSaved =
          this.getAverageTimePerCall(Object.values(instances)) * (numInstances - 1)
        result.push({
          signature,
          lineNumbers: lineKeys,
          estimatedTimeSaved,
          memoizationScore,
          numCalled: lineCalled
        })
      }
    }

    return result.sort((a, b) => b.memoizationScore - a.memoizationScore)
  }

  private static getAverageTimePerCall(instances: IInstance[]): number {
    const totalTime = instances.reduce((sum, instance) => sum + instance.time, 0)
    return totalTime / instances.length
  }
}

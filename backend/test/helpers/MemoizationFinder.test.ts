import { expect } from 'chai'

import { MemoizationFinder } from '../../src/helpers/MemoizationFinder'
import { DummyObjectCreator } from '../DummyObjectCreator'

describe(MemoizationFinder.name, () => {
  it('properly calculates memoization data and returns a sorted list', () => {
    const data = DummyObjectCreator.createFormattedData({
      signatures: {
        'test(1)': DummyObjectCreator.createSignature({
          numInstances: 3,
          totalTime: 18,
          instances: {
            '1': DummyObjectCreator.createInstance({
              line: 1,
              time: 3
            }),
            '2': DummyObjectCreator.createInstance({
              line: 1,
              time: 6
            }),
            '3': DummyObjectCreator.createInstance({
              line: 2,
              time: 9
            })
          }
        }),
        'test(2)': DummyObjectCreator.createSignature({
          numInstances: 2,
          totalTime: 2,
          instances: {
            '1': DummyObjectCreator.createInstance({
              line: 1,
              time: 1
            }),
            '2': DummyObjectCreator.createInstance({
              line: 1,
              time: 1
            })
          }
        })
      }
    })

    const result = MemoizationFinder.findMemiozations(data,{timeUnitMultiplier:1})
    
    expect(result).to.eql([
      {
        signature: 'test(1)',
        memoizationScore: 36,
        numCalled: 3,
        estimatedTimeSaved: 12,
        lineNumbers: [1, 2]
      },
      {
        signature: 'test(2)',
        memoizationScore: 2,
        numCalled: 2,
        estimatedTimeSaved: 1,
        lineNumbers: [1]
      }
    ])
  })
})

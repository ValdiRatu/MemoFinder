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

    const result = MemoizationFinder.findMemiozations(data, { timeUnitMultiplier: 1 })

    expect(result[0].estimatedTimeSaved).to.equal(12)
    expect(result[0].lineNumbers).to.deep.equal([1, 2])
    expect(result[0].memoizationScore).to.be.a('number') // memoizationScore is subject to change
    expect(result[0].numCalled).to.deep.equal([2, 1])
    expect(result[0].signature).to.equal('test(1)')

    expect(result[1].estimatedTimeSaved).to.equal(1)
    expect(result[1].lineNumbers).to.deep.equal([1])
    expect(result[1].memoizationScore).to.be.a('number') // memoizationScore is subject to change
    expect(result[1].numCalled).to.deep.equal([2])
    expect(result[1].signature).to.equal('test(2)')
  })
})

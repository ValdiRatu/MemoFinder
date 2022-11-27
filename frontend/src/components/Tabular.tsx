import React from 'react'
import { Col, Table } from 'react-bootstrap'

import { useData } from '../contexts/DataContext'

export const Tabular = () => {
  const { memoResults } = useData()

  return (
    <>
      {memoResults.length > 0 ? (
        <div className="p-3">
          <Table bordered hover>
            <thead>
              <tr>
                <th>Method signature</th>
                <th>Line numbers</th>
                <th># times called</th>
                <th>Estimated time saved (ms)</th>
                <th>Memoization score</th>
              </tr>
            </thead>
            <tbody>
              {memoResults.map(
                ({ estimatedTimeSaved, numCalled, lineNumbers, signature, memoizationScore }) => (
                  <tr key={signature}>
                    <td>{signature}</td>
                    <td>{lineNumbers.join(', ')}</td>
                    <td>{numCalled}</td>
                    <td>{estimatedTimeSaved}</td>
                    <td>{memoizationScore}</td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </div>
      ) : (
        <Col className="d-flex justify-content-center align-items-center h-100">
          <h3>Nothing to show</h3>
        </Col>
      )}
    </>
  )
}

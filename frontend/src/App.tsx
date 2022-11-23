import './App.css'

import React, { useState } from 'react'
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap'

import { CodeEditor, Grid, Icon, Tree } from './components'
import { GraphType, useData } from './contexts/DataContext'

const App = () => {
  const { runCode, setVisualization, visualization } = useData()
  const [showCode, setShowCode] = React.useState(true)
  const [error, setError] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const analyze = async () => {
    setIsRunning(true)
    try {
      await runCode()
      setError('')
    } catch (e: any) {
      setError(e.message)
    }
    setIsRunning(false)
  }

  return (
    <div className="d-flex flex-column vh-100">
      <div className="text-bg-dark d-flex justify-content-between px-4 py-3 align-middle">
        <h3 className="m-0 p-0">Project Name</h3>
        <div className="d-flex">
          <Icon
            iconName="CodeSlash"
            buttonClassname="ms-3"
            variant="outline-danger"
            onClick={() => setShowCode(!showCode)}
            active={showCode}
          />
          <Icon
            iconName="ColumnsGap"
            buttonClassname="ms-3"
            variant="outline-danger"
            active={visualization === GraphType.Grid}
            onClick={() => {
              setVisualization(GraphType.Grid)
            }}
          />
          <Icon
            iconName="Diagram3Fill"
            buttonClassname="ms-3"
            variant="outline-danger"
            active={visualization === GraphType.Tree}
            onClick={() => {
              setVisualization(GraphType.Tree)
            }}
          />
          <Button
            variant="outline-danger"
            className="run ms-3"
            onClick={analyze}
            disabled={isRunning}
          >
            {isRunning && (
              <Spinner animation="border" variant="danger" size="sm" as="span" className="me-2" />
            )}
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </Button>
        </div>
      </div>
      <Container fluid className="flex-grow-1">
        <Row className="h-100" xs={showCode ? 2 : 1}>
          {showCode && (
            <Col className="px-0">
              <CodeEditor />
            </Col>
          )}
          {error ? (
            <Col className="d-flex justify-content-center align-items-center">
              <h4>
                <code>{error}</code>
              </h4>
            </Col>
          ) : (
            <Col className="px-0">{visualization === GraphType.Tree ? <Tree /> : <Grid />}</Col>
          )}
        </Row>
      </Container>
    </div>
  )
}

export default App

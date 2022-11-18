import React from 'react';
import './App.css';
import { Button, Col, Container, Row } from "react-bootstrap";
import { CodeEditor, Grid, Icon, Tree } from "./components";
import { GraphType, useData } from "./contexts/DataContext";

const App = () => {
    const { runCode, setVisualization, visualization } = useData();

    return (
        <div className="d-flex flex-column vh-100">
            <div className="text-bg-dark d-flex justify-content-between px-4 py-3 align-middle">
                <h3 className="m-0 p-0">Project Name</h3>
                <div className="d-flex">
                    <Icon
                        iconName="ColumnsGap"
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
                    <Button variant="outline-danger" className="run ms-3" onClick={runCode}>Run</Button>
                </div>
            </div>
            <Container fluid className="flex-grow-1">
                <Row xs={1} md={2} className="h-100">
                    <Col className="px-0">
                        <CodeEditor/>
                    </Col>
                    <Col className="px-0">
                        {visualization === GraphType.Tree ? <Tree/> : <Grid/>}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default App;

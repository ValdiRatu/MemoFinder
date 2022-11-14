import React, { useState } from 'react';
import './App.css';
import { Button, Col, Container, Row } from "react-bootstrap";
import { CodeEditor, Visualizer } from "./components";

const App = () => {
    const [code, setCode] = useState(`def main():\n\tprint("Hello World!")`);

    const runCode = () => {
        console.log(code);
        //  TODO: make a request to the server with the code
    }

    return (
        <div className="d-flex flex-column vh-100">
            <div className="text-bg-dark d-flex justify-content-between px-4 py-3 align-middle">
                <h3 className="m-0 p-0">Project Name</h3>
                <Button variant="outline-danger" className="run" onClick={runCode}>Run</Button>
            </div>
            <Container fluid className="flex-grow-1">
                <Row xs={1} md={2} className="h-100">
                    <Col className="px-0">
                        <CodeEditor code={code} setCode={setCode}/>
                    </Col>
                    <Col className="px-0">
                        <Visualizer code={code}/>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default App;

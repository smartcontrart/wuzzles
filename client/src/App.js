import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Home from "./Components/Home";
import Admin from "./Components/Admin";
import AccountInfoProvider from "./Context/AccountInfo";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <AccountInfoProvider>
      <div className="background">
        <div className="App d-flex align-items-center justify-content-center">
          {/* <div className="background d-flex align-items-center justify-content-center"> */}
          <Container>
            <Row
              id="App_row"
              className="d-flex align-items-center justify-content-center"
            >
              <Col className="d-flex align-items-center justify-content-center">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </AccountInfoProvider>
  );
}

export default App;

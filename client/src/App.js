import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Home from "./Components/Home";
import Corporations from "./Components/Corporations";
import Factories from "./Components/Factories";
import Loots from "./Components/Loots";
import Mods from "./Components/Mods";
import Schematics from "./Components/Schematics";
import Units from "./Components/Units";
import Admin from "./Components/Admin";
import NavigationBar from "./Components/Navigationbar.js";
import AccountInfoProvider from "./Context/AccountInfo";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <AccountInfoProvider>
      <div className="background">
        <NavigationBar />
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
                  <Route path="/corporations" element={<Corporations />} />
                  <Route path="/factories" element={<Factories />} />
                  <Route path="/loots" element={<Loots />} />
                  <Route path="/mods" element={<Mods />} />
                  <Route path="/schematics" element={<Schematics />} />
                  <Route path="/units" element={<Units />} />
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

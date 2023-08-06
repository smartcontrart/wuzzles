import React, { useState, useContext } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { AccountInfoContext } from "../Context/AccountInfo";
import { useLocation } from "react-router-dom";
import Connect from "./Connect.js";
import "../App.css";

export default function NavigationBar() {
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();

  const paths = [
    { name: "Corporations", path: "/corporations" },
    { name: "Factories", path: "/factories" },
    { name: "Loots", path: "/loots" },
    { name: "Mods", path: "/mods" },
    { name: "Schematics", path: "/schematics" },
    { name: "Units", path: "/units" },
    { name: "Admin", path: "/admin" },
  ];

  let accountInfo = useContext(AccountInfoContext);

  function renderDivide(key) {
    if (key !== paths.length - 1 && !collapsed) {
      return <div className="d-flex align-items-center">/</div>;
    }
  }

  function renderPaths() {
    if (!accountInfo.account) return null;
    return paths.map((path, key) => {
      let name = path.name.toLowerCase();
      let pathname = location.pathname.split("/")[1].toLowerCase();
      if (name === "mint" && pathname === "") {
        pathname = "mint";
      }
      return (
        <React.Fragment key={key}>
          <Nav.Link
            className="mx-3"
            href={path.path}
            style={
              name === pathname
                ? { color: "white", fontWeight: "bold" }
                : { color: "white" }
            }
          >
            {path.name}
          </Nav.Link>
          {renderDivide(key)}
        </React.Fragment>
      );
    });
  }

  return (
    <React.Fragment>
      <Navbar
        bg="dark"
        expand="lg"
        className="mb-2"
        onToggle={(next) => setCollapsed(next)}
      >
        <Container>
          <Navbar.Brand href="/" style={{ color: "white" }}>
            Void 2122
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className=""></Nav>
            <Nav className="ms-auto">{renderPaths()}</Nav>
            <Connect />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </React.Fragment>
  );
}

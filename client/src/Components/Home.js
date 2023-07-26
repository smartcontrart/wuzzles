import React, { useState, useContext } from "react";
import Connect from "./Connect.js";
import { Link } from "react-router-dom";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { AccountInfoContext } from "../Context/AccountInfo.js";

import "../App.css";

function Home() {
  let accountInfo = useContext(AccountInfoContext);
  const [alert, setAlert] = useState({
    active: false,
    content: null,
    variant: null,
  });

  function displayAlert(message, variant) {
    setAlert({ active: true, content: message, variant: variant });
    setTimeout(function () {
      setAlert({ active: false, content: null, variant: null });
    }, 10000);
  }

  function renderAlert() {
    if (alert.active) {
      return (
        <Col className="m-">
          <Alert variant={alert.variant}>{alert.content}</Alert>
        </Col>
      );
    }
  }

  // async function handleMint() {
  //   await accountInfo.ContractMintInstance.methods
  //     ._ALTokensMinted(accountInfo.account)
  //     .call();
  // }

  // function renderMintButton() {
  //   return (
  //     <Container>
  //       <Row>
  //         <Col className="d-flex align-items-left justify-content-center m-2">
  //           <Button
  //             variant="light"
  //             id="mint_button"
  //             onClick={() => handleMint()}
  //           >{`Mint`}</Button>
  //         </Col>
  //       </Row>
  //     </Container>
  //   );
  // }

  function renderUserInterface() {
    // return renderMintButton();
  }

  return (
    <Container className="mb-5">
      {console.log(accountInfo)}
      <Row style={{ fontWeight: "bold" }}>
        <Col className="title_font">Void2122 - Test</Col>
      </Row>
      <Row className="d-flex xs_center">{renderUserInterface()}</Row>
      <Row>
        <Col className="d-flex align-items-left justify-content-center m-2">
          <Button id="mint_button">
            <Link
              to="/admin"
              style={{ textDecoration: "none", color: "black" }}
            >
              Admin
            </Link>
          </Button>
        </Col>
      </Row>
      <Row className="d-flex xs_center">{renderAlert()}</Row>
      <Row>
        <Col className="d-flex align-items-center justify-content-center">
          <Connect />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;

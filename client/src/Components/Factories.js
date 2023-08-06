import React, { useState, useContext } from "react";
import Connect from "./Connect.js";
import { Link } from "react-router-dom";
import { Container, Row, Col, Alert, Button, Image } from "react-bootstrap";
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

  function renderFactories() {
    return accountInfo.nfts.factory.map((nft, index) => {
      return (
        <Row>
          <Col>
            <Image src={nft.media[0].thumbnail} height="250px"></Image>
            <br />
            {nft.title}
            <br />
            <Button className="mb-2">Craft</Button>
            <br />
            <Button className="mb-2">Claim</Button>
          </Col>
        </Row>
      );
    });
  }

  function renderUserInterface() {
    if (accountInfo.nftsLoaded) {
      return renderFactories();
    }
  }

  return (
    <Container className="mb-5">
      <Row style={{ fontWeight: "bold" }}>
        <Col className="title_font">Factories</Col>
      </Row>
      <Row className="d-flex xs_center">{renderUserInterface()}</Row>
      <Row className="d-flex xs_center">{renderAlert()}</Row>
    </Container>
  );
}

export default Home;

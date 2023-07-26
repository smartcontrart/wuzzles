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

  function renderCorporations() {
    return accountInfo.nfts.corporation.map((nft, index) => {
      console.log(nft);
      return (
        <Row>
          <Col>
            <Image src={nft.media[0].thumbnail} height="250px"></Image>
            {nft.title}
          </Col>
        </Row>
      );
    });
  }

  function renderFactories() {
    return accountInfo.nfts.factory.map((nft, index) => {
      return (
        <Row>
          <Col>
            <Image src={nft.media[0].thumbnail} height="250px"></Image>
            {nft.title}
          </Col>
        </Row>
      );
    });
  }

  function renderLoots() {
    return accountInfo.nfts.loot.map((nft, index) => {
      return (
        <Row>
          <Col>
            <Image src={nft.media[0].thumbnail} height="250px"></Image>
            {nft.title}
          </Col>
        </Row>
      );
    });
  }

  function renderMods() {
    return accountInfo.nfts.mod.map((nft, index) => {
      return (
        <Row>
          <Col>
            <Image src={nft.media[0].thumbnail} height="250px"></Image>
            {nft.title}
          </Col>
        </Row>
      );
    });
  }

  function renderSchematics() {
    return accountInfo.nfts.schematic.map((nft, index) => {
      return (
        <Row>
          <Col>
            <Image src={nft.media[0].thumbnail} height="250px"></Image>
            {nft.title}
          </Col>
        </Row>
      );
    });
  }

  function renderUnits() {
    return accountInfo.nfts.unit.map((nft, index) => {
      return (
        <Row>
          <Col>
            <Image src={nft.media[0].thumbnail} height="250px"></Image>
            {nft.title}
          </Col>
        </Row>
      );
    });
  }

  function renderUserInterface() {
    if (accountInfo.nftsLoaded) {
      return (
        <>
          <Row>
            <Col>Corporations</Col>
          </Row>
          {renderCorporations()}
          <Row>
            <Col>Factories</Col>
          </Row>
          {renderFactories()}
          <Row>
            <Col>Loots</Col>
          </Row>
          {renderLoots()}
          <Row>
            <Col>Mods</Col>
          </Row>
          {renderMods()}
          <Row>
            <Col>Schematics</Col>
          </Row>
          {renderSchematics()}
          <Row>
            <Col>Units</Col>
          </Row>
          {renderUnits()}
        </>
      );
    }
  }

  return (
    <Container className="mb-5">
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

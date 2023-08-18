import React, { useState, useEffect, useContext } from "react";
import Connect from "./Connect.js";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Alert,
  Button,
  Image,
  Dropdown,
} from "react-bootstrap";
import { AccountInfoContext } from "../Context/AccountInfo.js";

import "../App.css";

function Home() {
  let accountInfo = useContext(AccountInfoContext);
  const [alert, setAlert] = useState({
    active: false,
    content: null,
    variant: null,
  });
  const [availableMods, setAvailableMods] = useState([]);

  // useEffect(() => {
  //   if (accountInfo.nftsLoaded) {
  //     // console.log("executed");
  //     setAvailableMods(accountInfo.nfts.mods);
  //   }
  //   // Update the document title using the browser API
  // }, [accountInfo.nftsLoaded]);

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

  function renderModsToAdd() {
    return accountInfo.nfts.mod.map((mod, index) => {
      // TODO Filter out installed mods
      return <Dropdown.Item href="#/action-1">{mod.title}</Dropdown.Item>;
    });
  }

  function renderModsToReplace(nft) {
    console.log(nft);
    return accountInfo.nfts.unit.map((mod, index) => {
      // TODO Filter out installed mods
      return <Dropdown.Item href="#/action-1">{mod.title}</Dropdown.Item>;
    });
  }

  function renderModsToDestroy() {
    return accountInfo.nfts.mod.map((mod, index) => {
      // TODO Filter out installed mods
      return <Dropdown.Item href="#/action-1">{mod.title}</Dropdown.Item>;
    });
  }

  function renderUnits() {
    return accountInfo.nfts.unit.map((nft, index) => {
      return (
        <Row>
          <Col>
            <Image src={nft.media[0].thumbnail} height="250px"></Image>
            <br />
            {nft.title}
            <br />
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select a Mod to Add
              </Dropdown.Toggle>
              <Dropdown.Menu>{renderModsToAdd()}</Dropdown.Menu>
            </Dropdown>
            <Button className="mb-2">Add Mod</Button>
            <br />
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select a Mod to Replace
              </Dropdown.Toggle>
              <Dropdown.Menu>{renderModsToReplace(nft)}</Dropdown.Menu>
            </Dropdown>
            <Button className="mb-2">Replace Mod</Button>
            <br />
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select a Mod to Destroy
              </Dropdown.Toggle>
              <Dropdown.Menu>{renderModsToDestroy()}</Dropdown.Menu>
            </Dropdown>
            <Button className="mb-2">Destroy Mod</Button>
            <br />
            <Button className="mb-2">Switch visual</Button>
          </Col>
        </Row>
      );
    });
  }

  function renderUserInterface() {
    if (accountInfo.nftsLoaded) {
      return renderUnits();
    }
  }

  return (
    <Container className="mb-5">
      <Row style={{ fontWeight: "bold" }}>
        <Col className="title_font">Units</Col>
      </Row>
      <Row className="d-flex xs_center">{renderUserInterface()}</Row>
      <Row className="d-flex xs_center">{renderAlert()}</Row>
    </Container>
  );
}

export default Home;

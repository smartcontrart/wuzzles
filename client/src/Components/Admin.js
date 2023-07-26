import React, { useState, useContext } from "react";
import Connect from "./Connect.js";
import {
  Container,
  Row,
  Col,
  Alert,
  Button,
  Dropdown,
  Form,
} from "react-bootstrap";
import { AccountInfoContext } from "../Context/AccountInfo.js";
import { Link } from "react-router-dom";
import * as DB from "../tempDB/data.json";

import "../App.css";

function Admin() {
  let accountInfo = useContext(AccountInfoContext);
  const [selection, setSelection] = useState("Create a card");
  const [inputFields, setInputFields] = useState([]);
  const options = [
    "Corporation",
    "Factory",
    "Loot",
    "Mod",
    "Schematic",
    "Unit",
  ];
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
          <br />
          <br />
          <Alert variant={alert.variant}>{alert.content}</Alert>
        </Col>
      );
    }
  }

  function renderForm() {
    return (
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          {renderFormInputs()}
        </Form.Group>
        {selection === "Create a card" ? null : (
          <Button type="button" onClick={handleMint}>
            {`Create ${selection}`}
          </Button>
        )}
      </Form>
    );
  }

  function renderFormInputs() {
    return inputFields.map((input, key) => {
      return (
        <>
          <Form.Label>{input.label}</Form.Label>
          <Form.Control
            type={input.type}
            placeholder={input.placeholder}
            value={input.value}
            onChange={(event) => handleFormChange(key, event)}
          />
        </>
      );
    });
  }

  function handleFormChange(key, event) {
    if (!inputFields[key].isLocked) {
      let inputFieldsCopy = [...inputFields];
      inputFieldsCopy[key].value = event.target.value;
      setInputFields(inputFieldsCopy);
    }
  }

  async function handleMint() {
    switch (selection) {
      case "Corporation":
        await accountInfo.CorporationInstance.methods
          .createCorporation(DB.cards.corporations[0])
          .send({ from: accountInfo.account });
        break;
      case "Factory":
        await accountInfo.FactoryInstance.methods
          .createFactory(DB.cards.factories[0])
          .send({ from: accountInfo.account });
        break;
      case "Loot":
        await accountInfo.LootInstance.methods
          .createLoot(DB.cards.loots[0])
          .send({ from: accountInfo.account });
        break;
      case "Mod":
        await accountInfo.ModInstance.methods
          .createMod(DB.cards.mods[0])
          .send({ from: accountInfo.account });
        break;
      case "Schematic":
        await accountInfo.SchematicInstance.methods
          .createSchematic(DB.cards.schematics[0])
          .send({ from: accountInfo.account });
        break;
      case "Unit":
        await accountInfo.UnitInstance.methods
          .createUnit(DB.cards.units[0])
          .send({ from: accountInfo.account });
        break;
      default:
        break;
    }
  }

  function renderMintButton() {
    return (
      <Container>
        <Row>
          <Col className="d-flex align-items-left justify-content-center m-2">
            <Button
              variant="light"
              id="mint_button"
              onClick={() => handleMint()}
            >{`Create`}</Button>
          </Col>
        </Row>
      </Container>
    );
  }

  const handleSelect = (data) => {
    setSelection(data);
    switch (data) {
      case "Corporation":
        setInputFields([
          {
            label: "Corporation Name",
            type: "text",
            placeholder: "MechaWarriors",
            value: "",
            isLocked: false,
          },
          {
            label: "Corporation Description",
            type: "textarea",
            placeholder: "MechaWarriors, killers of newbies",
            value: "",
            isLocked: false,
          },
          {
            label: "Corporation Owner",
            type: "text",
            value: accountInfo.account,
            isLocked: true,
          },
          {
            label: "Corporation Visual",
            type: "file",
            isLocked: true,
          },
        ]);
        break;
      case "Factory":
        setInputFields([
          {
            label: "Factory Name",
            type: "text",
            placeholder: "Vespen gas",
            value: "",
          },
          {
            label: "Factory Description",
            type: "textarea",
            placeholder: "Collecting gas",
            value: "",
          },
          {
            label: "Factory Visual",
            type: "file",
          },
        ]);
        break;
      case "Loot":
        setInputFields([
          {
            label: "Loot Name",
            type: "text",
            placeholder: "Vespen gas",
            value: "",
          },
          {
            label: "Loot Description",
            type: "textarea",
            placeholder: "Collecting gas",
            value: "",
          },
          {
            label: "Loot Visual",
            type: "file",
          },
        ]);
        break;
      case "Mod":
        setInputFields([
          {
            label: "Mod Name",
            type: "text",
            placeholder: "Vespen gas",
            value: "",
          },
          {
            label: "Mod Description",
            type: "textarea",
            placeholder: "Collecting gas",
            value: "",
          },
          {
            label: "Mod Visual",
            type: "file",
          },
          {
            label: "Bonus top",
            type: "number",
          },
          {
            label: "Bonus right",
            type: "number",
          },
          {
            label: "Bonus bottom",
            type: "number",
          },
          {
            label: "Bonus left",
            type: "number",
          },
        ]);
        break;
      case "Schematic":
        setInputFields([
          {
            label: "Schematic Name",
            type: "text",
            placeholder: "Vespen gas",
            value: "",
          },
          {
            label: "Schematic Description",
            type: "textarea",
            placeholder: "Collecting gas",
            value: "",
          },
          {
            label: "Schematic Visual",
            type: "file",
          },
          {
            label: "Construction Time",
            type: "number",
            placeholder: "10000",
          },
          {
            label: "Input 1",
            type: "number",
            placeholder: "1",
          },
          {
            label: "Input 2",
            type: "number",
            placeholder: "2",
          },
          {
            label: "Input Amount 1",
            type: "number",
            placeholder: "1",
          },
          {
            label: "Input Amount 2",
            type: "number",
            placeholder: "1",
          },
          {
            label: "Output is Unit",
            type: "checkbox",
          },
        ]);
        break;
      case "Unit":
        setInputFields([
          {
            label: "Unit Name",
            type: "text",
            placeholder: "Vespen gas",
            value: "",
          },
          {
            label: "Unit Description",
            type: "textarea",
            placeholder: "Collecting gas",
            value: "",
          },
          {
            label: "Unit Visual 1",
            type: "file",
          },
          {
            label: "Unit Visual 2",
            type: "file",
          },
          {
            label: "Starting level",
            type: "number",
          },
          {
            label: "Generation",
            type: "number",
          },
          {
            label: "Model",
            type: "Text",
          },
          {
            label: "Rarity",
            type: "Text",
          },
          {
            label: "Mod slots",
            type: "Text",
          },
          {
            label: "Value top",
            type: "number",
          },
          {
            label: "Value right",
            type: "number",
          },
          {
            label: "Value bottom",
            type: "number",
          },
          {
            label: "Value left",
            type: "number",
          },
        ]);
        break;
      default:
        break;
    }
  };

  function renderItems() {
    return options.map((option, key) => {
      return (
        <Dropdown.Item
          eventKey={option}
          className="attribute_selector"
          key={key}
        >
          {option}
        </Dropdown.Item>
      );
    });
  }

  function renderDropDow() {
    return (
      <Dropdown
        onSelect={handleSelect}
        className="attribute_selector"
        id="dropdown-autoclose-true"
      >
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selection}
        </Dropdown.Toggle>
        <Dropdown.Menu>{renderItems()}</Dropdown.Menu>
      </Dropdown>
    );
  }

  function renderUserInterface() {
    return (
      <React.Fragment>
        <Row>{renderDropDow()}</Row>
        <Row>{renderForm()}</Row>
      </React.Fragment>
    );
  }

  return (
    <Container className="mb-5">
      <Row style={{ fontWeight: "bold" }}>
        <Col className="title_font">Void2122 - Test</Col>
      </Row>
      <Row className="xs_center">{renderUserInterface()}</Row>
      <Row>
        <Col className="d-flex align-items-left justify-content-center m-2">
          <Button id="mint_button">
            <Link to="/" style={{ textDecoration: "none", color: "black" }}>
              Home
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

export default Admin;

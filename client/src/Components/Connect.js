import React, { Component } from "react";
import Web3 from "web3";
import { Button } from "react-bootstrap";
import { AccountInfoContext } from "../Context/AccountInfo";
import CorporationContract from "../contracts/Corporation.sol/Void2122Corporation.json";
import FactoryContract from "../contracts/Factory.sol/Void2122Factory.json";
import LootContract from "../contracts/Loot.sol/Void2122Loot.json";
import ModContract from "../contracts/Mod.sol/Void2122Mod.json";
import SchematicContract from "../contracts/Schematic.sol/Void2122Schematic.json";
import UnitContract from "../contracts/Unit.sol/Void2122Unit.json";
import * as contractData from "../contracts/contract-addresses.json";
import { Alchemy, Network } from "alchemy-sdk";

class Connect extends Component {
  static contextType = AccountInfoContext;

  componentDidMount = async () => {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      var provider = `https://GOERLI.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID1}`;
      var web3Provider = new Web3.providers.HttpProvider(provider);
      this.web3 = new Web3(web3Provider);
    }
    this.context.updateAccountInfo({ web3: this.web3 });
    if (this.web3) {
      await this.setNetwork();
      await this.getContractsInstances();
      if (window.ethereum || window.web3) {
        await this.setAccount();
      }
    }
  };

  async getContractsInstances() {
    this.networkId = await this.web3.eth.getChainId();
    this.context.updateAccountInfo({ networkId: this.networkId });

    this.CorporationInstance = new this.web3.eth.Contract(
      CorporationContract.abi,
      contractData.proxies.corporation
    );

    this.FactoryInstance = new this.web3.eth.Contract(
      FactoryContract.abi,
      contractData.proxies.factory
    );

    this.LootInstance = new this.web3.eth.Contract(
      LootContract.abi,
      contractData.proxies.loot
    );

    this.ModInstance = new this.web3.eth.Contract(
      ModContract.abi,
      contractData.proxies.mod
    );

    this.SchematicInstance = new this.web3.eth.Contract(
      SchematicContract.abi,
      contractData.proxies.schematic
    );

    this.UnitInstance = new this.web3.eth.Contract(
      UnitContract.abi,
      contractData.proxies.unit
    );

    this.context.updateAccountInfo({
      CorporationInstance: this.CorporationInstance,
      FactoryInstance: this.FactoryInstance,
      LootInstance: this.LootInstance,
      ModInstance: this.ModInstance,
      SchematicInstance: this.SchematicInstance,
      UnitInstance: this.UnitInstance,
    });
    this.getCorporationContractInfo();
    this.getFactoryContractInfo();
    this.getLootContractInfo();
    this.getModContractInfo();
    this.getModContractInfo();
    this.getSchematicContractInfo();
    this.getUnitContractInfo();
    this.context.updateAccountInfo({ instancesLoaded: true });
  }

  async setAccount() {
    if (this.context.networkId !== null) {
      let accounts = await this.web3.eth.getAccounts();
      await this.context.updateAccountInfo({ account: accounts[0] });
      if (this.context.account) this.getAccountsData(accounts[0]);
    } else {
      this.resetAccountData();
    }
  }

  resetAccountData() {
    this.context.updateAccountInfo({
      account: null,
    });
  }

  async setNetwork() {
    let networkId = await this.web3.eth.getChainId();
    this.context.updateAccountInfo({ networkId: networkId });
  }

  async getAccountsData() {
    if (
      this.context.networkId === parseInt(process.env.REACT_APP_GOERLI_NETWORK)
    ) {
      this.context.updateAccountInfo({
        walletETHBalance: await this.web3.eth.getBalance(this.context.account),
      });
      this.getVOID2122NFTs();
    }
  }

  async getVOID2122NFTs() {
    if (
      this.context.networkId === parseInt(process.env.REACT_APP_GOERLI_NETWORK)
    ) {
      const config = {
        apiKey: process.env.REACT_APP_ALCHEMY_KEY,
        network: Network.ETH_GOERLI,
      };
      const alchemy = new Alchemy(config);
      const response = await alchemy.nft.getNftsForOwner(this.context.account);
      const nfts = {
        corporation: [],
        factory: [],
        loot: [],
        mod: [],
        schematic: [],
        unit: [],
      };
      response.ownedNfts.map((nft, index) => {
        switch (nft.contract.address.toLowerCase()) {
          case contractData.proxies.corporation.toLowerCase():
            nfts.corporation.push(nft);
            break;
          case contractData.proxies.factory.toLowerCase():
            nfts.factory.push(nft);
            break;
          case contractData.proxies.loot.toLowerCase():
            nfts.loot.push(nft);
            break;
          case contractData.proxies.mod.toLowerCase():
            nfts.mod.push(nft);
            break;
          case contractData.proxies.schematic.toLowerCase():
            nfts.schematic.push(nft);
            break;
          case contractData.proxies.unit.toLowerCase():
            nfts.unit.push(nft);
            break;
          default:
            break;
        }
      });
      this.context.updateAccountInfo({ nfts: nfts });
      console.log(nfts);
    }
  }

  async getCorporationContractInfo() {
    if (
      this.context.networkId === parseInt(process.env.REACT_APP_GOERLI_NETWORK)
    ) {
    }
  }
  async getFactoryContractInfo() {
    if (
      this.context.networkId === parseInt(process.env.REACT_APP_GOERLI_NETWORK)
    ) {
    }
  }
  async getLootContractInfo() {
    if (
      this.context.networkId === parseInt(process.env.REACT_APP_GOERLI_NETWORK)
    ) {
    }
  }
  async getModContractInfo() {
    if (
      this.context.networkId === parseInt(process.env.REACT_APP_GOERLI_NETWORK)
    ) {
    }
  }
  async getSchematicContractInfo() {
    if (
      this.context.networkId === parseInt(process.env.REACT_APP_GOERLI_NETWORK)
    ) {
    }
  }
  async getUnitContractInfo() {
    if (
      this.context.networkId === parseInt(process.env.REACT_APP_GOERLI_NETWORK)
    ) {
    }
  }

  async connectWallet() {
    this.context.updateAccountInfo({ transactionInProgress: true });
    try {
      window.ethereum.enable();
    } catch (error) {
      console.log(error);
    }
    this.context.updateAccountInfo({ transactionInProgress: false });
  }

  getAccountStr(account) {
    let response =
      account.slice(0, 5) + "..." + account.substring(account.length - 2);
    return response;
  }

  renderUserInterface() {
    if (!this.context.account) {
      return (
        <Button
          variant="outline-light"
          className="interface_button"
          onClick={() => this.connectWallet()}
        >
          Connect
        </Button>
      );
    } else if (
      parseInt(this.context.networkId) !==
      parseInt(process.env.REACT_APP_GOERLI_NETWORK)
    ) {
      return (
        <p style={{ color: "white" }}>
          Please connect to{" "}
          {parseInt(process.env.REACT_APP_GOERLI_NETWORK) === 1
            ? "Ethereum GOERLI"
            : "the GOERLI Network"}
        </p>
      );
    } else
      return (
        <Button
          variant="outline-light"
          id="interface_connection"
          className="interface_button"
        >
          Connected as {this.getAccountStr(this.context.account)}
        </Button>
      );
  }

  render() {
    if (window.ethereum || window.web3) {
      if (this.web3) {
        window.ethereum.on("accountsChanged", async () => {
          await this.setAccount();
        });
        window.ethereum.on("chainChanged", async () => {
          await this.setNetwork();
          await this.setAccount();
        });
      }
    }
    return this.renderUserInterface();
  }
}

export default Connect;

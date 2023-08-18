import React, { Component, createContext } from "react";
import * as contractsData from "../contracts/contract-addresses.json";

export const AccountInfoContext = createContext();

class AccountInfoProvider extends Component {
  state = {
    corporationContract: contractsData.proxies.corporation,
    factoryContract: contractsData.proxies.factory,
    lootContract: contractsData.proxies.loot,
    modContract: contractsData.proxies.mod,
    schematicContract: contractsData.proxies.schematic,
    unitContract: contractsData.proxies.unit,
    account: null,
    networkId: null,
    transactionInProgress: false,
    userFeedback: null,
    contractNetwork: process.env.REACT_APP_MAINNET_NETWORK,
    walletETHBalance: 0,
    mintPrice: 0,
    signedMessage: null,
    nftsLoaded: false,
    connectWallet: null,
    instancesLoaded: false,
  };

  updateAccountInfo = (updatedData) => {
    for (const [key, value] of Object.entries(updatedData)) {
      this.setState((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    }
  };

  render() {
    return (
      <AccountInfoContext.Provider
        value={{
          ...this.state,
          updateAccountInfo: this.updateAccountInfo,
        }}
      >
        {this.props.children}
      </AccountInfoContext.Provider>
    );
  }
}
export default AccountInfoProvider;

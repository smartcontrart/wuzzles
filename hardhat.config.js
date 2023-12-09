require("@nomicfoundation/hardhat-toolbox");
require("hardhat-contract-sizer");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  //   solidity: {
  //     version: "0.8.17",
  //     settings: {
  //       optimizer: {
  //         enabled: true,
  //         runs: 1000,
  //       },
  //     },
  //   },
  //   etherscan: {
  //     apiKey: process.env.ETHERSCAN_API_KEY,
  //   },
  //   networks: {
  //     hardhat: {},
  //     goerli: {
  //       url: "https://goerli.infura.io/v3/" + process.env.INFURA_API_KEY,
  //       accounts: [`0x` + process.env.PRIVATE_KEY],
  //       timeout: 1000000,
  //     },
  //     mainnet: {
  //       url: "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY,
  //       gasPrice: 50e9,
  //       accounts: [`0x` + process.env.PRIVATE_KEY],
  //       timeout: 1000000,
  //     },
  //   },
  // };

  networks: {
    hardhat: {},
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/" + process.env.ALCHEMY_GOERLI,
      // url: "https://goerli.infura.io/v3/" + process.env.INFURA_API_KEY,
      chainId: 5,
      accounts: [
        process.env.PRIVATE_KEY !== undefined
          ? process.env.PRIVATE_KEY
          : "0x1234567890123456789012345678901234567890123456789012345678901234",
      ],
      timeout: 2000000,
    },
    mainnet: {
      url:
        "https://eth-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_MAINNET,
      chainId: 1,
      accounts: [process.env.PRIVATE_KEY],
      timeout: 1000000,
    },
  },
  etherscan: {
    apiKey: {
      mainnet:
        process.env.ETHERSCAN_API_KEY !== undefined
          ? process.env.ETHERSCAN_API_KEY
          : "",
      goerli:
        process.env.ETHERSCAN_API_KEY !== undefined
          ? process.env.ETHERSCAN_API_KEY
          : "",
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
};

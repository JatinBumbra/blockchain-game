const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: '*', // Any network (default: none)
    },
    ropsten: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MNEMONICS,
          `https://ropsten.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
        );
      },
      network_id: '3', // eslint-disable-line camelcase
      gas: 4465030,
      gasPrice: 10000000000,
    },
  },

  compilers: {
    solc: {
      version: '0.8.10', // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200,
        },
      },
    },
  },
};

// Ropsten Token Contract Address: 0xCD0F797cb54A64EF6EE0E80D24B0262e7FA2c5a0
// Ropsten Token Contract Transaction Hash: 0xcbb2f0c48218a88ed04ae3258165ee879e308474e64d29c71cf4a6e404bb0596

// Ropsten Game Contract Address: 0x874eD91691CBe515E4a8586b0d96dC3A9517de1c
// Ropsten Game Contract Transaction Hash: 0x021f4738bb6352193a1ef3ca440137c02e15ea61aff6aeb89171800ac360522e

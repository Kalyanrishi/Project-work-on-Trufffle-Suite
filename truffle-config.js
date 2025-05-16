module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost
      port: 7545,            // Match Ganache GUI port or use 8545 for CLI
      network_id: "*",       // Any network
    },
  },
  compilers: {
    solc: {
      version: "0.8.13",     // Must match your contract's pragma
    },
  },
};

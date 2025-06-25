require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "holesky",
  networks: {
    holesky: {
      url: "https://ethereum-holesky.publicnode.com",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 17000 
    }
  },

};
const Web3 = require('web3');
require('dotenv').config();

module.exports = function getWeb3() {
  const infuraApiKey = process.env.INFURA_API_KEY;
  return new Web3(`https://mainnet.infura.io/v3/${infuraApiKey}`);
};
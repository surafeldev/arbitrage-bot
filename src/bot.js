// Import dependencies
import 'dotenv/config';
import axios from 'axios';
import getweb3 from '../utils/web3';
import { getPriceFromExchange } from '../utils/priceFetcher';
import { sendTransaction } from '../utils/Transaction';

// Initialize web3
const web3 = getweb3();
const contractAddress = process.env.CONTRACT_ADDRESS;

// Create a contract instance
import contractABI from '../contracts/contractABI.json'; // contract ABI
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to get price from LibUbiquityPool
async function getPriceFromLibUbiquityPool() {
    const response = await axios.get(`${process.env.LIB_UBIQUITY_POOL_URL}/price`);
    return response.data.price;
}

// Function for arbitrage logic
async function performArbitrage() {
    try {
        const accounts = await web3.eth.getAccounts();
        const owner = accounts[0];
        const priceOnSecondaryMarket = await getPriceFromExchange();
        const priceOnLibUbiquityPool = await getPriceFromLibUbiquityPool();

        if (priceOnSecondaryMarket > priceOnLibUbiquityPool) {
            // Arbitrage Opportunity Found: Mint and Sell
            await mintDollarToken(owner);
            await sellDollarToken(priceOnSecondaryMarket, owner);
        } else if (priceOnSecondaryMarket < priceOnLibUbiquityPool) {
            // Arbitrage Opportunity Found: Buy and Redeem Dollar Token
            await buyDollarToken(priceOnSecondaryMarket, owner);
            await redeemDollarToken(owner);
        } else {
            console.log('No arbitrage opportunity found.');
        }

    } catch (error) {
        console.error('Error in arbitrage execution:', error);
    }
}

async function mintDollarToken(account) {
    try {
        const mint = contract.methods.mint();
        const gas = await mint.estimateGas({ from: account });
        const gasPrice = await web3.eth.getGasPrice();
        const data = mint.encodeABI();
        const nonce = await web3.eth.getTransactionCount(account);
        const tx = {
            to: contractAddress,
            data,
            gas,
            gasPrice,
            nonce,
        };
        const receipt = await sendTransaction(tx, process.env.PRIVATE_KEY);
        console.log('Mint transaction successful:', receipt);
    } catch (error) {
        console.error('Minting error:', error);
    }
}

async function sellDollarToken(price, account) {
    try {
        const sell = contract.methods.sell(price);
        const gas = await sell.estimateGas({ from: account });
        const gasPrice = await web3.eth.getGasPrice();
        const data = sell.encodeABI();
        const nonce = await web3.eth.getTransactionCount(account);

        const tx = {
            to: contractAddress,
            data,
            gas,
            gasPrice,
            nonce,
        };
        const receipt = await sendTransaction(tx, process.env.PRIVATE_KEY);
        console.log('Sell transaction successful:', receipt);
    } catch (error) {
        console.error('Selling error:', error);
    }
}

async function buyDollarToken(price, account) {
    try {
        const buy = contract.methods.buy(price);
        const gas = await buy.estimateGas({ from: account });
        const gasPrice = await web3.eth.getGasPrice();
        const data = buy.encodeABI();
        const nonce = await web3.eth.getTransactionCount(account);

        const tx = {
            to: contractAddress,
            data,
            gas,
            gasPrice,
            nonce,
        };
        const receipt = await sendTransaction(tx, process.env.PRIVATE_KEY);
        console.log('Buy transaction successful:', receipt);
    } catch (error) {
        console.error('Buying error:', error);
    }
}

async function redeemDollarToken(account) {
    try {
        const redeem = contract.methods.redeem();
        const gas = await redeem.estimateGas({ from: account });
        const gasPrice = await web3.eth.getGasPrice();
        const data = redeem.encodeABI();
        const nonce = await web3.eth.getTransactionCount(account);

        const tx = {
            to: contractAddress,
            data,
            gas,
            gasPrice,
            nonce,
        };
        const receipt = await sendTransaction(tx, process.env.PRIVATE_KEY);
        console.log('Redeem transaction successful:', receipt);
    } catch (error) {
        console.error('Redeeming error:', error);
    }
}

// Execute the bot
setInterval(performArbitrage, 30000); // Run every 30 seconds
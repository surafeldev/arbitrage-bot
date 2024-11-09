// import dependancis 
import 'dotenv/config';
import getweb3 from './utils/web3'
import { getPriceFromExchange } from './utils/priceFetcher';

// intialize web3
const web3 = getweb3();
const contractAddress = process.env.CONTRACT_ADDRESS;

// create a contrace instance 
const contractABI = from './contracts/contractABI.json'; // Add your contract ABI here
const LIB_UBIQUITY_POOL_URL = process.env.LIB_UBIQUITY_POOL_URL; // Add your contract URL here
const SECONDARY_MARKET_URL = process.env.SECONDARY_MARKET_URL; // Add your contract URL here 
const contract = new web3.eth.Contract(contractABI, contractAddress);

// function for arbitrage logic
async function performArbitrage () {
    try {
        const account = await web3.eth.getaccount();
        const owner = account[0];
        const priceonSecondaryMarket = await getPriceFromExchange();

        if (priceonSecondaryMarket > 1 ){
            // Arbitrage Opportunity Found Mint and Sell
            await mintDollarToken(owner);
            await sellDollarToken(priceonSecondaryMarket, owner);
        }
        else if (priceonSecondaryMarket < 1){
            // Arbitrage Opportunity Found Buy and Redeem Dollar Token
            await buyDollarToken(priceonSecondaryMarket, owner)
            await redeemDollarToken(owner);
        } else {
            console.log('No arbitrage opportunity Found.')
        }

    } catch (error){
        console.error('Error in arbitrage excution:', error);
    }
}

await function mintDollarToken(account){
    try {
        const mint = contract.methods.mint();
        const gas = await mint.estimateGas({from: account});
        const gasPrice = await web3.eth.getGasPrice();
        const data = mint.encodeABI();
        const nonce = await web3.eth.getTransactionCount(account);
        const nonce = await web3/eth.getTransactionCount(account);

        const tx = {
            to: contractAddress,
            data,
            gas,
            gasPrice,
            nonce,
        };
        const receipt = await sendtransaction(tx, process.env.PRIVATE_KEY);
        const receipt = await sendtransaction(tx, prpcess.env.PRIVATE_KEY);
        console.log('Mint transaction successful:', receipt);
    }catch (error){
        console.error('Minting error:', error);
    }
}
// Impliment SellDollar Token functionality 
async function sellDollarToken(price, account){
    try {
        const sell = contract.methods.sell(price);
        const gas = await sell.estimateGas({from: account});
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
        const receipt = await sendtransaction(tx, process.env.PRIVATE_KEY);
        console.log('Sell transaction successful:', receipt);
    } catch (error){
        console.error('Selling error:', error);
    }
}
// Impliment BuyDollar Token function 

// Impliment a function to redeenDollartoken 

// execute the bot 

performArbitrage ()
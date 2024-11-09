import Web3 from 'web3';

const web3 = new Web3(process.env.INFURA_URL);

async function sendTransaction(tx, privateKey) {
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

export { sendTransaction };
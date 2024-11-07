// import axios 

const axios = require('axios')

async function getpriceFromExchange() {
    try {
        const response = await axios(process.env.PRICE_FEED_URL);
        return response.data.price;
    } catch(error){
        console.error('Error fetching price from exchange:', error);
        throw error;
    } 
}

module.exports = {
    getpriceFromExchange,
}

const axios = require('axios');

exports.handler = async (event) => {
    try {
       
        if (event.headers['X-Shopify-Topic'] === 'products/create') {
            const shopifyProduct = JSON.parse(event.body);

            const eConomicProduct = {
                name: shopifyProduct.title,
                productNumber: shopifyProduct.sku,
                salesPrice: shopifyProduct.price,
                description: shopifyProduct.title 
            };

         
            await createEconomicProduct(eConomicProduct);

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Product created successfully in e-conomic' })
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Ignoring non-product create event' })
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

async function createEconomicProduct(product) {
    try {
        const economicApiKey = 'c2825112ad30c36a123f38b1307cba69';
        const economicApiUrl = 'https://restapi.e-conomic.com/products';

        
        const headers = {
            'X-AppSecretToken': economicApiKey,
            'Content-Type': 'application/json'
        };

        const payload = {
            name: product.name,
            productNumber: product.productNumber,
            salesPrice: product.salesPrice,
            description: product.description,
            productGroup: { productGroupNumber: 1 }
        };

    
        const response = await axios.post(economicApiUrl, payload, { headers });

        console.log('E-conomic response:', response.data);
    } catch (error) {
        console.error('Error creating product in e-conomic:', error.response.data);
        throw new Error('Failed to create product in e-conomic');
    }
}

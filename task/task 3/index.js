const axios = require('axios');

exports.handler = async (event) => {
    try {
        
        const orderData = JSON.parse(event.body);
        const orderId = orderData.id;
        const customerData = orderData.customer;
        const lineItems = orderData.line_items;

       
        const customer = await findOrCreateCustomer(customerData);

        
        const products = await findOrCreateProducts(lineItems);

        const invoiceId = await createDraftInvoice(customer, products, orderId);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'success', invoiceId })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'failure' })
        };
    }
};

async function findOrCreateCustomer(customerData) {
    try {
        
        const existingCustomer = await findCustomerByEmail(customerData.email);

        if (existingCustomer) {
        
            return existingCustomer;
        } else {
           
            const newCustomer = await createCustomer(customerData);
            return newCustomer;
        }
    } catch (error) {
      
       
        throw new Error('Failed to find or create customer in e-conomic');
    }
}


async function findCustomerByEmail(email) {
    try {
       
        const response = await axios.get(`https://api.e-conomic.com/customers?filter=email$eq${encodeURIComponent(email)}`, {
            headers: {
                'Content-Type': 'application/json',
             
                'X-AppSecretToken': 'c2825112ad30c36a123f38b1307cba69'
            }
        });

       
        if (response.data && response.data.length > 0) {

            return response.data[0];
        } else {
          
            return null;
        }
    } catch (error) {
       throw new Error('Failed to find customer by email in e-conomic');
    }
}


async function createCustomer(customerData) {
    try {
          const requestBody = {
            name: customerData.first_name + ' ' + customerData.last_name,
            email: customerData.email,
            telephoneAndFaxNumber: customerData.phone,
            address: customerData.address,
            postalCode: customerData.zip,
            city: customerData.city,
            country: customerData.country,
            customerGroup: { customerGroupNumber: 1 }, 
            vatZone: { vatZoneNumber: getVatZoneNumber(customerData.country) } 
        };


        const response = await axios.post('https://api.e-conomic.com/customers', requestBody, {
            headers: {
                'Content-Type': 'application/json',
               
                'X-AppSecretToken': 'c2825112ad30c36a123f38b1307cba69'
            }
        });

        return response.data;
    } catch (error) {

        console.error('Error creating customer:', error.response.data);
        throw new Error('Failed to create customer in e-conomic');
    }
}

function getVatZoneNumber(country) {
  
    switch (country.toLowerCase()) {
        case 'india':
            return 1;
        case 'european union':
            return 2;
        default:
            return 3;
    }
}



module.exports = {
    findOrCreateCustomer,
    findCustomerByEmail,
    createCustomer
};
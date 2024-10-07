const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  console.log('Netlify Function Invoked');
  
  const dataPath = path.join(__dirname, 'customers.json');
  console.log('Data path:', dataPath);
  
  try {
    if (event.httpMethod === 'GET') {
      console.log('Handling GET request');
      
      const data = await fs.readFile(dataPath, 'utf8').catch((err) => {
        console.warn('File not found, returning default data:', err.message);
        return JSON.stringify({ waitingCustomers: [], servedCustomers: [], ticketCounter: 1 });
      });
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: data,
      };
      
    } else if (event.httpMethod === 'PUT') {
      console.log('Handling PUT request');
      console.log('Request body:', event.body);
      
      let parsedBody;
      try {
        parsedBody = JSON.parse(event.body);
      } catch (err) {
        console.error('Failed to parse request body as JSON:', err);
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid JSON format' }),
        };
      }
      
      await fs.writeFile(dataPath, JSON.stringify(parsedBody));
      console.log('Data successfully written to customers.json');
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Data updated successfully' }),
      };
      
    } else {
      console.warn('Invalid HTTP method:', event.httpMethod);
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }
    
  } catch (error) {
    console.error('Internal server error:', error.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};

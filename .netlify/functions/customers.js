const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  console.log('Function invoked with event:', event);
  
  // Adjust the path to where `customers.json` is stored
  const dataPath = path.join(__dirname, 'customers.json');
  
  try {
    if (event.httpMethod === 'GET') {
      console.log('Handling GET request...');
      // Try reading the data file, if missing return a default empty structure
      const data = await fs.readFile(dataPath, 'utf8').catch(() => {
        console.log('customers.json file not found, returning default data.');
        return JSON.stringify({ waitingCustomers: [], servedCustomers: [], ticketCounter: 1 });
      });
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: data,
      };
      
    } else if (event.httpMethod === 'PUT') {
      console.log('Handling PUT request with body:', event.body);
      
      // Check if the request body is valid JSON
      let parsedBody;
      try {
        parsedBody = JSON.parse(event.body);
      } catch (parseError) {
        console.error('Invalid JSON in request body:', parseError);
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid JSON format' }),
        };
      }
      
      // Write the data to customers.json
      await fs.writeFile(dataPath, JSON.stringify(parsedBody));
      console.log('Data successfully written to customers.json');
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Data updated successfully' }),
      };
      
    } else {
      console.log('Invalid HTTP method');
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }
    
  } catch (error) {
    console.error('Server error in Netlify function:', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};

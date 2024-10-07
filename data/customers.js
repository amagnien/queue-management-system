const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  console.log('Function invoked with event:', event);
  const dataPath = path.join(__dirname, 'customers.json');

  try {
    if (event.httpMethod === 'GET') {
      const data = await fs.readFile(dataPath, 'utf8');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: data,
      };
    } else if (event.httpMethod === 'PUT') {
      await fs.writeFile(dataPath, event.body);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Data updated successfully' }),
      };
    } else {
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }
  } catch (error) {
    console.error('Error in Netlify function:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};

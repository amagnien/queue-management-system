const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  const dataPath = path.join(__dirname, 'customers.json');

  if (event.httpMethod === 'GET') {
    try {
      const data = await fs.readFile(dataPath, 'utf8');
      return {
        statusCode: 200,
        body: data,
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        // If the file doesn't exist, return an empty data structure
        return {
          statusCode: 200,
          body: JSON.stringify({ waitingCustomers: [], servedCustomers: [], ticketCounter: 1 }),
        };
      }
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to read data' }),
      };
    }
  } else if (event.httpMethod === 'PUT') {
    try {
      await fs.writeFile(dataPath, event.body);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data updated successfully' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to write data' }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};

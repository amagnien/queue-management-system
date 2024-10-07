const faunadb = require('faunadb');
const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
});

exports.handler = async (event, context) => {
  if (event.httpMethod === 'GET') {
    try {
      const result = await client.query(
        q.Get(q.Ref(q.Collection('customers'), 'data'))
      );
      return {
        statusCode: 200,
        body: JSON.stringify(result.data)
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to retrieve data' })
      };
    }
  } else if (event.httpMethod === 'PUT') {
    try {
      const data = JSON.parse(event.body);
      await client.query(
        q.Update(
          q.Ref(q.Collection('customers'), 'data'),
          { data: data }
        )
      );
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data updated successfully' })
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to update data' })
      };
    }
  }
  
  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};

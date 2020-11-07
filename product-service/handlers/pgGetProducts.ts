import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { Client } from 'pg';
import { corsHeaders } from './constants';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: +PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

export const pgGetProducts: APIGatewayProxyHandler = async () => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const { rows: products } = await client.query(`
        select p.id, p.title, p.description, p.price, s.count 
        from products as p inner join stocks as s on p.id = s.product_id;   
    `);

    console.log(products);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        products,
      }),
    };
  } catch (e) {
    return errorFetchProducts(e);
  } finally {
    client.end();
  }
};

function errorFetchProducts(e: { message: any; }): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 500,
    body: JSON.stringify({
      message: `error then fetch products: ${e.message}`,
    }),
  });
}

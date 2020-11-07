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

export const pgGetProductById: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters.id;
  if (!id) return errorIdIsNotDefined();

  const client = new Client(dbOptions);
  await client.connect();

  try {
    const { rows: products } = await client.query(`
        select p.id, p.title, p.description, p.price, s.count 
        from products as p inner join stocks as s on p.id = s.product_id
        where p.id = $1;   
    `, [id]);

    if (products.length == 0) return errorProductNotFound();

    const product = products[0];
    console.log(product);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        product,
      }),
    };
  } catch (e) {
    return errorFetchProducts(e);
  } finally {
    client.end();
  }
};

function errorIdIsNotDefined(): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 400,
    body: JSON.stringify({
      message: 'product Id is not defined in request',
    }),
  });
}

function errorProductNotFound(): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 404,
    body: JSON.stringify({
      message: 'product is not found',
    }),
  });
}

function errorFetchProducts(e: {
  message: any;
}): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 500,
    body: JSON.stringify({
      message: `error then fetch products: ${e.message}`,
    }),
  });
}

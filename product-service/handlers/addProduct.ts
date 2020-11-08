import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { Client } from 'pg';
import { corsHeaders } from '../common/constants';

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

export const addProduct: APIGatewayProxyHandler = async (event) => {
  const product = JSON.parse(event.body);
  if (!product) return errorBodyIsNotDefined();

  const client = new Client(dbOptions);
  await client.connect();

  try {
    var values = [product.title, product.description, product.price, product.count];
    await client.query(`
    with inserted_product as (
      insert into products (title, description, price)
        values ($1, $2, $3)
        returning id)
    insert into stocks (product_id, count)
    select id, $4 from inserted_product;  
    `, values);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        product,
      }),
    };
  } catch (e) {
    return errorAddProduct(e);
  } finally {
    client.end();
  }
};

function errorBodyIsNotDefined(): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 400,
    body: JSON.stringify({
      message: 'body is not defined',
    }),
  });
}

function errorAddProduct(e: {
  message: any;
}): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 500,
    body: JSON.stringify({
      message: `error then add product: ${e.message}`,
    }),
  });
}

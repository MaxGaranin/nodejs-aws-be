import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import Product from './../../entities/products';
import * as data from './../../db/productList.json';

export const getProductsList: APIGatewayProxyHandler = async (_context) => {
  const productsList = await fetchProductsList();
  return {
    statusCode: 200,
    body: JSON.stringify({
      productsList
    }),
  };
}

async function fetchProductsList(): Promise<Product[]> {
  await timeout(0);
  const productsList = data.default as Product[];
  return productsList;
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

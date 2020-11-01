import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import Product from './../../entities/products';
import * as data from './../../db/productList.json';

export const getProductsById: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const id = event['pathParameters']['id'];

  const productsList = await fetchProductsList();
  const product = productsList.find(
    (product: { id: string }) => product.id === id
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      product,
    }),
  };
};

async function fetchProductsList(): Promise<Product[]> {
  await timeout(0);
  const productsList = data.default as Product[];
  return productsList;
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

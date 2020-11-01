import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import fetchProductsList from './dbHelper';

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
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      product,
    }),
  };
};

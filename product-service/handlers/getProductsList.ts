import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import fetchProductsList from './dbHelper';

export const getProductsList: APIGatewayProxyHandler = async (_context) => {
  const productsList = await fetchProductsList();
  return {
    statusCode: 200,
    body: JSON.stringify({
      productsList,
    }),
  };
};

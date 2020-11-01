import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import fetchProductsList from './dbHelper';

export const getProductsList: APIGatewayProxyHandler = async (_context) => {
  const productsList = await fetchProductsList();
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },    
    body: JSON.stringify({
      productsList,
    }),
  };
};

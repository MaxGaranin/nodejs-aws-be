import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import fetchProductsList from './dbService';
import { corsHeaders } from './constants';

export const getProductsList: APIGatewayProxyHandler = async () => {
  const productsList = await fetchProductsList();
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      productsList,
    }),
  };
};

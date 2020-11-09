import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { CORS_HEADERS } from '../common/constants';
import repository from '../db/productRepository';

export const getProducts: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda function getProducts has invoked');
  console.log('event: ', event);

  try {
    const products = await repository.getProducts();

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(products),
    };
  } catch (e) {
    return errorFetchProducts(e);
  }
};

function errorFetchProducts(e: {
  message: any;
}): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 500,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      message: `error then get products: ${e.message}`,
    }),
  });
}

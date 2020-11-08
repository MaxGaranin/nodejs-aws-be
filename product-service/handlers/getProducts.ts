import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { corsHeaders } from '../common/constants';
import repository from '../db/productRepository';

export const getProducts: APIGatewayProxyHandler = async () => {
  try {
    const products = await repository.getProducts();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        products,
      }),
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
    body: JSON.stringify({
      message: `error then get products: ${e.message}`,
    }),
  });
}

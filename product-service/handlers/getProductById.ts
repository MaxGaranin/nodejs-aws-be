import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { corsHeaders } from '../common/constants';
import repository from '../db/productRepository';

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters.id;
  if (!id) return errorIdIsNotDefined();

  try {
    const product = await repository.getProductById(id);
    if (!product) return errorProductNotFound();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        product,
      }),
    };
  } catch (e) {
    return errorFetchProducts(e);
  }
};

function errorIdIsNotDefined(): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 400,
    body: JSON.stringify({
      message: 'product id is not defined in request',
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
      message: `error then get product by id: ${e.message}`,
    }),
  });
}

import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { CORS_HEADERS } from '../common/constants';
import repository from '../db/productRepository';

export const getProductById: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda function getProductById has invoked');
  console.log('event: ', event);
  console.log('event.pathParameters: ', event.pathParameters);

  const id = event.pathParameters.id;
  if (!id) return errorIdIsNotDefined();

  try {
    const product = await repository.getProductById(id);
    if (!product) return errorProductNotFound();

    return success(product);
  } catch (e) {
    return errorFetchProducts(e);
  }
};

function success(product): Promise<any> {
  return Promise.resolve({
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(product),
  });
}

function errorIdIsNotDefined(): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 400,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      message: 'product id is not defined in request',
    }),
  });
}

function errorProductNotFound(): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 404,
    headers: CORS_HEADERS,
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
    headers: CORS_HEADERS,
    body: JSON.stringify({
      message: `error on get product by id: ${e.message}`,
    }),
  });
}

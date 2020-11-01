import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import fetchProductsList from './dbService';
import { corsHeaders } from './constants';

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters.id;

  if (!id) return errorIdIsNotDefined();

  const productsList = await fetchProductsList();
  const product = productsList.find(
    (product: { id: string }) => product.id === id
  );

  if (!product) return errorProductNotFound();

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      product,
    }),
  };
};

function errorIdIsNotDefined(): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 400,
    body: JSON.stringify({
      message: 'product Id is not defined in request',
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

import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { corsHeaders } from '../common/constants';
import isValid from '../db/productValidator';
import repository from '../db/productRepository';

export const addProduct: APIGatewayProxyHandler = async (event) => {
  const productData = JSON.parse(event.body);
  if (!isValid(productData)) return errorProductDataIsInvalid();

  try {
    const product = await repository.addProduct(productData);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        product,
      }),
    };
  } catch (e) {
    return errorAddProduct(e);
  }
};

function errorProductDataIsInvalid(): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 400,
    body: JSON.stringify({
      message: 'product data is invalid',
    }),
  });
}

function errorAddProduct(e: { message: any }): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 500,
    body: JSON.stringify({
      message: `error then add product: ${e.message}`,
    }),
  });
}

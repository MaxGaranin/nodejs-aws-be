import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import fetchProductsList from './dbService';
import { corsHeaders } from './constants';
import Product from '../../entities/product';

export const getProductsList: APIGatewayProxyHandler = async () => {

  let productsList: Product[];
  try {
    productsList = await fetchProductsList();
  }
  catch (e) {
    return errorFetchProducts(e);
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      productsList,
    }),
  };
};

function errorFetchProducts(e): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 500,
    body: JSON.stringify({
      message: `error then fetch products: ${e.message}`,
    }),
  });
}
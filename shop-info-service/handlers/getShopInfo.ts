import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const getShopInfo: APIGatewayProxyHandler = async (_context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      shopName: 'Books Store',
      workingHours: 'From 9:00 till 19:00'
    }),
  };
}

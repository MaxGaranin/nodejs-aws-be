import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const getShopAdminInfo: APIGatewayProxyHandler = async (event, _context) => {
  console.log('lambda invocation with event', event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      shopAdminName: 'Sergey',
    }),
  };
}

import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { CORS_HEADERS } from '../common/constants';

const AWS = require('aws-sdk');
const BUCKET = 'rss-aws-task5';

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda function importProductsFile has invoked');
  console.log('event: ', event);
  console.log('event.queryStringParameters: ', event.queryStringParameters);

  const { name } = event.queryStringParameters;
  const filePath = `uploaded/${name}`;

  const s3 = new AWS.S3({ region: 'eu-west-1' });

  const params = {
    Bucket: BUCKET,
    Key: filePath,
    Expires: 60,
    ContentType: 'text/csv'
  };

  return new Promise<APIGatewayProxyResult>((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (error, url) => {
      if (error) return reject(error);

      resolve({
        statusCode: 200,
        headers: CORS_HEADERS,
        body: url,
      });
    });
  });
};

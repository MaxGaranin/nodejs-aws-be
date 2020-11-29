import { SQSEvent, SQSHandler } from 'aws-lambda';
import SNS from 'aws-sdk/clients/sns';
import 'source-map-support/register';

import { CORS_HEADERS } from '../../authorization-service/common/constants';
import validate from '../db/productValidator';
import repository from '../db/productRepository';

export const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
  console.log('Lambda function catalogBatchProcess has invoked');
  console.log('event: ', event);

  const products = [];

  for (const record of event.Records) {
    const { body } = record;

    try {
      const productData = JSON.parse(body);

      var validationInfo = validate(productData);
      if (!validationInfo.result) {
        console.error(`error on validate product: ${validationInfo.message}`);
        return errorProductDataIsInvalid(validationInfo.message);
      }

      const product = await repository.addProduct(productData);
      products.push(product);

      console.log(`product successfully added: ${JSON.stringify(product)}`);
    } catch (e) {
      console.error(`error on add product: ${e.message}`);
      return errorAddProduct(e);
    }
  }

  await snsNotify(products);
  
  return success(products);
};

function snsNotify(products) {
  const sns = new SNS({ region: 'eu-west-1' });
  
  console.log('snsNotify invoked');
  console.log(JSON.stringify(products));

  return new Promise((resolve, reject) => {
    sns.publish(
      {
        Subject: 'New products added',
        Message: JSON.stringify(products),
        TopicArn: process.env.SNS_ARN,
      },
      (error) => {
        if (error) {
          console.error('Error when send notify message on add products: ', error);
          reject();
        } else {
          console.log('Send notify message on add products');
          resolve();
        }
      }
    );
  });
}

function success(product): Promise<any> {
  return Promise.resolve({
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(product),
  });
}

function errorProductDataIsInvalid(message: string): Promise<any> {
  return Promise.resolve({
    statusCode: 400,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      message,
    }),
  });
}

function errorAddProduct(e: { message: any }): Promise<any> {
  return Promise.resolve({
    statusCode: 500,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      message: `error on add product: ${e.message}`,
    }),
  });
}

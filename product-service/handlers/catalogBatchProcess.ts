import { SQSEvent, SQSHandler } from "aws-lambda";
import "source-map-support/register";

import { CORS_HEADERS } from "../common/constants";
import validate from "../db/productValidator";
import repository from "../db/productRepository";

export const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
  console.log("Lambda function catalogBatchProcess has invoked");
  console.log("event: ", event);

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

      console.log(`product successfully added: ${JSON.stringify(productData)}`);

      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(product),
      };
    } catch (e) {
      console.error(`error on add product: ${e.message}`);
      return errorAddProduct(e);
    }
  }
};

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

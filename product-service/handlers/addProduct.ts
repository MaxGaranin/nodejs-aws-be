import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";

import { CORS_HEADERS } from "../../authorization-service/common/constants";
import validate from "../db/productValidator";
import repository from "../db/productRepository";

export const addProduct: APIGatewayProxyHandler = async (event) => {
  console.log("Lambda function addProduct has invoked");
  console.log("event: ", event);
  console.log("event.body: ", event.body || "");

  if (!event.body) {
    return errorProductDataIsInvalid("body is empty");
  }

  try {
    const productData = JSON.parse(event.body);

    var validationInfo = validate(productData);
    if (!validationInfo.result) {
      return errorProductDataIsInvalid(validationInfo.message);
    }

    const product = await repository.addProduct(productData);

    return success(product);
  } catch (e) {
    return errorAddProduct(e);
  }
};

function success(product): Promise<any> {
  return Promise.resolve({
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(product),
  });
}

function errorProductDataIsInvalid(message: string): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 400,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      message,
    }),
  });
}

function errorAddProduct(e: { message: any }): Promise<APIGatewayProxyResult> {
  return Promise.resolve({
    statusCode: 500,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      message: `error on add product: ${e.message}`,
    }),
  });
}

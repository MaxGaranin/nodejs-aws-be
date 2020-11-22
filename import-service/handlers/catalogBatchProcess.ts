import { SQSEvent, SQSHandler } from 'aws-lambda';
import 'source-map-support/register';

export const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
  console.log('Lambda function catalogBatchProcess has invoked');
  console.log('event: ', event);

  const products = event.Records.map(({body}) => body);

  console.log(products);
};

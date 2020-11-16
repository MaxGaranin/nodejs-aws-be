import csv from 'csv-parser';
import S3 from 'aws-sdk/clients/s3';
import { S3Event } from 'aws-lambda';

const BUCKET = 'rss-aws-task5';

export const importFileParser = async (event: S3Event) => {
  console.log('Lambda function importFileParser has invoked');
  console.log('event: ', event);

  const s3 = new S3({ region: 'eu-west-1' });

  try {
    for (const record of event.Records) {
      const { key } = record.s3.object;

      const s3Stream = s3
        .getObject({
          Bucket: BUCKET,
          Key: key,
        })
        .createReadStream();

      await new Promise((resolve, reject) => {
        s3Stream
          .pipe(csv())
          .on('data', (data) => {
            console.log(data);
          })
          .on('error', (error) => {
            reject(error);
          })
          .on('end', async () => {
            console.log(`Copy from ${BUCKET}/${key}`);

            await s3
              .copyObject({
                Bucket: BUCKET,
                CopySource: `${BUCKET}/${key}`,
                Key: key.replace('uploaded', 'parsed'),
              })
              .promise();

            console.log(
              `Copy to ${BUCKET}/${key.replace('uploaded', 'parsed')}`
            );

            await s3
              .deleteObject({
                Bucket: BUCKET,
                Key: key,
              })
              .promise();

            console.log(`Delete ${BUCKET}/${key}`);

            resolve();
          });
      });
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }

  return {
    statusCode: 202,
    message: 'File was copied and parsed',
  };
};

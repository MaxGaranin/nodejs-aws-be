import csv from 'csv-parser';
import S3 from 'aws-sdk/clients/s3';
import { S3Event } from 'aws-lambda';

const BUCKET = 'rss-aws-task5';

export const importFileParser = (event: S3Event) => {
  console.log('Lambda function importFileParser has invoked');
  console.log('event: ', event);

  const s3 = new S3({ region: 'eu-west-1' });

  for (const record of event.Records) {
    const { key } = record.s3.object;

    const s3Stream = s3
      .getObject({
        Bucket: BUCKET,
        Key: key,
      })
      .createReadStream();

    s3Stream
      .pipe(csv())
      .on('data', (data) => {
        console.log(data);
      })
      .on('error', (error) => {
        return errorParseFile(error);
      })
      .on('end', () => {
        console.log(`Copy from ${BUCKET}/${key}`);

        try {
          s3.copyObject({
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${key}`,
            Key: key.replace('uploaded', 'parsed'),
          });

          console.log(`Copy to ${BUCKET}/${key.replace('uploaded', 'parsed')}`);

          s3.deleteObject({
            Bucket: BUCKET,
            Key: key,
          });

          console.log(`Delete ${BUCKET}/${key}`);
        } catch (error) {
          return errorParseFile(error);
        }
      });
  }

  return successParseFile();
};

function successParseFile() {
  return {
    statusCode: 202,
    body: 'File was copied and parsed',
  };
}

function errorParseFile(e: { message: any }) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: `Error on parse and copy file: ${e.message}`,
    }),
  };
}

import 'source-map-support/register';

const AWS = require('aws-sdk');
const csv = require('csv-parser');
const BUCKET = 'rss-aws-task5';

export const importFileParser = async (event) => {
  console.log('Lambda function importFileParser has invoked');
  console.log('event: ', event);

  const s3 = new AWS.S3({ region: 'eu-west-1' });

  console.log(event.Records.length);
  console.dir(event.Records[0]);

  event.Records.forEach(async (record) => {
    const s3Stream = s3
      .getObject({
        Bucket: BUCKET,
        Key: record.s3.object.key,
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
          const uploadedPath = `${BUCKET}/${record.s3.object.key}`;
          const parsedPath = record.s3.object.key.replace('uploaded', 'parsed');

          console.log(`Copy from ${uploadedPath}`);

          await s3
            .copyObject({
              Bucket: BUCKET,
              CopySource: uploadedPath,
              Key: parsedPath,
            })
            .promise();

          console.log(`Copied into ${parsedPath}`);

          resolve();
        });
    });
  });
};

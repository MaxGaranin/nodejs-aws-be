import 'source-map-support/register';

const AWS = require('aws-sdk');
const csv = require('csv-parser');
const BUCKET = 'rss-aws-task5';

export const importFileParser = async (event) => {
  console.log('Lambda function importFileParser has invoked');
  console.log('event: ', event);

  const s3 = new AWS.S3({ region: 'eu-west-1' });

  event.Records.forEach(async (record) => {
    console.dir(record);

    const s3Stream = s3
      .getObject({
        Bucket: BUCKET,
        Key: record.s3.object.key,
      })
      .createReadStream();

    try {
      await new Promise((resolve, reject) => {
        console.log(`------------in promise----------`);
        s3Stream
          .pipe(csv())
          .on('data', (data) => {
            console.log(data);
          })
          .on('error', (error) => {
            console.log(`------------error----------`);
            reject(error);
          })
          .on('end', async () => {
            console.log(`------------end----------`);
            const uploadedPath = `${BUCKET}/${record.s3.object.key}`;
            const parsedPath = record.s3.object.key.replace(
              'uploaded',
              'parsed'
            );

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
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
      };
    }
  });

  return {
    statusCode: 202,
  };
};

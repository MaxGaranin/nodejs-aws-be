import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-pseudo-parameters'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      IMPORT_SQS_URL:
        '${cf:product-service-${self:provider.stage}.SQSQueueUrl}',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: ['arn:aws:s3:::rss-aws-task5'],
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: ['arn:aws:s3:::rss-aws-task5/*'],
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: '${cf:product-service-${self:provider.stage}.SQSQueueArn}',
      },
    ],
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: true,
            request: {
              parameters: {
                querystrings: {
                  name: true,
                },
              },
            },
            authorizer: {
              arn:
                'arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:authorization-service-dev-basicAuthorizer',
              resultTtlInSeconds: 0,
              identitySource: 'method.request.header.Authorization',
              type: 'token',
            },
          },
        },
      ],
    },
    importFileParser: {
      handler: 'handler.importFileParser',
      events: [
        {
          s3: {
            bucket: 'rss-aws-task5',
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: 'uploaded/',
                suffix: '',
              },
            ],
            existing: true,
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      GatewayResponseDenied: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': '\'*\'',
            'gatewayresponse.header.Access-Control-Allow-Headers': '\'*\'',
            'gatewayresponse.header.Access-Control-Allow-Credentials': '\'true\''
          },
          ResponseType: 'ACCESS_DENIED',
          RestApiId: { Ref: 'ApiGatewayRestApi' },
        },
      },
      GatewayResponseUnauthorized: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': '\'*\'',
            'gatewayresponse.header.Access-Control-Allow-Headers': '\'*\'',
            'gatewayresponse.header.Access-Control-Allow-Credentials': '\'true\''
          },
          ResponseType: 'UNAUTHORIZED',
          RestApiId: { Ref: 'ApiGatewayRestApi' },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;

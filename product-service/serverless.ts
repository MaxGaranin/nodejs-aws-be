import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      PG_HOST: 'lesson4-instance.cpkgtjtdooq7.eu-west-1.rds.amazonaws.com',
      PG_PORT: 5432,
      PG_DATABASE: 'book_shop',
      PG_USERNAME: 'postgres',
      PG_PASSWORD: 'QL1XCjZhJJXd2k9zH3FC',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    getProductsList: {
      handler: 'handler.getProductsList',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true,
          },
        },
      ],
    },
    getProductsById: {
      handler: 'handler.getProductsById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{id}',
            cors: true,
          },
        },
      ],
    },
    pgGetProducts: {
      handler: 'handler.pgGetProducts',
      events: [
        {
          http: {
            method: 'get',
            path: 'pgproducts',
            cors: true,
          },
        },
      ],
    },
    pgGetProductById: {
      handler: 'handler.pgGetProductById',
      events: [
        {
          http: {
            method: 'get',
            path: 'pgproducts/{id}',
            cors: true,
          },
        },
      ],
    },    
    pgAddProduct: {
      handler: 'handler.pgAddProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'pgproducts',
            cors: true,
          },
        },
      ],
    },    
  },
};

module.exports = serverlessConfiguration;

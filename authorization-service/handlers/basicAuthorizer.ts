import "source-map-support/register";

export const basicAuthorizer = (event, cb) => {
  console.log("Lambda function basicAuthorizer has invoked");
  console.log("event: ", event);

  if (event.type != 'TOKEN') {
    return cb('Unauthorized');
  }

  try {
    const { authorizationToken } = event;
    
    const encodedCredentials = authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCredentials, 'base64');
    const plainCredentials = buff.toString('utf-8').split(':');
    const userName = plainCredentials[0];
    const password = plainCredentials[1];

    console.log(`userName: ${userName}, password: ${password}`);

    const storedUserPassword = process.env[userName];
    const effect = !storedUserPassword || storedUserPassword != password
      ? 'Deny'
      : 'Allow';

    const policy = generatePolicy(encodedCredentials, event.methodArn, effect);

    cb(null, policy);
  } catch (error) {
    return cb(`Unauthorized: ${error.message}`);
  }
};

const generatePolicy = (principalId, resource, effect = 'Allow') => {
  return {
    principalId,
    policyDocument: {
      Version: '2020-10-17',
      Statements: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  };
}
const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios').default;
const cache = require('./cache');

dotenv.config();
const port = process.env.PORT || 3001;

const app = express();
app.use(express.json());

app.all('/*', cache(120, 'products'), (req, res) => {
  console.log('originalUrl', req.originalUrl); // /products/main?res=all
  console.log('method', req.method); // POST, GET
  console.log('body', req.body); // { name: 'product-1', count: 12 }

  const { originalUrl, method, body } = req;

  const delimiters = /\/|\?/; // delimiters ['/', '?']
  const recipient = originalUrl.split(delimiters)[1];
  console.log('recipient', recipient);
  const reminder = originalUrl.slice(recipient.length + 2); // '/recipient/'
  console.log('reminder', reminder);

  const recipientUrl = process.env[recipient];
  console.log('recipientUrl', recipientUrl);

  if (recipientUrl) {
    const axiosConfig = {
      method,
      url: `${recipientUrl}/${reminder}`,
      ...(Object.keys(body || {}).length > 0 && { data: body }),
    };

    const token = req.headers['authorization'];
    if (token) {
      axiosConfig.headers = {
        Authorization: token,
      };
    }

    console.log('axiosConfig', axiosConfig);

    axios(axiosConfig)
      .then((response) => {
        console.log('Response from recipient', response.data);
        res.json(response.data);
      })
      .catch((error) => {
        console.log('Error', JSON.stringify(error));

        if (error.response) {
          const { status, data } = error.response;
          res.status(status).json(data);
        } else {
          res.status(500).json({ error: error.message });
        }
      });
  } else {
    res.status(502).json({ error: 'Cannot process request' });
  }
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

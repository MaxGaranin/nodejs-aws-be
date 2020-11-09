import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: +PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

async function getProducts() {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const { rows: products } = await client.query(`
          select p.id, p.title, p.description, p.price, s.count 
          from products as p inner join stocks as s on p.id = s.product_id;   
      `);

    return products;
  } finally {
    client.end();
  }
}

async function getProductById(id: string) {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const { rows: products } = await client.query(
      `
        select p.id, p.title, p.description, p.price, s.count 
        from products as p inner join stocks as s on p.id = s.product_id
        where p.id = $1;   
    `,
      [id]
    );

    if (products.length == 0) {
      return null;
    }

    const product = products[0];
    return product;
  } finally {
    client.end();
  }
}

async function addProduct(productData) {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    var values = [
      productData.title,
      productData.description,
      productData.price,
      productData.count,
    ];

    const { rows } = await client.query(
      `
    with inserted_product as (
      insert into products (title, description, price)
        values ($1, $2, $3)
        returning id)
    insert into stocks (product_id, count)
    select id, $4 from inserted_product
    returning product_id as id;  
    `,
      values
    );

    const id = rows[0].id;
    const product = getProductById(id);
    return product;
  } finally {
    client.end();
  }
}

export default { getProducts, getProductById, addProduct };

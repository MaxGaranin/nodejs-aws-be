import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000
};

export const pgGetProducts = async event => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        const { rows: products } = await client.query(`select * from products`);
        console.log(products);

        console.log('-------------');
        console.log(PG_HOST);
    }
    catch (err) {
        console.log('Error during database request operations', err);
    }
    finally {
        client.end();
    }
};

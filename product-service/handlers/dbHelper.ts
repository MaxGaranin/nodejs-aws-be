import Product from '../../entities/product';
import * as data from '../../db/productList.json';

export default async function fetchProductsList(): Promise<Product[]> {
  await timeout(0);
  const productsList = data.default as Product[];
  return productsList;
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

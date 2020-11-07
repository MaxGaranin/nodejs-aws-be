import 'source-map-support/register';

import { getProductsList } from './handlers/getProductsList';
import { getProductsById } from './handlers/getProductsById';
import { pgGetProducts } from './handlers/pgGetProducts';
import { pgGetProductById } from './handlers/pgGetProductById';

export {getProductsList, getProductsById, pgGetProducts, pgGetProductById};

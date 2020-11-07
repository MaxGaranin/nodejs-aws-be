import 'source-map-support/register';

import { getProductsList } from './handlers/getProductsList';
import { getProductsById } from './handlers/getProductsById';
import { pgGetProducts } from './handlers/pg-client-lambda';

export {getProductsList, getProductsById, pgGetProducts};

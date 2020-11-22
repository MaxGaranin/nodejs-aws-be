import 'source-map-support/register';

import { getProducts } from './handlers/getProducts';
import { getProductById } from './handlers/getProductById';
import { addProduct } from './handlers/addProduct';
import { catalogBatchProcess } from './handlers/catalogBatchProcess';

export {
  getProducts,
  getProductById,
  addProduct,
  catalogBatchProcess
};

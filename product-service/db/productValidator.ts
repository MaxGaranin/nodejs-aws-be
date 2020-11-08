export default function isValid(productData) {
    const { title, price, count } = productData;
    if (
      typeof title === 'string' && title &&
      typeof price === 'number' && price > 0 &&
      typeof count === 'number' && count >= 0
    ) {
      return true;
    }
  
    return false;
  }
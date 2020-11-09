export default function validate(productData) {
  const { title, price, count } = productData;

  if (!title || title.length === 0) {
    return {
      result: false,
      message: 'title is not defined or empty'
    };
  }

  if (!price || +price <= 0) {
    return {
      result: false,
      message: 'price should be more than zero'
    };
  }

  if (!count || +count < 0) {
    return {
      result: false,
      message: 'count should be more or equal than zero'
    };
  }

  return {
    result: true,
    message: 'productData is valid'
  };
}

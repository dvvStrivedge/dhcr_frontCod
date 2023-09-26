export function generateCartItem(item: any) {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    unit: item.unit,
    image: item.image?.thumbnail,
    stock: item.quantity,
    price: Number(item.sale_price ? item.sale_price : item.price),
    shop: {
      slug: item.shop.slug,
      name: item.shop.name,
    },
    language: item.language,
    three_days_discount: item.three_days_discount,
    one_week_discount: item.one_week_discount,
    one_months_discount: item.one_months_discount,
  };
}

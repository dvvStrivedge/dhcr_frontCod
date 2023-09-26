import usePrice from '@/lib/hooks/use-price';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import routes from '@/config/routes';
import {
  addItemWithQuantity,
  type Item,
} from '@/components/cart/lib/cart.utils';
import placeholder from '@/assets/images/placeholders/product.svg';
import Input from '../ui/forms/input';
import { useCart } from './lib/cart.context';
import { useState } from 'react';
import Counter from '../ui/counter';
import { CloseIcon } from '../icons/close-icon';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function CartItem({
  items,
  item,
  notAvailable,
}: {
  items: Item[];
  item: Item;
  notAvailable?: boolean;
}) {
  const [value, setValue] = useState(item.quantity.toString());
  const {
    name,
    image,
    slug,
    price,
    shop,
    quantity,
    three_days_discount,
    one_months_discount,
    one_week_discount,
  } = item;

  const { price: itemPrice } = usePrice({
    amount: price,
  });
  const { t } = useTranslation('common');

  const {
    updateCartQuantity,
    addItemToCart,
    removeItemFromCart,
    isInStock,
    clearItemFromCart,
  } = useCart();

  function onQuantityChange(item: any, quantity: string) {
    // validation for quantity can be only number and not more than 99
    let numericValue = quantity.replace(/[^0-9]/g, '');
    if (parseInt(numericValue) > 99) {
      return;
    }
    // if (numericValue === '') {
    //   numericValue = '1';
    // }
    setValue(numericValue);

    updateCartQuantity(item, parseInt(numericValue));
  }

  function handleIncrement(e: any) {
    e.stopPropagation();
    addItemToCart(item, 1);
  }

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCart(item.id);
  };

  const outOfStock = !isInStock(item.id);

  function handleClearItemFromCart(id: number | string) {
    clearItemFromCart(id);
    toast.success(<b>{t('text-remove-item-from-cart-message')}</b>);
  }

  return (
    <div className="flex w-full items-start gap-4 py-3">
      <div className="flex-shrink-0">
        <Counter
          value={item.quantity}
          onDecrement={handleRemoveClick}
          onIncrement={handleIncrement}
          variant="pillVertical"
          disabled={outOfStock}
        />
      </div>
      <div className="relative aspect-[5/3.4] w-28 flex-shrink-0 border border-light-300 bg-light-300 dark:border-0 dark:bg-dark-500 xs:w-32">
        <Image
          alt={name}
          fill
          src={image ?? placeholder}
          className="object-cover"
        />
      </div>
      <div className="w-[calc(100%-125px)] text-13px font-medium xs:w-[calc(100%-145px)] sm:w-[calc(100%-150px)]">
        {notAvailable && (
          <span className="mb-1 inline-block rounded-2xl text-xs font-semibold text-red-500">
            Not Available
          </span>
        )}
        <h3 className="truncate text-dark dark:text-light">
          <AnchorLink
            href={routes.productUrl(slug)}
            className="transition-colors hover:text-brand-dark"
          >
            {name}
          </AnchorLink>
        </h3>
        <div className="mt-1 mb-2.5">
          <AnchorLink
            href={routes.shopUrl(shop?.slug)}
            className="text-light-base transition-colors hover:text-brand-dark dark:text-dark-base"
          >
            {shop?.name}
          </AnchorLink>
        </div>
        <div className="flex items-center justify-between gap-1">
          <span className="rounded-2xl bg-light-300 p-1.5 font-semibold uppercase leading-none text-brand-dark dark:bg-dark-500">
            {itemPrice}
          </span>
          {/* <span className="text-light-base dark:text-dark-base">X </span> */}
          <button
            type="button"
            className="absolute top-1/2 -mt-3.5 flex-shrink-0 p-2 font-medium text-dark-900 hover:text-dark dark:text-dark-800 dark:hover:text-light-900"
            onClick={() => handleClearItemFromCart(item.id)}
            style={{ left: 'calc(100% - 40px)' }}
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
          {/* <span className="w-28">
            {' '}
            <Input
              type="string"
              label=""
              value={value}
              onChange={(e) => onQuantityChange(item, e.target.value)}
            />
          </span> */}
        </div>
      </div>
    </div>
  );
}

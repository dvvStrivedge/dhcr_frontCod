import cn from 'classnames';
import toast from 'react-hot-toast';
import { useCart } from '@/components/cart/lib/cart.context';
import { CloseIcon } from '@/components/icons/close-icon';
import CartItem from '@/components/cart/cart-item';
import { useTranslation } from 'next-i18next';
import CartCheckOutItem from '@/components/cart/cart-checkout-item';

export default function CartCheckoutItemList({
  className,
}: {
  className?: string;
}) {
  const { t } = useTranslation('common');
  const { items, clearItemFromCart, verifiedResponse } = useCart();
  function handleClearItemFromCart(id: number | string) {
    clearItemFromCart(id);
    toast.success(<b>{t('text-remove-item-from-cart-message')}</b>);
  }

  return (
    <ul role="list" className={cn('-my-6 w-full', className)}>
      {items.map((item) => {
        const notAvailable = verifiedResponse?.unavailable_products?.find(
          (id) => id === item.id
        );
        return (
          <li
            key={item.id}
            className="relative ml-4 flex border-b border-light-300 last-of-type:border-b-0 dark:border-dark-500 xs:ml-6"
          >
            <button
              type="button"
              className="absolute -left-8 top-1/2 -mt-3.5 flex-shrink-0 p-2 font-medium text-dark-900 hover:text-dark dark:text-dark-800 dark:hover:text-light-900 xs:-left-10"
              onClick={() => handleClearItemFromCart(item.id)}
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
            <CartCheckOutItem
              item={item}
              notAvailable={!!notAvailable}
              items={items}
            />
          </li>
        );
      })}
    </ul>
  );
}

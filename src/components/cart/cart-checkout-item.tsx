import usePrice from '@/lib/hooks/use-price';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import routes from '@/config/routes';
import { type Item } from '@/components/cart/lib/cart.utils';
import placeholder from '@/assets/images/placeholders/product.svg';
import { useCart } from '@/components/cart/lib/cart.context';
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import Button from '@/components/ui/button';
import { useMutation } from 'react-query';
import client from '@/data/client';

export default function CartCheckOutItem({
  items,
  item,
  notAvailable,
}: {
  items: Item[];
  item: Item;
  notAvailable?: boolean;
}) {
  const { name, image, slug, price, shop, quantity } = item;

  const { mutate, isLoading } = useMutation(client.products.checkAvailability, {
    onSuccess: (res) => {
      // setVerifiedResponse(res);
    },
  });

  const { price: itemPrice } = usePrice({
    amount: price,
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const { updateCartQuantity } = useCart();

  function onQuantityChange(item: any, quantity: number) {
    updateCartQuantity(item, quantity);
  }

  function onCheckAvailableItem(item: any, quantity: number) {
    const product = {
      product_id: item.id,
      quantity,
      from: new Date(startDate).toISOString().substring(0, 10),
      to: new Date(endDate).toISOString().substring(0, 10),
    };
    mutate(product);
  }
  return (
    <div className="flex w-full items-start gap-4 py-3">
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
        <p className="mt-1 mb-2.5">
          <AnchorLink
            href={routes.shopUrl(shop?.slug)}
            className="text-light-base transition-colors hover:text-brand-dark dark:text-dark-base"
          >
            {shop?.name}
          </AnchorLink>
        </p>
        <p className="flex items-center gap-1">
          <span className="rounded-2xl bg-light-300 p-1.5 font-semibold uppercase leading-none text-brand-dark dark:bg-dark-500">
            {itemPrice}
          </span>
          <span className="text-light-base dark:text-dark-base">X</span>
          <span className="text-light-base dark:text-dark-base">
            {quantity}
          </span>

          {/* <span>
          <Button
>>>>>>> 311a33f51f3e4f17c7eacb04e21aaa3d8ab29a89
            className="text-light-base dark:text-dark-base"
            onClick={() => onCheckAvailableItem(item, quantity)}
          >
            Check
          </Button>
          </span> */}
        </p>
      </div>
    </div>
  );
}

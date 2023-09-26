import type { Product } from '@/types';
import usePrice from '@/lib/hooks/use-price';
import { isFree } from '@/lib/is-free';
import { useTranslation } from 'react-i18next';
import Router from 'next/router';
import routes from '@/config/routes';
import AnchorLink from '../ui/links/anchor-link';

interface Props {
  item: Product;
}

export default function RelatedProducts({ item }: Props) {
  const { t } = useTranslation('common');
  const { price, basePrice } = usePrice({
    amount: item?.sale_price ? item?.sale_price : item?.price ?? 0,
    baseAmount: item?.price,
  });
  const isFreeItem = isFree(item?.sale_price ?? item?.price);

  const goToDetailsPage = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    Router.push(routes.productUrl(item.slug));
  };

  return (
    <div className="main-feature flex" key={item.id}>
      <img
        src={item.image.original}
        alt=""
        className="feature-image cursor-pointer"
        onClick={(e) => goToDetailsPage(e)}
      />
      <AnchorLink
        className="gellery-details-page"
        href={routes.productUrl(item.slug)}
      >
        {item.name}
      </AnchorLink>
      <div className="gellery-details-page-description">
        {/* short description and add ... to end */}
        {item?.description?.length > 100
          ? item.description.substring(0, 100) + '...'
          : item.description}
      </div>
      <div className="gellery-details-page-price">
        <span className="rounded-2xl bg-light-500 px-1.5 py-0.5 text-13px font-semibold uppercase text-brand dark:bg-dark-300 dark:text-brand-dark">
          {isFreeItem ? t('text-free') : price}
        </span>
        {!isFreeItem && basePrice && (
          <del className="px-1 text-13px font-medium text-dark-900 dark:text-dark-700">
            {basePrice}
          </del>
        )}
      </div>
    </div>
  );
}

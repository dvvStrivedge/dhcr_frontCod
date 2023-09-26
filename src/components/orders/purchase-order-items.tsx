import { Table } from '@/components/ui/table';
import usePrice from '@/lib/hooks/use-price';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/lib/locals';
import Image from '@/components/ui/image';
import { productPlaceholder } from '@/lib/placeholders';
// import { useModalAction } from '@/components/ui/modal/modal.context';
import { useModalAction } from '@/components/modal-views/context';
import Link from '@/components/ui/link';
// import { Routes } from '@/config/routes';
import routes from '@/config/routes';
import { getReview } from '@/lib/get-reviews';
import Button from '@/components/ui/button';
import { OrderStatus, PaymentStatus } from '@/types';
import { useMutation } from 'react-query';
import client from '@/data/client';
import { DownloadIcon } from '@/components/icons/download-icon';
import AnchorLink from '../ui/links/anchor-link';
import { useState } from 'react';
import { useLocalStorage } from 'react-use';

//FIXME: need to fix this usePrice hooks issue within the table render we may check with nested property
const OrderItemList = (_: any, record: any) => {
  const { price } = usePrice({
    amount: record.pivot?.unit_price,
  });
  let name = record.name;
  if (record?.pivot?.variation_option_id) {
    const variationTitle = record?.variation_options?.find(
      (vo: any) => vo?.id === record?.pivot?.variation_option_id
    )['title'];
    name = `${name} - ${variationTitle}`;
  }

  return (
    <div className="flex items-center">
      <div className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded">
        <Image
          src={record.image?.thumbnail ?? productPlaceholder}
          alt={name}
          className="h-full w-full object-cover"
          fill
        />
      </div>

      <div className="flex flex-col overflow-hidden ltr:ml-4 rtl:mr-4">
        <div className="mb-1 flex space-x-1 rtl:space-x-reverse">
          <Link
            href={routes.product(record?.slug)}
            className="text-body hover:text-accent inline-block overflow-hidden truncate text-sm transition-colors hover:underline"
            locale={record?.language}
          >
            {name}
          </Link>
          <span className="text-body inline-block overflow-hidden truncate text-sm">
            x
          </span>
          <span className="text-heading inline-block overflow-hidden truncate text-sm font-semibold">
            {record.unit}
          </span>
        </div>
        <span className="text-accent mb-1 inline-block overflow-hidden truncate text-sm font-semibold">
          {price}
        </span>
        <div className="flex items-center gap-2">
          <div className="flex flex-col overflow-hidden ltr:ml-4 rtl:mr-4">
            <span className="text-accent mb-1 inline-block overflow-hidden truncate text-sm font-semibold">
              {record?.pivot?.from + ' - ' + record?.pivot?.to}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export const PurchaseOrderItems = ({
  products,
  orderId,
  orderStatus,
  productResponse,
  setProductResponse,
}: {
  products: any;
  orderId: any;
  status: PaymentStatus;
  orderStatus: OrderStatus;
  productResponse: any;
  setProductResponse: any;
}) => {
  const { t } = useTranslation('common');
  const { alignLeft, alignRight } = useIsRTL();
  const { openModal } = useModalAction();
  const [response, setResponse] = useState<any>([]);
  const [loadFirst, setLoadFirst] = useState<boolean>(true);
  const [savedCart, saveCart] = useLocalStorage(
    'productResponse',
    JSON.stringify(productResponse)
  );

  const { mutate: verifyOrder } = useMutation(client.orders.checkAvailability, {
    onSuccess: (res) => {
      setProductResponse(res);
      saveCart(JSON.stringify(res));
    },
    onError: (err) => {
      console.log('error', err);
    },
  });

  if (loadFirst && orderStatus === 'approved-order') {
    verifyOrder({
      products_ids: products.map((item: any) => ({
        id: item.id,
        quantity: item.pivot.order_quantity,
        from: item.pivot.from,
        to: item.pivot.to,
      })),
    });
    setLoadFirst(false);
  }

  const { mutate } = useMutation(client.orders.generateDownloadLink, {
    onSuccess: (data, name) => {
      function download(fileUrl: string, fileName: string) {
        var a = document.createElement('a');
        a.href = fileUrl;
        a.setAttribute('download', fileName);
        a.click();
      }

      download(data, name);
    },
  });

  const { mutate: verify } = useMutation(client.products.checkAvailability, {
    onSuccess: (res) => {
      const productResponse = {
        id: res.productId,
        isAvailable: res.isAvailable,
      };

      response?.push(productResponse);
      setResponse(response);
    },
    onError: (err) => {
      console.log('error', err);
    },
  });

  const openReviewModal = (record: any) => {
    openModal('REVIEW_RATING', {
      product_id: record.id,
      shop_id: record.shop_id,
      order_id: orderId,
      name: record.name,
      image: record.image,
      my_review: getReview(record?.my_review, record?.order_id),
      ...(record.pivot?.variation_option_id && {
        variation_option_id: record.pivot?.variation_option_id,
      }),
    });
  };

  const checkAvailability = (record: any) => {
    // verify api call
    const product = {
      product_id: record.id,
      quantity: record.pivot?.order_quantity,
      from: record.pivot?.from,
      to: record.pivot?.to,
    };
    verify(product);
  };

  const getProductStatus = (record: any) => {
    const product = response.find(
      (res: any) => res.id === record.id.toString()
    );
    if (product === undefined || !product) return 'check availability';
    if (product.isAvailable) return 'available';
    if (product && product.isAvailable === false) {
      return 'unavailable';
    }
  };

  const getProductsStatus = (record: any) => {
    if (productResponse === undefined || !productResponse)
      return 'check availability';
    if (
      productResponse?.available_products?.length === 0 &&
      productResponse?.unavailable_products?.length === 0
    )
      return 'check availability';
    let productResAvailable;
    if (productResponse?.available_products?.length > 0) {
      productResAvailable = productResponse.available_products.find(
        (res: any) => res === record.id
      );
    }

    if (productResAvailable) return 'available';
    let productResUnavailable;
    if (productResponse?.unavailable_products?.length > 0) {
      productResUnavailable = productResponse.unavailable_products.find(
        (res: any) => res === record.id
      );
    }

    if (productResUnavailable) return 'unavailable';
  };

  const orderTableColumns = [
    {
      title: <span className="ltr:pl-20 rtl:pr-20">{t('text-item')}</span>,
      dataIndex: '',
      key: 'items',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      render: OrderItemList,
    },
    {
      title: t('text-quantity'),
      dataIndex: 'pivot',
      key: 'pivot',
      align: 'center',
      width: 100,
      render: function renderQuantity(pivot: any) {
        return <p className="text-base">{pivot.order_quantity}</p>;
      },
    },
    // {
    //   title: ' ',
    //   dataIndex: '',
    //   align: alignLeft,
    //   width: 250,
    //   render: function RenderReview(_: any, record: any) {
    //     return (
    //       <div className="flex items-center justify-end gap-4">
    //         {(orderStatus === OrderStatus.WAITING &&
    //           (getProductStatus(record) === 'check availability' ||
    //             getProductsStatus(record) === 'check availability')) ||
    //         undefined ? (
    //           <button
    //             className="flex shrink-0 items-center font-semibold text-brand transition-all duration-200 hover:bg-brand hover:text-white sm:h-12 sm:rounded sm:border sm:border-light-500 sm:bg-transparent sm:py-3 sm:px-5 sm:dark:border-dark-600"
    //             onClick={() => checkAvailability(record)}
    //           >
    //             {t('text-check-availability')}
    //           </button>
    //         ) : getProductStatus(record) === 'available' ||
    //           (getProductsStatus(record) === 'available' &&
    //             orderStatus === OrderStatus.APPROVED) ? (
    //           <div style={{ color: 'green' }}>Product is available</div>
    //         ) : getProductStatus(record) === 'unavailable' ||
    //           (getProductsStatus(record) === 'unavailable' &&
    //             orderStatus === OrderStatus.APPROVED) ? (
    //           <div style={{ color: 'red' }}>Product is not available</div>
    //         ) : (
    //           ''
    //         )}
    //       </div>
    //     );
    //   },
    // },
  ];
  return (
    <Table
      //@ts-ignore
      columns={orderTableColumns}
      data={products}
      rowKey={(record: any) =>
        record.pivot?.variation_option_id
          ? record.pivot.variation_option_id
          : record.created_at
      }
      className="orderDetailsTable w-full"
      rowClassName="!cursor-auto"
      scroll={{ x: 750 }}
    />
  );
};

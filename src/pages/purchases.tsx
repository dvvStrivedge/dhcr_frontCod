import { Fragment, useEffect, useMemo, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import type {
  NextPageWithLayout,
  Order,
  OrderStatus,
  OrderedFile,
} from '@/types';
import PayNowButton from '@/components/payment/pay-now-button';
import dayjs, { locale } from 'dayjs';
import { useMutation } from 'react-query';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/_dashboard';
import Image from '@/components/ui/image';
import { Menu } from '@/components/ui/dropdown';
import { Transition } from '@/components/ui/transition';
import {
  useDownloadInvoiceMutation,
  useDownloadableProductOrders,
  useOrders,
} from '@/data/order';
import { DownloadIcon } from '@/components/icons/download-icon';
import client from '@/data/client';
import CartEmpty from '@/components/cart/cart-empty';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import rangeMap from '@/lib/range-map';
import Button from '@/components/ui/button';
import placeholder from '@/assets/images/placeholders/product.svg';
import { useModalAction } from '@/components/modal-views/context';
import { getReview } from '@/lib/get-reviews';
import { PaymentStatus } from '@/types';
import Link from '@/components/ui/link';
import routes from '@/config/routes';
import AnchorLink from '@/components/ui/links/anchor-link';
import { CreditCardIcon } from '@/components/icons/credit-card-icon';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatString } from '@/lib/format-string';
import OrderStatusProgressBox from '@/components/orders/order-status-progress-box';
import { OrderItems } from '@/components/orders/order-items';
import { PurchaseOrderItems } from '@/components/orders/purchase-order-items';
import { formatPrice } from '@/lib/hooks/use-price';

import { useRouter } from 'next/router';
import { groupBy, set } from 'lodash';
import Badge from '@/components/ui/badge';
import { useAtom } from 'jotai';
import { verifiedTokenAtom } from '@/components/cart/lib/checkout';
import { getMessaging, getToken, onMessage } from '@firebase/messaging';
import app from '@/data/utils/firebase';

type Props = {
  title: string;
  details: string | undefined;
};

const Card = ({ title, details }: Props) => {
  if (title === 'Status') {
    return (
      <div className="purchase-box mr-3.5 flex w-1/3 items-center rounded border border-gray-200 py-4 px-4 dark:border-[#434343] dark:bg-dark-200">
        <div>
          <h3 className="mb-2 text-xs font-normal dark:text-white/60">
            {title} :{' '}
          </h3>
          <Badge
            text={details}
            color="bg-orange-500"
            className="flex min-h-[1.4375rem] items-center justify-center text-[9px] font-bold !leading-[1.3em] xs:text-xs lg:px-4"
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="purchase-box mr-3.5 flex w-1/3 items-center rounded border border-gray-200 py-4 px-4 dark:border-[#434343] dark:bg-dark-200">
        <div>
          <h3 className="mb-2 text-xs font-normal dark:text-white/60">
            {title} :{' '}
          </h3>
          <p className="text-dark-200 dark:text-white">{details}</p>
        </div>
      </div>
    );
  }
};

const Listitem = ({ title, details }: Props) => {
  return (
    <p className="text-body-dark mt-5 flex items-center text-xs">
      <strong className="w-5/12 sm:w-4/12">{title}</strong>
      <span>:</span>
      <span className="w-7/12 ltr:pl-4 rtl:pr-4 dark:text-white sm:w-8/12 ">
        {details}
      </span>
    </p>
  );
};
function OrderedItem({ item }: { item: OrderedFile }) {
  const { t } = useTranslation('common');
  const { openModal } = useModalAction();
  const { order_id, tracking_number } = item;
  // const [startDate, setStartDate] = useState(
  //   new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  // );
  // const [endDate, setEndDate] = useState(
  //   new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  // );
  const {
    id: product_id,
    shop_id,
    name,
    slug,
    image,
    preview_url,
    my_review,
  } = item.file.fileable ?? {};

  const { mutate } = useMutation(client.orders.generateDownloadLink, {
    onSuccess: (data) => {
      function download(fileUrl: string, fileName: string) {
        let a = document.createElement('a');
        a.href = fileUrl;
        a.setAttribute('download', fileName);
        a.click();
      }

      download(data, name);
    },
  });

  function openReviewModal() {
    openModal('REVIEW_RATING', {
      product_id,
      shop_id,
      name,
      image,
      my_review: getReview(my_review, order_id),
      order_id,
    });
  }

  // const onChange = (dates: any[]) => {
  //   const [start, end] = dates;
  //   setStartDate(start);
  //   setEndDate(end);
  // };

  function getProductStartDate(item: OrderedFile) {
    let product = item?.order?.products.find(
      (x) => (x.id = item.digital_file_id)
    );
    return product?.pivot?.from;
  }

  function getProductEndDate(item: OrderedFile) {
    let product = item?.order?.products.find(
      (x) => (x.id = item.digital_file_id)
    );
    return product?.pivot?.to;
  }

  function checkAvailibility() {
    let product = item?.order?.products.find(
      (x) => (x.id = item.digital_file_id)
    );
  }

  const getStatus =
    item?.order?.payment_status === PaymentStatus.SUCCESS ||
    item?.order?.payment_status === PaymentStatus.WALLET;

  const getOrderStatus = item?.order?.order_status === 'approved-order';

  return (
    <div className="flex items-start gap-4 border-b border-light-400 py-4 last:border-b-0 dark:border-dark-400 sm:gap-5">
      <AnchorLink href={routes.productUrl(slug)}>
        <div className="relative aspect-[5/3.4] w-28 flex-shrink-0 border border-light-300 dark:border-0 sm:w-32 md:w-36">
          <Image
            alt={name}
            fill
            quality={100}
            src={image?.thumbnail ?? placeholder}
            className="bg-light-400 object-cover dark:bg-dark-400"
          />
        </div>
      </AnchorLink>
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:gap-0">
        <div className="border-b border-light-400 pb-3 dark:border-dark-600 sm:border-b-0 sm:pb-0">
          <p className="text-gray-500 dark:text-gray-400">
            {t('text-purchased-on')}{' '}
            {dayjs(item.updated_at).format('MMM D, YYYY')}
          </p>
          <h3
            className="my-1.5 font-medium text-dark dark:text-light sm:mb-3"
            title={name}
          >
            <AnchorLink
              href={routes.productUrl(slug)}
              className="transition-colors hover:text-brand"
            >
              {name}
            </AnchorLink>
          </h3>
          <div className="flex items-center gap-3">
            {/* <ReactDatePicker
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              className="bg-transparent"
              minDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
              // excludeDates={[addDays(new Date(), 1), addDays(new Date(), 5)]}
              selectsRange
              // selectsDisabledDaysInRanges
              // inline
            /> */}
            <p>{`${getProductStartDate(item)} - ${getProductEndDate(item)}`}</p>
            <Button
              className="btn btn-primary"
              onClick={() => checkAvailibility()}
            >
              Check Availability
            </Button>
          </div>
          {preview_url && (
            <a
              href={preview_url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand-dark dark:text-brand"
            >
              {t('text-preview')}
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          {
            getStatus ? (
              <>
                <button
                  className="flex items-center font-semibold text-brand hover:text-brand-dark sm:h-12 sm:rounded sm:border sm:border-light-500 sm:bg-transparent sm:py-3 sm:px-5 sm:dark:border-dark-600"
                  onClick={openReviewModal}
                >
                  {getReview(my_review, order_id)
                    ? t('text-update-review')
                    : t('text-write-review')}
                </button>
                <Button onClick={() => mutate(item.digital_file_id)}>
                  <DownloadIcon className="h-auto w-4" />
                  {t('text-download')}
                </Button>
              </>
            ) : getOrderStatus ? (
              <PayNowButton tracking_number={tracking_number} variant="card" />
            ) : (
              <p>Waiting For Approval</p>
            )
            // <Button onClick={() => mutate(item.digital_file_id)}>
            //   <CreditCardIcon className="w-4 h-4" />
            //   {t('text-pay')}
            // </Button>
          }
          <div className="relative shrink-0 ">
            <Menu>
              <Menu.Button className="flex items-center space-x-[3px] font-semibold text-brand hover:text-brand-dark sm:h-12 sm:rounded sm:border sm:border-light-500 sm:py-3 sm:px-4 sm:dark:border-dark-600">
                <span className="inline-flex h-1 w-1 shrink-0 rounded-full bg-dark-700 dark:bg-light-800"></span>
                <span className="inline-flex h-1 w-1 shrink-0 rounded-full bg-dark-700 dark:bg-light-800"></span>
                <span className="inline-flex h-1 w-1 shrink-0 rounded-full bg-dark-700 dark:bg-light-800"></span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute top-[110%] z-30 mt-4 w-48 rounded-md bg-light py-1.5 text-dark  shadow-dropdown ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left dark:bg-dark-400 dark:text-light md:top-[78%]">
                  <Menu.Item>
                    <Link
                      href={`${routes.orderUrl(item?.tracking_number)}/payment`}
                      className="transition-fill-colors block w-full px-5 py-2.5 font-medium hover:bg-light-400 ltr:text-left rtl:text-right dark:hover:bg-dark-600"
                    >
                      {t('text-order-details')}
                    </Link>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderItemLoader() {
  return (
    <div className="flex animate-pulse items-start gap-4 border-b border-light-400 py-4 last:border-b-0 dark:border-dark-400 sm:items-stretch sm:gap-5">
      <div className="relative aspect-[5/3.4] w-28 flex-shrink-0 bg-light-400 dark:bg-dark-400 sm:w-32 md:w-36" />
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:gap-0">
        <div className="h-full flex-grow border-b border-light-400 pb-3 dark:border-dark-600 sm:border-b-0 sm:pb-0">
          <div className="mb-3 h-2.5 w-1/4 bg-light-400 dark:bg-dark-400" />
          <div className="mb-6 h-2.5 w-2/4 bg-light-400 dark:bg-dark-400" />
          <div className="h-2.5 w-1/5 bg-light-400 dark:bg-dark-400" />
        </div>
        <div className="h-2.5 w-1/3 bg-light-400 dark:bg-dark-400 sm:h-12 sm:w-1/4 sm:rounded md:w-1/6" />
      </div>
    </div>
  );
}

const LIMIT = 3;
const Purchases: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const { openModal } = useModalAction();
  const router = useRouter();
  const [token] = useAtom(verifiedTokenAtom);
  const [productResponse, setProductResponse] = useState<any>(null);
  const [loadFirst, setLoadFirst] = useState(true);
  const [mergedProducts, setMergedProducts] = useState<any>([]);
  const { mutate: verifyOrder } = useMutation(client.orders.checkAvailability, {
    onSuccess: (res) => {
      setProductResponse(res);
    },
    onError: (err) => {
      console.log('error', err);
    },
  });
  const { mutate: downloadOrderInvoice } = useMutation(
    client.orders.downloadInvoice,
    {
      onSuccess: (res) => {
        // go to purchase page
        const a = document.createElement('a');
        a.href = res;
        a.setAttribute('download', 'order-invoice');
        a.click();
      },
    }
  );
  const { orders, isLoading, isLoadingMore, hasNextPage, loadMore } = useOrders(
    {
      limit: LIMIT,
      orderBy: 'updated_at',
      sortedBy: 'desc',
    }
  );

  const formatTotal = (total: number) => {
    return total?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const openInfoModal = (order: Order) => {
    order?.note
      ? openModal('INFO_VIEW', {
          title: t('text-info'),
          content: order?.note,
        })
      : null;
  };

  const replaceString = (str: string) => {
    // capitalize first letter of each word and replace - with space
    return str.replace(/\b\w/g, (l) => l.toUpperCase()).replace(/-/g, ' ');
  };

  const getOrderStatus = (status: string) => {
    if (status === 'waiting-for-approval') {
      return 'Checking Availability';
    }
    if (status === 'approved-order') {
      return 'Available, Waiting for payment';
    }
    if (status === 'paid-and-confirmed') {
      return 'Rental Confirmed';
    }
    if (status === 'in-process') {
      return 'In Process';
    }
    if (status === 'done') {
      return 'Done';
    }
    return replaceString(status);
  };

  function downloadInvoice(orderId: string) {
    downloadOrderInvoice({
      order_id: orderId,
      is_rtl: false,
      language: 'en',
      translated_text: {
        subtotal: 'Subtotal',
        discount: 'Discount',
        tax: 'Tax',
        delivery_fee: 'Delivery Fee',
        total: 'Total',
        products: 'Products',
        quantity: 'Quantity',
        invoice_no: 'Invoice No',
        date: 'Date',
      },
      ...(token && { token }),
    });
  }

  useEffect(() => {
    // merge products array of orders
    const mergedProd: any = [];

    orders.forEach((order) => {
      order.products.forEach((product) => {
        mergedProd.push(product);
      });
    });

    if (loadFirst && mergedProd.length > 0) {
      verifyOrder({
        products_ids: mergedProd.map((item: any) => ({
          id: item.id,
          quantity: item.pivot.order_quantity,
          from: item.pivot.from,
          to: item.pivot.to,
        })),
      });
      setLoadFirst(false);
    }
  }, [loadFirst, mergedProducts]);

  const checkOrderAvailability = (order: Order) => {
    const availableProductIds = productResponse?.available_products;

    mergedProducts.forEach((product: any) => {
      if (
        availableProductIds?.length &&
        availableProductIds.includes(product.id)
      ) {
        return true;
      } else {
        return false;
      }
    });
    return true;
  };

  useEffect(() => {
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // ...
    });
  }, []);

  return (
    <motion.div
      variants={fadeInBottom()}
      className="flex min-h-full flex-grow flex-col"
    >
      <h1 className="mb-3 text-15px font-medium text-dark dark:text-light">
        {t('text-my-purchase-list')}
        <span className="ml-1 text-light-900">({orders.length})</span>
      </h1>

      {isLoading &&
        !orders.length &&
        rangeMap(LIMIT, (i) => <OrderItemLoader key={`order-loader-${i}`} />)}

      {!isLoading && !orders.length ? (
        <CartEmpty
          className="my-auto"
          description={t('text-product-purchase-message')}
        />
      ) : (
        orders.map((order) => (
          <div
            key={order?.id}
            className="mt-5 w-full max-w-sm overflow-hidden rounded shadow-lg outline-white lg:max-w-full"
          >
            <div className="rounded border border-gray-200 px-6 pb-12 pt-9 dark:border-[#434343] dark:bg-dark-200 lg:px-8">
              <div className="purchase-responsive mb-6 flex">
                <Card
                  title={t('text-order-number')}
                  details={order?.tracking_number}
                />
                <Card
                  title={t('text-date')}
                  details={dayjs(order?.created_at).format('MMMM D, YYYY')}
                />
                <Card
                  title={t('text-total')}
                  details={formatTotal(order?.paid_total)}
                />
                {order?.order_status === 'approved-order' &&
                checkOrderAvailability(order) ? (
                  <span className="order-2 mt-5 w-full max-w-full shrink-0 basis-full sm:order-1 md:mt-0 md:w-auto md:max-w-none md:basis-auto md:ltr:ml-auto md:rtl:mr-auto">
                    <PayNowButton
                      tracking_number={order?.tracking_number}
                      variant="card"
                    />
                  </span>
                ) : (
                  <Card
                    title={t('text-status')}
                    details={getOrderStatus(order?.order_status)}
                  />
                )}
                <div className="purchase-box relative flex w-1/6 items-center justify-center">
                  <Menu>
                    <Menu.Button className="flex items-center space-x-[3px] font-semibold text-brand hover:text-brand-dark sm:h-12 sm:rounded sm:border sm:border-light-500 sm:py-3 sm:px-4 sm:dark:border-dark-600">
                      <span className="inline-flex h-1 w-1 shrink-0 rounded-full bg-dark-700 dark:bg-light-800"></span>
                      <span className="inline-flex h-1 w-1 shrink-0 rounded-full bg-dark-700 dark:bg-light-800"></span>
                      <span className="inline-flex h-1 w-1 shrink-0 rounded-full bg-dark-700 dark:bg-light-800"></span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute top-[110%] z-30 mt-4 w-48 rounded-md bg-light py-1.5 text-dark  shadow-dropdown ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left dark:bg-dark-400 dark:text-light md:top-[78%]">
                        <Menu.Item>
                          <Link
                            href={`${routes.orderUrl(
                              order?.tracking_number
                            )}/payment/?order=${order?.tracking_number}`}
                            className="transition-fill-colors block w-full px-5 py-2.5 font-medium hover:bg-light-400 ltr:text-left rtl:text-right dark:hover:bg-dark-600"
                          >
                            {t('text-order-details')}
                          </Link>
                        </Menu.Item>
                        {order?.payment_status === PaymentStatus.SUCCESS ||
                        order?.order_status === 'done' ||
                        order?.order_status === 'in-process' ? (
                          <Menu.Item>
                            <span
                              className="transition-fill-colors block w-full px-5 py-2.5 font-medium hover:bg-light-400 ltr:text-left rtl:text-right dark:hover:bg-dark-600"
                              onClick={() =>
                                downloadInvoice(order?.id as string)
                              }
                              style={{ cursor: 'pointer' }}
                            >
                              Download Invoice
                            </span>
                          </Menu.Item>
                        ) : null}
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  {order?.note ? (
                    <a href="#" onClick={() => openInfoModal(order)}>
                      {' '}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="information-icon-purchase"
                      >
                        <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z" />
                      </svg>
                    </a>
                  ) : null}
                </div>

                {/* <div className="relative shrink-0 flex items-center justify-end">
                  {/* <Link
                    href={`${routes.orderUrl(
                      order?.order?.tracking_number
                    )}/payment`}
                    className="btn btn-primary btn-sm"
                  >
                    {t('text-order-details')}
                  </Link> *}
                  <Button
                    onClick={() =>
                      router.push(
                        `${routes.orderUrl(order?.tracking_number)}/payment`
                      )
                    }
                  >
                    {t('text-order-details')}
                  </Button>
                </div> */}
              </div>

              <div className="mt-12">
                <PurchaseOrderItems
                  products={order?.products}
                  orderId={order?.id}
                  status={order?.payment_status as PaymentStatus}
                  orderStatus={order?.order_status as OrderStatus}
                  productResponse={productResponse}
                  setProductResponse={setProductResponse}
                />
              </div>
              {/* {!isEmpty(order?.children) ? (
              <div className="mt-10">
                <h2 className="mb-6 text-base font-medium dark:text-white">
                  {t('text-sub-orders')}
                </h2>
                <div>
                  <div className="flex items-start p-4 mb-12 border border-gray-200 rounded dark:border-dark-600">
                    <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-sm bg-dark px-2 ltr:mr-3 rtl:ml-3 dark:bg-light">
                      <CheckMark className="w-2 h-2 shrink-0 text-light dark:text-dark" />
                    </span>
                    <p className="text-sm text-heading">
                      <span className="font-bold">{t('text-note')}:</span>{' '}
                      {t('message-sub-order')}
                    </p>
                  </div>
                  {Array.isArray(order?.children) && order?.children.length && (
                    <SuborderItems items={order?.children} />
                  )}
                </div>
              </div>
            ) : null} */}
            </div>
            {/* <OrderedItem key={file.id} item={file} /> */}
          </div>
        ))
      )}

      {hasNextPage && (
        <div className="mt-10 grid place-content-center">
          <Button
            onClick={loadMore}
            disabled={isLoadingMore}
            isLoading={isLoadingMore}
          >
            {t('text-loadmore')}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

Purchases.authorization = true;
Purchases.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 60, // In seconds
  };
};

export default Purchases;

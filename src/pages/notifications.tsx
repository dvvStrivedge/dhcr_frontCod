// notification page
// Compare this snippet from src\pages\notifications.tsx:
import { motion } from 'framer-motion';
import { Fragment, useEffect, useState } from 'react';
import { NextPageWithLayout } from '@/types';
import DashboardLayout from '@/layouts/_dashboard';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { Column } from 'rc-table';
import { useNotifications } from '@/data/notification';
import routes from '@/config/routes';
import { useMutation } from 'react-query';
import client from '@/data/client';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/button';
import Avatar from 'react-avatar';
import { useMe } from '@/data/user';
import rangeMap from '@/lib/range-map';
//
const LIMIT = 10;
const Notifications: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const [token, setToken] = useState('');
  const [notificationPermission, setNotificationPermission] =
    useState('default');
  const router = useRouter();
  const { me } = useMe();
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<any>([]);
  const [hasNextPage, setHasNextPage] = useState(false);

  // get notification list
  const { mutate: getNotifications, isLoading: loading } = useMutation(
    client.notifications.all,
    {
      onSuccess: (data: any) => {
        setNotifications(data.data);
        // has next page
        if (data?.data?.last_page > data?.data?.current_page) {
          setHasNextPage(true);
        } else {
          setHasNextPage(false);
        }
      },
    }
  );

  // useupdate notification
  const { mutate: updateNotification } = useMutation(
    client.notifications.update,
    {
      onSuccess: (data: any) => {
        // console.log(data);
      },
    }
  );

  const convertDate = (date: string) => {
    // convert date to days ago, hours ago, minutes ago format
    const currentDate = new Date();
    const previousDate = new Date(date);
    const diff = currentDate.getTime() - previousDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return 'Just now';
    }
  };

  const onNotificationClick = (notification: any) => {
    // mark notification as read
    updateNotification({ id: notification?.id });

    // redirect to notification details page
    router.push(
      `${routes.orderUrl(
        notification?.order?.tracking_number
      )}/payment/?order=${notification?.order?.tracking_number}`
    );
  };

  useEffect(() => {
    // get notification list
    getNotifications({
      limit: LIMIT,
      sortedBy: 'desc',
      page,
    });
  }, []);

  const loadMore = () => {
    // get notification list
    getNotifications({
      limit: (page + 1) * LIMIT,
      sortedBy: 'desc',
      page: 1,
    });
    setPage(page + 1);
  };

  function NotificationItemLoader() {
    return (
      <div className="flex animate-pulse items-start gap-4 border-b border-light-400 py-4 last:border-b-0 dark:border-dark-400 sm:items-stretch sm:gap-5">
        <div
          className="flex items-center pt-2 pl-3 pr-2"
          style={{ cursor: 'pointer', padding: '5px' }}
        >
          <div
            className="relative aspect-[5/3.4] w-28 flex-shrink-0 bg-light-400 dark:bg-dark-400 sm:w-32 md:w-36"
            style={{
              borderRadius: '50px',
              // border: '1px solid #ccc',
              width: '40px',
              height: '40px',
              minWidth: '40px',
              minHeight: '40px',
            }}
          />
          <div className="mb-3 h-2.5 w-2/4 bg-light-400 dark:bg-dark-400" />
        </div>
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:gap-0">
          <div className="h-full flex-grow border-b border-light-400 pb-3 dark:border-dark-600 sm:border-b-0 sm:pb-0">
            <div className="mb-6 h-2.5 w-1/3 bg-light-400 dark:bg-dark-400" />
            <div className="mb-6 h-2.5 w-10/12 bg-light-400 dark:bg-dark-400" />
            <div className="h-2.5 w-1/12 bg-light-400 dark:bg-dark-400" />
          </div>
        </div>
      </div>
    );
  }
  return (
    // notification listing
    <motion.div
      variants={fadeInBottom()}
      className="flex min-h-full flex-grow flex-col"
    >
      <h1 className="mb-3 text-15px font-medium text-dark dark:text-light">
        {t('text-my-notifications-list')}
        <span className="ml-1 text-light-900">
          ({notifications?.total ? notifications.total : 0})
        </span>
      </h1>

      {loading &&
        !notifications?.data?.length &&
        rangeMap(LIMIT, (i) => (
          <NotificationItemLoader key={`order-loader-${i}`} />
        ))}
      <ul
        className=""
        // style={{ right: '-50px' }}
      >
        {notifications?.data?.length === 0 && (
          <div className="d-flex justify-content-center align-items-center">
            <p className="text-muted">No notifications found</p>
          </div>
        )}
        {notifications?.data?.map((notification: any) => (
          <li key={notification?.id}>
            <div
              className={`d-flex border-bottom mb-1 flex-row ${
                notification?.is_read ? 'unread' : 'read'
              }`}
              key={notification?.id}
              style={{ borderBottom: '1px solid #ccc' }}
              onClick={() => onNotificationClick(notification)}
            >
              <div
                className="flex items-center pt-2 pl-3 pr-2"
                style={{ cursor: 'pointer', padding: '5px' }}
              >
                <span
                  className="flex items-center justify-center"
                  style={{
                    borderRadius: '50px',
                    // border: '1px solid #ccc',
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    minHeight: '40px',
                  }}
                >
                  <Avatar
                    size="32"
                    round={true}
                    name={me?.name}
                    textSizeRatio={2}
                    src={me?.profile?.avatar?.thumbnail}
                  />
                </span>

                <span
                  className="font-weight-medium notification-heading mb-1 grow pl-2"
                  style={{ fontSize: '16px' }}
                >
                  <b>{notification?.title}</b>
                </span>
                {!notification?.is_read ? (
                  <span className="hightlight"></span>
                ) : (
                  ''
                )}
              </div>
              <div
                className="pl-3 pr-2"
                style={{
                  borderBottom: '1px solid #252525',
                  paddingLeft: '50px',
                }}
              >
                <div style={{ cursor: 'pointer' }}>
                  {/* <p className="font-weight-medium mb-1">test 1</p> */}
                  <p
                    className="text-muted text-small notification-text1 mb-1"
                    style={{
                      fontSize: '13px',
                      lineHeight: 'normal',
                    }}
                  >
                    {notification?.description}
                  </p>
                  <p
                    className="text-muted text-small mb-3 mb-3"
                    style={{
                      fontSize: '10px',
                      lineHeight: 'normal',
                      marginBottom: '15px',
                    }}
                  >
                    {convertDate(notification?.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <div className="mt-10 grid place-content-center">
          <Button
            onClick={() => loadMore()}
            isLoading={loading}
            disabled={loading}
          >
            {t('text-loadmore')}
          </Button>
        </div>
      )}
    </motion.div>
  );
};
Notifications.authorization = true;
Notifications.getLayout = function getLayout(page) {
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

export default Notifications;

import type {
  CategoryQueryOptions,
  NextPageWithLayout,
  ProductQueryOptions,
  SettingsQueryOptions,
} from '@/types';
import type { GetStaticProps } from 'next';
import Layout from '@/layouts/_layout';
import { useProducts } from '@/data/product';
import Grid from '@/components/product/grid';
import { useRouter } from 'next/router';
import Seo from '@/layouts/_seo';
import routes from '@/config/routes';
import client from '@/data/client';
import { dehydrate, QueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { getMessaging, getToken } from '@firebase/messaging';
import app from '@/data/utils/firebase';
import HomeLayout from '@/layouts/_home-layout';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery(
        [API_ENDPOINTS.SETTINGS, { language: locale }],
        ({ queryKey }) =>
          client.settings.all(queryKey[1] as SettingsQueryOptions)
      ),
      queryClient.prefetchInfiniteQuery(
        [API_ENDPOINTS.PRODUCTS, { language: locale }],
        ({ queryKey }) =>
          client.products.all(queryKey[1] as ProductQueryOptions)
      ),
      queryClient.prefetchInfiniteQuery(
        [API_ENDPOINTS.CATEGORIES, { limit: 100, language: locale }],
        ({ queryKey }) =>
          client.categories.all(queryKey[1] as CategoryQueryOptions)
      ),
    ]);
    return {
      props: {
        ...(await serverSideTranslations(locale!, ['common'])),
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      revalidate: 60, // In seconds
    };
  } catch (error) {
    //* if we get here, the product doesn't exist or something else went wrong
    return {
      notFound: true,
    };
  }
};

function Products() {
  const { query } = useRouter();
  const [token, setToken] = useState('');
  const [notificationPermission, setNotificationPermission] =
    useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      // Check if the browser supports the Notification API
      if (Notification.permission !== 'granted') {
        // If permission is not granted, request permission
        Notification.requestPermission().then((permission) => {
          // If the user accepts, let's create a notification
          console.log('permission', permission);

          if (permission === 'granted') {
            console.log('Notification permission granted.');
            // Now you can send push notifications
          } else {
            console.log('Notification permission denied.');
          }
        });
      }
    }
    // const handleRequestPermission = async () => {
    //   if ('Notification' in window) {
    //     if (Notification.permission !== 'granted') {
    //       try {
    //         await Notification.requestPermission().then((permission) => {
    //           if (permission === 'granted') {
    //             console.log('Notification permission granted.');
    //             // Now you can send push notifications
    //           }
    //         }
    //         );
    //       } catch (error) {
    //         console.error('Error requesting permission:', error);
    //       }
    //     }
    //   }
    // };

    // handleRequestPermission();

    const messaging = getMessaging(app);

    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        console.log('permission', permission);
        const newToken = await getToken(messaging);
        console.log('newToken', newToken);
        // set token in local storage
        localStorage.setItem('fcm_token', newToken);
        // setNotificationPermission(permission);
        // setToken(newToken);
      } catch (error) {
        console.error('Notification permission denied:', error);
      }
    };
    requestNotificationPermission();
  }, []);
  const { products, loadMore, hasNextPage, isLoadingMore, isLoading } =
    useProducts({
      ...(query.category && { categories: query.category }),
      ...(query.price && { price: query.price }),
    });
  return (
    <Grid
      products={products}
      limit={30}
      onLoadMore={loadMore}
      hasNextPage={hasNextPage}
      isLoadingMore={isLoadingMore}
      isLoading={isLoading}
    />
  );
}

// TODO: SEO text gulo translation ready hobe kina? r seo text gulo static thakbe or dynamic?
const Home: NextPageWithLayout = () => {
  return (
    <>
      <Seo
        title="UI Design Resources, UI Kits, Wireframes, Icons and More"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes.home}
      />
      {/* <CategoryFilter /> */}
      <Products />
    </>
  );
};

Home.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;

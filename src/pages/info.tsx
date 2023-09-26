import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import type { NextPageWithLayout } from '@/types';
import React from 'react';
import GeneralLayout from '@/layouts/_general-layout';
import routes from '@/config/routes';
import camera from '@/assets/images/camra-big.png';

const InfoPage: NextPageWithLayout = () => {
  return (
    <>
      <div
        className="mx-auto flex h-full flex-col p-4 sm:p-5"
        style={{ padding: '80px' }}
      >
        <div className="flex">
          <div className="w-1/2 ">
            <div className="banner banner--white ">
              <img src={camera.src}></img>
            </div>
          </div>
          <div className="w-1/2">
            <div className="banner__container">
              <div className=" banner__content">
                <h1 className="banner__title">
                  Enhance your Digital Capabilities with Dominant Camera Rental
                  Software
                </h1>
                <p>
                  Advanced digital capabilities to accept rental orders, manage
                  security and reduce overdue returns
                </p>
                <div className="banner__action">
                  <a href={routes.home} className="btn  popup-btn btn--dark-bg">
                    Book Product
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

InfoPage.getLayout = function getLayout(page) {
  return <GeneralLayout>{page}</GeneralLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 60, // In seconds
  };
};

export default InfoPage;

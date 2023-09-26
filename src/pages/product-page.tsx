import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { useState } from 'react';
import Layout from '@/layouts/_layout';

import Seo from '@/layouts/_seo';
import routes from '@/config/routes';
import { useTopShops } from '@/data/shop';
import { useTranslation } from 'next-i18next';
import camra from '@/assets/images/camra.png';
import camraimage from '@/assets/images/camra-big.png';
import status from '@/assets/images/status.png';
import tag from '@/assets/images/tag.png';
import include from '@/assets/images/include.png';
import pickup from '@/assets/images/pick-up.png';
import thumbsdown from '@/assets/images/thumbs-down.png';
import thumbsup from '@/assets/images/thumbs-up.png';
import plusicon from '@/assets/images/plus-math.png';

const MAP_RANGE_FILTER = [
  {
    label: 'text-weekly',
    range: 7,
  },
  {
    label: 'text-monthly',
    range: 30,
  },
  {
    label: 'text-yearly',
    range: 365,
  },
];

// Every shop owner in an author here
function Shops() {
  let [selected, setRange] = useState(MAP_RANGE_FILTER[2]);
  let [searchText, setSearchText] = useState('');
  const { shops, loadMore, hasNextPage, isLoadingMore, isLoading } =
    useTopShops({
      range: selected.range,
      name: searchText,
    });
  const { t } = useTranslation('common');
  return (
    <>
      <div className="product-responsive flex gap-4 px-7 pt-7">
        <div className="w-3/5">
          <div className="product-main">
            <div className="product-catagary">
              <ul>
                <li className="active">
                  <a href="#">
                    <img src={camra.src} alt="" />
                  </a>
                </li>
                <li>
                  {' '}
                  <a href="#">
                    <img src={camra.src} alt="" />
                  </a>
                </li>
                <li>
                  {' '}
                  <a href="#">
                    <img src={camra.src} alt="" />
                  </a>
                </li>
                <li>
                  {' '}
                  <a href="#">
                    <img src={camra.src} alt="" />
                  </a>
                </li>
                <li>
                  {' '}
                  <a href="#">
                    <img src={camra.src} alt="" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="big-image">
              <img src={camraimage.src} alt="" />
            </div>
          </div>
          <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 ">
              <div className="main-feature flex">
                <h1 className="main-feature-heading">Feature 1</h1>
                <div className="feature-text">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Praesent pharetra ante ut purus lobortis scelerise.
                  </p>
                </div>
              </div>
              <div className="main-feature flex">
                <h1 className="main-feature-heading">Feature 2</h1>
                <div className="feature-text">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Praesent pharetra ante ut purus lobortis scelerise.
                  </p>
                </div>
              </div>
              <div className="main-feature flex">
                <h1 className="main-feature-heading">Feature 3</h1>
                <div className="feature-text">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Praesent pharetra ante ut purus lobortis scelerise.
                  </p>
                </div>
              </div>
              <div className="main-feature flex">
                <h1 className="main-feature-heading">Feature 4</h1>
                <div className="feature-text">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Praesent pharetra ante ut purus lobortis scelerise.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto mt-16">
            <div className="grid w-full grid-cols-1 gap-6">
              <div className="main-specation flex">
                <h1 className="main-feature-specation">
                  Tecnical Specs: Arri Alexa Mini
                </h1>
                <div className="product-list w-6/12 border-r-2 pl-5 pr-5 pt-5 pb-5">
                  <div className="specation-text">
                    <p>
                      <b>SENSOR TYPE</b>
                      <br />
                      Super 35 format Arri ALEV 4 CMOS sensor with Bayer pattern
                      color filter array{' '}
                    </p>
                  </div>
                  <div className="specation-text">
                    <p>
                      <b>SENSOR TYPE</b>
                      <br />
                      Super 35 format Arri ALEV 4 CMOS sensor with Bayer pattern
                      color filter array{' '}
                    </p>
                  </div>
                  <div className="specation-text">
                    <p>
                      <b>SENSOR TYPE</b>
                      <br />
                      Super 35 format Arri ALEV 4 CMOS sensor with Bayer pattern
                      color filter array{' '}
                    </p>
                  </div>
                  <div className="specation-text">
                    <p>
                      <b>SENSOR TYPE</b>
                      <br />
                      Super 35 format Arri ALEV 4 CMOS sensor with Bayer pattern
                      color filter array{' '}
                    </p>
                  </div>
                  <div className="specation-text">
                    <p>
                      <b>SENSOR TYPE</b>
                      <br />
                      Super 35 format Arri ALEV 4 CMOS sensor with Bayer pattern
                      color filter array{' '}
                    </p>
                  </div>
                </div>
                <div className="product-list w-6/12 pl-5 pr-5 pt-5 pb-5">
                  <div className="specation-text">
                    <p>
                      <b>SENSOR TYPE</b>
                      <br />
                      Super 35 format Arri ALEV 4 CMOS sensor with Bayer pattern
                      color filter array{' '}
                    </p>
                  </div>
                  <div className="specation-text">
                    <p>
                      <b>SENSOR TYPE</b>
                      <br />
                      Super 35 format Arri ALEV 4 CMOS sensor with Bayer pattern
                      color filter array{' '}
                    </p>
                  </div>
                  <div className="specation-text">
                    <p>
                      <b>SENSOR TYPE</b>
                      <br />
                      Super 35 format Arri ALEV 4 CMOS sensor with Bayer pattern
                      color filter array{' '}
                    </p>
                  </div>
                  <div className="specation-text">
                    <p>
                      <b>SENSOR TYPE</b>
                      <br />
                      Super 35 format Arri ALEV 4 CMOS sensor with Bayer pattern
                      color filter array{' '}
                    </p>
                  </div>
                  <div className="specation-text">
                    <p>
                      <b>SENSOR TYPE</b>
                      <br />
                      Super 35 format Arri ALEV 4 CMOS sensor with Bayer pattern
                      color filter array{' '}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto mt-16">
            <div className="grid w-full grid-cols-1 gap-6">
              <div className="main-specation flex">
                <h1 className="main-feature-specation">
                  Question and Answers (7){' '}
                  <span className="plus-icon">
                    <img src={plusicon.src} alt="" />
                  </span>
                </h1>
                <div className="w-full pl-5 pr-5 pt-5 pb-5">
                  <div className="specation-text">
                    <ul>
                      <li>
                        <b>Q: Do you have multivendor support?</b>
                      </li>
                      <li>
                        A: Lorem ipsum dolor sit amet, consectetur adipiscing te
                        ut purus lobortis scelerise.
                      </li>
                      <li className="spection-date">
                        May 15, 2023{' '}
                        <img src={thumbsdown.src} alt="" className="thump-up" />
                        2<img src={thumbsup.src} alt="" className="thump-up" />5
                      </li>
                    </ul>
                  </div>
                  <div className="specation-text">
                    <ul>
                      <li>
                        <b>Q: Do you have multivendor support?</b>
                      </li>
                      <li>
                        A: Lorem ipsum dolor sit amet, consectetur adipiscing te
                        ut purus lobortis scelerise.
                      </li>
                      <li className="spection-date">
                        May 15, 2023{' '}
                        <img src={thumbsdown.src} alt="" className="thump-up" />
                        2<img src={thumbsup.src} alt="" className="thump-up" />5
                      </li>
                    </ul>
                  </div>
                  <div className="specation-text">
                    <ul>
                      <li>
                        <b>Q: Do you have multivendor support?</b>
                      </li>
                      <li>
                        A: Lorem ipsum dolor sit amet, consectetur adipiscing te
                        ut purus lobortis scelerise.
                      </li>
                      <li className="spection-date">
                        May 15, 2023{' '}
                        <img src={thumbsdown.src} alt="" className="thump-up" />
                        2<img src={thumbsup.src} alt="" className="thump-up" />5
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="camara-detail relative w-2/5">
          <div className="product-details sticky px-8 py-8">
            <h2 className="product-heading">
              Arri Alexa Mini Kit + 28-70mm f/3.5-5.6 OSS, Kit de cámara ar...
            </h2>
            <p>
              Una de las cámaras más utilizadas en la industria del cine y la
              publicidad hoy en día en todo el mundo, estás en la página
              correcta en todo el mundo, estás en la página correcta....
            </p>
            <p className="price">
              100,90 € <span>/day</span>
            </p>
            <p className="status">
              <img src={status.src} alt="" className="mr-2" />
              STATUS: Available (x2)
            </p>
            <p className="status">
              <img src={tag.src} alt="" className="mr-2" />
              Tags: <a href="#">Camera, </a> <a href="#">Arri, </a>
              <a href="#"> 4k</a>
            </p>
            <p className="status">
              <img src={include.src} alt="" className="mr-2" /> Includes:{' '}
              <a href="#"> Sony Alpha 7 III, lenss....</a>{' '}
            </p>
            <p className="status">
              <img src={pickup.src} alt="" className="mr-2" />
              Pick Up: <a href="#">Valencia, calle daniel bala...</a>
            </p>
            <div className="add-cart-main mt-4">
              <a href="#" className="add-cart1">
                Add to cart
              </a>
              <span className="add-number">
                <input
                  type="number"
                  className="card-number"
                  maxLength={5}
                  minLength={5}
                  value={2}
                ></input>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-20 mb-20 pl-7 pr-7">
        <h1 className="product-details-page-heading">
          Creemos que te puede interesar
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2  lg:grid-cols-3 2xl:grid-cols-5">
          <div className="main-feature flex">
            <img src={camraimage.src} alt="" className="feature-image" />
            <h1 className="gellery-details-page">Arri Alexa Mini Kit</h1>
            <div className="gellery-details-page-description">
              <p>Lorem ipsum dolor sit amet, elit consectetur adipiscing .</p>
            </div>
            <div className="gellery-details-page-price">
              <b> 550.90€/</b> Dia
            </div>
          </div>
          <div className="main-feature flex">
            <img src={camraimage.src} alt="" className="feature-image" />
            <h1 className="gellery-details-page">Arri Alexa Mini Kit</h1>
            <div className="gellery-details-page-description">
              <p>Lorem ipsum dolor sit amet, elit consectetur adipiscing .</p>
            </div>
            <div className="gellery-details-page-price">
              <b> 550.90€/</b> Dia
            </div>
          </div>
          <div className="main-feature flex">
            <img src={camraimage.src} alt="" className="feature-image" />
            <h1 className="gellery-details-page">Arri Alexa Mini Kit</h1>
            <div className="gellery-details-page-description">
              <p>Lorem ipsum dolor sit amet, elit consectetur adipiscing .</p>
            </div>
            <div className="gellery-details-page-price">
              <b> 550.90€/</b> Dia
            </div>
          </div>
          <div className="main-feature flex">
            <img src={camraimage.src} alt="" className="feature-image" />
            <h1 className="gellery-details-page">Arri Alexa Mini Kit</h1>
            <div className="gellery-details-page-description">
              <p>Lorem ipsum dolor sit amet, elit consectetur adipiscing .</p>
            </div>
            <div className="gellery-details-page-price">
              <b> 550.90€/</b> Dia
            </div>
          </div>
          <div className="main-feature flex">
            <img src={camraimage.src} alt="" className="feature-image" />
            <h1 className="gellery-details-page">Arri Alexa Mini Kit</h1>
            <div className="gellery-details-page-description">
              <p>Lorem ipsum dolor sit amet, elit consectetur adipiscing .</p>
            </div>
            <div className="gellery-details-page-price">
              <b> 550.90€/</b> Dia
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
const AuthorsPage: NextPageWithLayout = () => {
  return (
    <>
      <Seo
        title="Shops"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes.authors}
      />
      <Shops />
    </>
  );
};
AuthorsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 60, // In seconds
  };
};
export default AuthorsPage;

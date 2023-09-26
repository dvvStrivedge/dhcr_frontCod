import {
  Swiper,
  SwiperSlide,
  SwiperOptions,
  Navigation,
  Thumbs,
  FreeMode,
} from '@/components/ui/slider';
import Image from '@/components/ui/image';
import { use, useEffect, useRef, useState } from 'react';
import { ChevronLeft } from '@/components/icons/chevron-left';
import { ChevronRight } from '@/components/icons/chevron-right';
import type { Product } from '@/types';
import placeholder from '@/assets/images/placeholders/product.svg';
import usePrice from '@/lib/hooks/use-price';
import AnchorLink from '../ui/links/anchor-link';
import routes from '@/config/routes';
import { useTranslation } from 'react-i18next';
import { useCart } from '../cart/lib/cart.context';
import { generateCartItem } from '../cart/lib/generate-cart-item';
import toast from 'react-hot-toast';
import cn from 'classnames';
import Button from '../ui/button';
import status from '@/assets/images/status.png';
import tag from '@/assets/images/tag.png';
import include from '@/assets/images/include.png';
import pickup from '@/assets/images/pick-up.png';
import plusicon from '@/assets/images/plus-math.png';
import ProductReviews from '../review/product-reviews';
import ProductQuestions from '../questions/product-questions';
import FavoriteButton from '../favorite/favorite-button';
import { useModalAction } from '../modal-views/context';

interface Props {
  gallery: any[];
  className?: string;
  description?: string;
  name?: string;
  item?: Product;
  withPrice?: boolean;
  categories?: any;
  toastClassName?: string;
  productId?: string;
  shopId?: string;
  _html?: string;
}

const swiperParams: SwiperOptions = {
  slidesPerView: 1,
  spaceBetween: 0,
};

export default function ProductThumbnailGalleryNewDesign({
  gallery,
  className = 'flex product-list-image',
  description,
  name,
  item,
  withPrice = true,
  categories,
  toastClassName,
}: Props) {
  let [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('common');
  const {
    addItemToCart,
    updateCartLanguage,
    language,
    isInStock,
    updateCartQuantity,
    isInCart,
    items,
  } = useCart();
  const [addToCartLoader, setAddToCartLoader] = useState(false);
  const [cartingSuccess, setCartingSuccess] = useState(false);
  const { price } = usePrice({
    amount: item?.sale_price ? item?.sale_price : item?.price ?? 0,
    baseAmount: item?.price,
  });
  const [defaultQuantity, setDefaultQuantity] = useState(
    items.find((cartItem) => cartItem.id === item?.id)?.quantity ?? 1
  );

  const [showMoreFeature1, setShowMoreFeature1] = useState(false);
  const [showMoreFeature2, setShowMoreFeature2] = useState(false);
  const [showMoreFeature3, setShowMoreFeature3] = useState(false);
  const [showMoreFeature4, setShowMoreFeature4] = useState(false);
  const { openModal } = useModalAction();

  const displayContent1 = showMoreFeature1
    ? item?.feature_1
    : `${item?.feature_1?.split(' ').slice(0, 50).join(' ')}...`;
  const displayContent2 = showMoreFeature2
    ? item?.feature_2
    : `${item?.feature_2?.split(' ').slice(0, 50).join(' ')}...`;
  const displayContent3 = showMoreFeature3
    ? item?.feature_3
    : `${item?.feature_3?.split(' ').slice(0, 50).join(' ')}...`;
  const displayContent4 = showMoreFeature4
    ? item?.feature_4
    : `${item?.feature_4?.split(' ').slice(0, 50).join(' ')}...`;

  // useEffect(() => {
  //   setDefaultQuantity(
  //     items.find((cartItem) => cartItem.id === item?.id)?.quantity ?? 1
  //   );
  // }, [addToCartLoader, cartingSuccess, items, item?.id]);

  function handleAddToCart(e: any) {
    e.preventDefault();
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
      addSuccessfully();
    }, 650);
  }
  function onQuantityChange(value: string) {
    setDefaultQuantity(parseInt(value));
    // updateCartQuantity(item, parseInt(value));
  }

  function addSuccessfully() {
    if (item?.language !== language) {
      updateCartLanguage(item?.language ?? 'en');
    }

    setCartingSuccess(true);
    addItemToCart(generateCartItem(item), defaultQuantity);
    toast.success(<b>{t('text-add-to-cart-message')}</b>, {
      className: toastClassName,
    });
    setTimeout(() => {
      setCartingSuccess(false);
    }, 800);
  }

  function onZoomImage(image: string) {
    // zoom image with swiper
    if (image) {
      openModal('ZOOM_IMAGE_VIEW', {
        image,
        gallery,
      });
    }
  }
  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  function displayCategories() {
    // if categories length is greater than 1 then show comma
    if (categories.length > 1) {
      return categories.map((category: any, index: number) => (
        <span
          className="overflow-wrap ml-1 break-words text-xs text-white"
          key={category.id}
        >
          {category.name}
          {index < categories.length - 1 ? ',' : ''}
        </span>
      ));
    } else {
      return categories.map((category: any, index: number) => (
        <span
          className="overflow-wrap ml-1 break-words text-xs text-white"
          key={category.id}
        >
          {category.name}
        </span>
      ));
    }
  }

  return (
    <div className={className}>
      <div className="product-responsive m-auto flex gap-4 px-7 pt-7">
        <div className="w-3/5">
          <div className="product-list-image flex">
            <div className="mr-9">
              <Swiper
                id="productGalleryThumbs"
                freeMode={true}
                modules={[Navigation, Thumbs, FreeMode]}
                observer={true}
                slidesPerView={4}
                onSwiper={setThumbsSwiper}
                direction="vertical"
                observeParents={true}
                watchSlidesProgress={true}
              >
                {gallery?.map((item: any) => (
                  <SwiperSlide
                    key={`product-thumb-gallery-${item.id}`}
                    className="relative flex aspect-[3/2] cursor-pointer items-center justify-center border border-light-500 transition hover:opacity-75 dark:border-dark-500"
                  >
                    <Image
                      fill
                      src={item?.thumbnail ?? placeholder}
                      alt={`Product thumb gallery ${item.id}`}
                      className="object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="relative mb-3 max-w-screen-sm max-w-screen-lg flex-1 overflow-hidden  xl:mb-5 3xl:max-w-[800px]">
              <Swiper
                id="productGallery"
                speed={400}
                allowTouchMove={false}
                // direction='vertical'
                thumbs={{
                  swiper:
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
                modules={[Navigation, Thumbs, FreeMode]}
                navigation={{
                  prevEl: prevRef.current!,
                  nextEl: nextRef.current!,
                }}
                {...swiperParams}
                style={{ height: '100%' }}
              >
                {gallery?.map((item: any) => (
                  <SwiperSlide
                    key={`product-gallery-${item.id}`}
                    className="image-container relative flex aspect-[3/2] items-center justify-center bg-light-200 dark:bg-dark-200"
                  >
                    <Image
                      fill
                      src={item?.original ?? placeholder}
                      alt={`Product gallery ${item.id}`}
                      className="object-cover-zoom"
                      onClick={() => {
                        onZoomImage(item?.original ?? placeholder);
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* <div className="absolute top-2/4 z-10 flex w-full items-center justify-between px-2.5 xl:px-4">
          <div
            ref={prevRef}
            className="flex h-8 w-8 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full border border-light-400 bg-light text-dark/90 shadow-xl transition duration-300 hover:bg-light-200 hover:text-brand-dark focus:outline-none rtl:rotate-180 xl:h-9 xl:w-9"
          >
            <ChevronLeft className="h-4 w-4 xl:h-[18px] xl:w-[18px]" />
          </div>
          <div
            ref={nextRef}
            className="flex h-8 w-8 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full border border-light-400 bg-light text-dark/90 shadow-xl transition duration-300 hover:bg-light-200 hover:text-brand-dark focus:outline-none rtl:rotate-180 xl:h-9 xl:w-9"
          >
            <ChevronRight className="h-4 w-4 xl:h-[18px] xl:w-[18px]" />
          </div>
        </div> */}
            </div>
          </div>

          <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 ">
              {item?.feature_1 ? (
                <div className="main-feature flex">
                  <h1 className="main-feature-heading text-dark-600 dark:text-light-600">
                    Feature 1
                  </h1>
                  <div className="feature-text text-dark-600 dark:text-light-600">
                    {item?.feature_1.split(' ').length > 50
                      ? displayContent1
                      : item?.feature_1}
                    {item?.feature_1.split(' ').length > 50 && (
                      <button
                        onClick={() => setShowMoreFeature1(!showMoreFeature1)}
                        className="btn ml-2 text-green-300"
                      >
                        {showMoreFeature1 ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                ''
              )}
              {item?.feature_2 ? (
                <div className="main-feature flex">
                  <h1 className="main-feature-heading text-dark-600 dark:text-light-600">
                    Feature 2
                  </h1>
                  <div className="feature-text text-dark-600 dark:text-light-600">
                    {item?.feature_2.split(' ').length > 50
                      ? displayContent2
                      : item?.feature_2}
                    {item?.feature_2.split(' ').length > 50 && (
                      <button
                        onClick={() => setShowMoreFeature2(!showMoreFeature2)}
                        className="btn ml-2 text-green-300"
                      >
                        {showMoreFeature2 ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                ''
              )}
              {item?.feature_3 ? (
                <div className="main-feature flex">
                  <h1 className="main-feature-heading text-dark-600 dark:text-light-600">
                    Feature 3
                  </h1>
                  <div className="feature-text text-dark-600 dark:text-light-600">
                    {item?.feature_3.split(' ').length > 50
                      ? displayContent3
                      : item?.feature_3}
                    {item?.feature_3.split(' ').length > 50 && (
                      <button
                        onClick={() => setShowMoreFeature3(!showMoreFeature3)}
                        className="btn ml-2 text-green-300"
                      >
                        {showMoreFeature3 ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                ''
              )}
              {item?.feature_4 ? (
                <div className="main-feature flex">
                  <h1 className="main-feature-heading text-dark-600 dark:text-light-600">
                    Feature 4
                  </h1>
                  <div className="feature-text text-dark-600 dark:text-light-600">
                    {item?.feature_4.split(' ').length > 50
                      ? displayContent4
                      : item?.feature_4}
                    {item?.feature_4.split(' ').length > 50 && (
                      <button
                        onClick={() => setShowMoreFeature4(!showMoreFeature4)}
                        className="btn ml-2 text-green-400"
                      >
                        {showMoreFeature4 ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="container mx-auto mt-16">
            <div className="grid w-full grid-cols-1 gap-6">
              <div className="main-specation flex">
                <h1 className="main-feature-specation text-dark-600 dark:text-light-600">
                  Tecnical Specs: {item?.technical_specs_name}
                </h1>
                <div className="product-list w-6/12 border-r-2 pl-5 pr-5 pt-5 pb-5">
                  <div className="specation-text">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item?.technical_specs_description?.toString(),
                      }}
                    />
                  </div>
                  {/* <div className='specation-text'>
                   <p><b>SENSOR TYPE</b><br />Super 35 format  Arri ALEV 4 CMOS sensor with Bayer pattern color filter array   </p>
                 </div>
                 <div className='specation-text'>
                   <p><b>SENSOR TYPE</b><br />Super 35 format  Arri ALEV 4 CMOS sensor with Bayer pattern color filter array   </p>
                 </div>
                 <div className='specation-text'>
                   <p><b>SENSOR TYPE</b><br />Super 35 format  Arri ALEV 4 CMOS sensor with Bayer pattern color filter array   </p>
                 </div>
                 <div className='specation-text'>
                   <p><b>SENSOR TYPE</b><br />Super 35 format  Arri ALEV 4 CMOS sensor with Bayer pattern color filter array   </p>
                 </div> */}
                </div>
                <div className="product-list w-6/12 pl-5 pr-5 pt-5 pb-5">
                  <div className="specation-text text-dark-600 dark:text-light-600">
                    <p>
                      <b>SENSOR TYPE</b>
                      <br />
                      Super 35 format Arri ALEV 4 CMOS sensor with Bayer pattern
                      color filter array{' '}
                    </p>
                  </div>
                  <div className="specation-text text-dark-600 dark:text-light-600">
                    <p>
                      <b>SENSOR TYPE</b>
                      <br />
                      Super 35 format Arri ALEV 4 CMOS sensor with Bayer pattern
                      color filter array{' '}
                    </p>
                  </div>
                  <div className="specation-text text-dark-600 dark:text-light-600">
                    <p>
                      <b>SENSOR TYPE</b>
                      <br />
                      Super 35 format Arri ALEV 4 CMOS sensor with Bayer pattern
                      color filter array{' '}
                    </p>
                  </div>
                  <div className="specation-text text-dark-600 dark:text-light-600">
                    <p>
                      <b>SENSOR TYPE</b>
                      <br />
                      Super 35 format Arri ALEV 4 CMOS sensor with Bayer pattern
                      color filter array{' '}
                    </p>
                  </div>
                  <div className="specation-text text-dark-600 dark:text-light-600">
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
                <h1 className="main-feature-specation text-dark-600 dark:text-light-600">
                  Reviews{' '}
                  {/* <span className="plus-icon">
                    <img src={plusicon.src} alt="" />
                  </span> */}
                </h1>
                <div className="w-full pl-5 pr-5 pt-5 pb-5">
                  <div className="mt-4 w-full md:mt-8 md:space-y-10 lg:mt-12 lg:flex lg:flex-col lg:space-y-12">
                    {item ? (
                      <>
                        <ProductReviews productId={item.id} />
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto mt-16">
            <div className="grid w-full grid-cols-1 gap-6">
              <div className="main-specation flex">
                <h1 className="main-feature-specation text-dark-600 dark:text-light-600">
                  Question and Answers{' '}
                  <span className="plus-icon">
                    <img src={plusicon.src} alt="" />
                  </span>
                </h1>
                <div className="w-full pl-5 pr-5 pt-5 pb-5">
                  <div className="mt-4 w-full md:mt-8 md:space-y-10 lg:mt-12 lg:flex lg:flex-col lg:space-y-12">
                    {item ? (
                      <>
                        <ProductQuestions
                          productId={item.id}
                          shopId={item.shop?.id}
                        />
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {description && (
          <div className="camara-detail relative w-2/5">
            <div className="camera-specifications sticky flex-1 overflow-hidden rounded bg-slate-800 px-8 py-8 shadow-lg  3xl:max-w-[450px]">
              <div className="product-heading">
                <div className="text-xl font-bold text-white">{name}</div>
                <div className="">
                  {' '}
                  <FavoriteButton className="ml-2" productId={item?.id ?? 0} />
                </div>
              </div>
              <p className="text-sm text-white">{description}</p>
              {/* sale price */}
              <div className="price pt-4 pb-4">
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-white">
                    {withPrice && price}
                  </div>
                </div>
              </div>

              <div className="pt-2 pb-2 text-white">
                <img src={status.src} alt="" className="mr-1" /> STATUS:
                <span className="overflow-wrap ml-1 break-words text-xs text-white">
                  {item?.in_stock ? 'Available' : 'Out of Stock'}
                </span>
              </div>

              {/* tags */}
              {categories && (
                <div className="pt-2 pb-2 text-white">
                  <img src={tag.src} alt="" className="mr-1" /> Categories:
                  <span className="overflow-wrap ml-1 break-words text-xs text-white">
                    {displayCategories()}
                  </span>
                </div>
              )}

              <div className="pt-2 pb-2 text-white">
                <img src={include.src} alt="" className="mr-1" /> Includes:
                <span className="overflow-wrap ml-1 break-words text-xs text-white">
                  {item?.includes ? item?.includes : ''}
                </span>
              </div>

              <div className="pt-2 pb-2 text-white">
                <img src={pickup.src} alt="" className="mr-1" /> Pickup:
                <span className="overflow-wrap ml-1 break-words text-xs text-white">
                  {item?.pickup_locations}
                </span>
              </div>

              {/* Buttons */}
              <div className="pt-4 pb-4">
                <div className="add-cart-main mt-4">
                  <Button
                    type="button"
                    onClick={(e) => handleAddToCart(e)}
                    isLoading={addToCartLoader}
                    className={cn(
                      'relative',
                      cartingSuccess
                        ? 'is-carting pointer-events-none cursor-not-allowed'
                        : 'pointer-events-auto cursor-pointer',
                      'add-cart1',
                      className
                    )}
                    disabled={isInStock(item?.id ?? 0) ? false : true}
                  >
                    Add to cart
                  </Button>

                  <span className="add-number">
                    <input
                      type="number"
                      className="card-number"
                      maxLength={5}
                      minLength={5}
                      value={defaultQuantity}
                      onChange={(e) => onQuantityChange(e.target.value)}
                    ></input>
                  </span>
                </div>
                {/* <Button
              type="button"
              onClick={() => handleAddToCart()}
              isLoading={addToCartLoader}
              className={cn(
                'relative',
                cartingSuccess
                  ? 'is-carting pointer-events-none cursor-not-allowed'
                  : 'pointer-events-auto cursor-pointer',
                className
              )}
              disabled={isInStock(item?.id ?? 0) ? false : true}
              // className="transition-fill-colors flex min-h-[46px] w-full flex-1 items-center justify-center gap-2 rounded border border-light-600 bg-transparent py-3 px-4 font-semibold text-dark duration-200 hover:bg-light-400 focus:bg-light-500 dark:border-dark-600 dark:text-light dark:hover:bg-dark-600 dark:focus:bg-dark-600 xs:w-auto sm:h-12 md:px-5"
            >
              Add to cart |
            </Button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

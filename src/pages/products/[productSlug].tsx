import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { useRouter } from 'next/router';
import type { NextPageWithLayout, Product } from '@/types';
import { motion } from 'framer-motion';
import Layout from '@/layouts/_layout';
import client from '@/data/client';
import ProductSocialShare from '@/components/product/product-social-share';
import ProductDetailsPaper from '@/components/product/product-details-paper';
import { LongArrowIcon } from '@/components/icons/long-arrow-icon';
import routes from '@/config/routes';
import {
  fadeInBottom,
  fadeInBottomWithScaleY,
} from '@/lib/framer-motion/fade-in-bottom';
import isEmpty from 'lodash/isEmpty';
import invariant from 'tiny-invariant';
import ProductThumbnailGalleryNewDesign from '@/components/product/product-thumbnail-gallery-new-design';
import { usePopularProducts } from '@/data/product';
import RelatedProducts from '@/components/product/related-products';
import BottomNavigation from '@/layouts/_bottom-navigation';
import Header from '@/layouts/_header';

// This function gets called at build time
type ParsedQueryParams = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
  locales,
}) => {
  invariant(locales, 'locales is not defined');
  const { data } = await client.products.all({ limit: 100 });
  const paths = data?.flatMap((product) =>
    locales?.map((locale) => ({
      params: { productSlug: product.slug },
      locale,
    }))
  );
  return {
    paths,
    fallback: 'blocking',
  };
};

type PageProps = {
  product: Product;
};

export const getStaticProps: GetStaticProps<
  PageProps,
  ParsedQueryParams
> = async ({ params, locale }) => {
  const { productSlug } = params!; //* we know it's required because of getStaticPaths
  try {
    const product = await client.products.get({
      slug: productSlug,
      language: locale,
    });
    return {
      props: {
        product,
        ...(await serverSideTranslations(locale!, ['common'])),
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

function getPreviews(gallery: any[], image: any) {
  if (!isEmpty(gallery) && Array.isArray(gallery)) return gallery;
  if (!isEmpty(image)) return [image, {}];
  return [{}, {}];
}

const ProductPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ product }) => {
  const { t } = useTranslation('common');
  const { id, name, slug, image, gallery, description, categories, tags } =
    product;
  const router = useRouter();
  const previews = getPreviews(gallery, image);
  const categoryIds = categories?.map((category) => category.id);

  // const { popularProducts, isLoading } = usePopularProducts({
  //   limit: 5,
  //   category_id: categoryIds,
  //   product_id: id,
  // });

  return (
    <motion.div
      initial="exit"
      animate="enter"
      exit="exit"
      className="flex min-h-screen w-full flex-col bg-light-300 dark:bg-dark-100"
    >
      <Header
        // isCollapse={collapse}
        showHamburger={true}
        // onClickHamburger={toggleSidebar}
      />
      <div className="flex flex-1">
        {/* <Sidebar isCollapse={collapse} /> */}
        <main
          className="flex w-full flex-col ltr:sm:pl-60 rtl:sm:pr-60 ltr:xl:pl-[75px] rtl:xl:pr-[75px]"
          // collapse
          //   ? 'ltr:sm:pl-60 rtl:sm:pr-60 ltr:xl:pl-[75px] rtl:xl:pr-[75px]'
        >
          <div className="relative">
            <div className="h-full min-h-screen p-4 md:px-6 lg:px-8 lg:pt-6">
              <div className="sticky top-0 z-20 -mx-4 mb-1 -mt-2 flex items-center bg-light-300 p-4 dark:bg-dark-100 sm:static sm:top-auto sm:z-0 sm:m-0 sm:mb-4 sm:bg-transparent sm:p-0 sm:dark:bg-transparent">
                <button
                  onClick={() => router.push(routes?.home)}
                  className="group inline-flex items-center gap-1.5 font-medium text-dark/70 hover:text-dark rtl:flex-row-reverse dark:text-light/70 hover:dark:text-light lg:mb-6"
                >
                  <LongArrowIcon className="h-4 w-4" />
                  {t('text-back')}
                </button>
              </div>
              {/* <motion.div
          variants={staggerTransition()}
          className="grid gap-4 sm:grid-cols-2 lg:gap-6"
        >
          {previews?.map((img) => (
            <motion.div
              key={img.id}
              variants={fadeInBottomWithScaleX()}
              className="relative aspect-[3/2]"
            >
              <Image
                alt={name}
                fill
                quality={100}
                src={img?.original ?? placeholder}
                className="bg-light-500 object-cover dark:bg-dark-300"
              />
            </motion.div>
          ))}
        </motion.div> */}
              <div className="w-full">
                <ProductThumbnailGalleryNewDesign
                  gallery={previews}
                  description={description}
                  name={name}
                  item={product}
                  categories={categories}
                />
              </div>
              <motion.div
                variants={fadeInBottom()}
                className="justify-center py-6 lg:flex lg:flex-col lg:py-10"
              >
                <ProductDetailsPaper product={product} className="lg:hidden" />

                <ProductSocialShare
                  productSlug={slug}
                  className="border-t border-light-500 pt-5 dark:border-dark-400 md:pt-7 lg:hidden"
                />
              </motion.div>
            </div>

            {/* <motion.div
        variants={fadeInBottomWithScaleY()}
        className="sticky bottom-0 right-0 z-10 hidden h-[100px] w-full border-t border-light-500 bg-light-100 px-8 py-5 dark:border-dark-400 dark:bg-dark-200 lg:flex 3xl:h-[120px]"
      >
        <ProductDetailsPaper product={product} />
      </motion.div> */}
          </div>
        </main>
      </div>
      <div className="container mx-auto mt-20 mb-20 ">
        <h1 className="product-details-page-heading text-dark-600 dark:text-light-600">
          Related Products
        </h1>
        {product?.related_products?.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 text-dark-600 dark:text-light-600 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {product?.related_products.map((product) => (
              <RelatedProducts key={product.id} item={product} />
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center py-20">
            <h2 className="text-center text-xl font-semibold text-gray-500 dark:text-gray-400">
              No products found
            </h2>
          </div>
        )}
      </div>
      {/* <BottomNavigation /> */}
    </motion.div>
  );
};

// ProductPage.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>;
// };

export default ProductPage;

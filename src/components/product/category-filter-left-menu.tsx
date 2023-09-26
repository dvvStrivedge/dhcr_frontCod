import { useRouter } from 'next/router';
import cn from 'classnames';
import { useCategories } from '@/data/category';
import { useTranslation } from 'next-i18next';
import Scrollbar from '../ui/scrollbar';
import ActiveLink from '../ui/links/active-link';
import { HomeIcon } from '../icons/home-icon';
import { CompactGridIcon } from '../icons/compact-grid-icon';

interface NavLinkProps {
  href: string;
  title: string;
  icon: React.ReactNode;
  isCollapse?: boolean;
}

function NavLink({ href, icon, title, isCollapse }: NavLinkProps) {
  return (
    <ActiveLink
      href={href}
      className="my-0.5 flex items-center gap-1 px-4 py-3 hover:bg-light-300 hover:dark:bg-dark-300 xs:px-6 sm:my-1 sm:gap-1.5 sm:px-7 lg:gap-2 xl:my-0.5"
      activeClassName="text-dark-100 active-text-dark dark:active-text-light dark:text-light-400 font-medium bg-light-400 dark:bg-dark-400 hover:bg-light-600 hover:dark:bg-dark-500"
    >
      <span
        className={cn(
          'flex flex-shrink-0 items-center justify-start',
          isCollapse ? 'w-8 xl:w-auto' : 'w-auto xl:w-8'
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          'text-dark-100 dark:text-light-400',
          isCollapse ? 'inline-flex xl:hidden' : 'hidden xl:inline-flex'
        )}
      >
        {title}
      </span>
    </ActiveLink>
  );
}

function CategoryItem({
  categoryName,
  isActive,
  onClick,
}: {
  categoryName: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'my-0.5 flex items-center gap-1 px-4 py-3 hover:bg-light-300 hover:dark:bg-dark-300 xs:px-6 sm:my-1 sm:gap-1.5 sm:px-7 lg:gap-2 xl:my-0.5',
        {
          'active-text-dark dark:active-text-light bg-light-400 font-medium hover:bg-light-600 dark:bg-dark-400 dark:text-light-400 hover:dark:bg-dark-500':
            isActive,
          '': !isActive,
        }
      )}
      style={{ cursor: 'pointer' }}
    >
      <span
        className={cn(
          'flex w-auto flex-shrink-0 items-center justify-start xl:w-8'
        )}
      >
        {<CompactGridIcon className="h-[18px] w-[18px] text-current" />}
      </span>
      <span className={cn('text-dark-100 dark:text-light-400')}>
        {categoryName}
      </span>
    </div>
    // <NavLink
    //     title={categoryName}
    //     href={'/'}
    //     // isCollapse={isCollapse}
    //     icon={<HomeIcon className="h-[18px] w-[18px] text-current" />}
    // />
  );
}

export default function CategoryFilterLeftMenu({
  defaultActivePath = '/',
}: {
  defaultActivePath?: string;
}) {
  const router = useRouter();
  const { categories } = useCategories({
    limit: 100,
  });
  function handleClick(categorySlug: string) {
    router.push({
      pathname: router.pathname,
      ...(categorySlug !== defaultActivePath && {
        query: {
          category: categorySlug,
        },
      }),
    });
  }
  function handleFree() {
    router.push({
      pathname: router.pathname,
      query: {
        price: '0,0',
      },
    });
  }
  const { t } = useTranslation('common');
  return (
    <aside className="fixed bottom-0 z-20 hidden h-full flex-col justify-between overflow-y-auto border-r border-light-400 bg-light-100 pt-[82px] text-dark-900 dark:border-0 dark:bg-dark-200 sm:flex xl:w-60">
      <Scrollbar className="relative h-full w-full">
        <div className="flex h-full w-full flex-col">
          <nav className="flex flex-col">
            <CategoryItem
              categoryName={t('text-category-all')}
              isActive={defaultActivePath === router.asPath}
              onClick={() => handleClick(defaultActivePath)}
              key={`${defaultActivePath}-all`}
            />
            <CategoryItem
              categoryName={t('text-free')}
              isActive={Boolean(router.query.price)}
              onClick={handleFree}
              key={`${defaultActivePath}-free`}
            />
            {categories
              .filter((category) => category.slug.toLowerCase() !== 'free')
              .map((category) => (
                <CategoryItem
                  key={category.id}
                  categoryName={category.name}
                  isActive={category.slug === router.query.category}
                  onClick={() => handleClick(category.slug)}
                />
              ))}
          </nav>
        </div>
      </Scrollbar>
    </aside>
  );
}

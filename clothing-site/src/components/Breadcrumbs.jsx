import { Link, useLocation } from 'react-router-dom';

const LABELS = {
  shop: 'Shop',
  product: 'Product',
  cart: 'Cart',
  admin: 'Admin',
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  const crumbs = [{ path: '/', label: 'Home' }];

  let pathAcc = '';
  for (let i = 0; i < parts.length; i++) {
    pathAcc += `/${parts[i]}`;
    const isLast = i === parts.length - 1;
    const label = LABELS[parts[i]] || (isLast ? decodeURIComponent(parts[i]) : parts[i]);
    crumbs.push({ path: pathAcc, label });
  }

  if (crumbs.length <= 1) return null;

  return (
    <nav className="text-sm text-gray-600 dark:text-gray-300" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center">
              {isLast ? (
                <span className="font-medium text-gray-900 dark:text-gray-100">{c.label}</span>
              ) : (
                <Link className="hover:underline" to={c.path}>{c.label}</Link>
              )}
              {!isLast && <span className="mx-2 text-gray-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

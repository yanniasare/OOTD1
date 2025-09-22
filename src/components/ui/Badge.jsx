export default function Badge({ children, color = 'gray', className = '' }) {
  const colors = {
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    brand: 'bg-black text-white dark:bg-white dark:text-black',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${colors[color] || colors.gray} ${className}`}>{children}</span>;
}

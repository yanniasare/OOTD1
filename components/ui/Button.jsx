export default function Button({ as: ComponentTag = 'button', variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  const styles = {
    primary: 'bg-black text-white hover:bg-gray-900 focus:ring-black',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
  };
  const cls = `${base} ${styles[variant] ?? styles.primary} ${className}`;
  return <ComponentTag className={cls} {...props} />;
}

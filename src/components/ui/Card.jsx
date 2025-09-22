export function Card({ className = '', ...props }) {
  return <div className={`border rounded-lg bg-white shadow-card ${className}`} {...props} />;
}

export function CardMedia({ className = '', ...props }) {
  return <div className={`overflow-hidden ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }) {
  return <div className={`p-4 ${className}`} {...props} />;
}

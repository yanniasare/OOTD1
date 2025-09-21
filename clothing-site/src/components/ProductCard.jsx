import { Link } from 'react-router-dom';
import Button from './ui/Button.jsx';
import { Card, CardContent, CardMedia } from './ui/Card.jsx';
import Badge from './ui/Badge.jsx';

export default function ProductCard({ product }) {
  return (
    <Card className="group rounded-xl border border-gray-200/70 dark:border-gray-800/70 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300/80 dark:hover:border-gray-700/80">
      <Link to={`/product/${product.id}`}>
        <CardMedia>
          <img loading="lazy" src={product.image} alt={product.name} className="w-full h-56 object-cover rounded-t-xl transition-transform duration-300 ease-out group-hover:scale-[1.05]" />
        </CardMedia>
      </Link>
      <CardContent>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold line-clamp-1 transition-colors group-hover:text-black dark:group-hover:text-white">
            {product.name}
          </h3>
          <Badge color="gray" className="ml-2">{product.category}</Badge>
        </div>
        <p className="text-gray-900 dark:text-gray-100 font-semibold mt-1">GHC {product.price.toFixed(2)}</p>
        <div className="mt-3">
          <Link to={`/product/${product.id}`}>
            <Button className="group/btn">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

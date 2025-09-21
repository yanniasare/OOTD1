import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products }) {
  if (!products?.length) {
    return <p className="text-gray-600">No products found.</p>;
  }
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

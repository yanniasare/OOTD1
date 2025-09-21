import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-gray-600">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="inline-block mt-6 px-4 py-2 bg-black text-white rounded-md">Go Home</Link>
    </div>
  );
}

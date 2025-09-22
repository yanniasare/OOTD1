import { useToast } from '../context/ToastContext.jsx';

export default function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-[240px] max-w-sm rounded-md shadow-card px-4 py-3 text-sm flex items-start gap-3 bg-white border ${
            t.type === 'success' ? 'border-green-200' : t.type === 'error' ? 'border-red-200' : 'border-gray-200'
          }`}
        >
          <div className={`mt-0.5 ${t.type === 'success' ? 'text-green-600' : t.type === 'error' ? 'text-red-600' : 'text-gray-600'}`}>●</div>
          <div className="flex-1 text-gray-900">{t.message}</div>
          <button className="text-gray-500 hover:text-black" onClick={() => dismiss(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}

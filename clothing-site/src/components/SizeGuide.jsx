export default function SizeGuide({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Size Guide</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            Sizes are standard US sizing. If between sizes, we recommend sizing up for comfort.
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="font-medium">Size</div>
            <div className="font-medium">Bust</div>
            <div className="font-medium">Waist</div>
            <div className="font-medium">Hips</div>
            {[
              ['XS', '31-32"', '24-25"', '34-35"'],
              ['S', '33-34"', '26-27"', '36-37"'],
              ['M', '35-36"', '28-29"', '38-39"'],
              ['L', '37-39"', '30-32"', '40-42"'],
              ['XL', '40-42"', '33-35"', '43-45"'],
            ].map((row) => (
              <>
                {row.map((cell, i) => (
                  <div key={row[0] + i} className="py-1 border-b last:border-b-0">{cell}</div>
                ))}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

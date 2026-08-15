'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TrackOrder() {
  const [orderRef, setOrderRef] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_ref', orderRef.trim())
      .single();

    setLoading(false);

    if (error || !data) {
      setError('Order not found. Please check your reference number.');
    } else {
      setOrder(data);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-md border">
      <h1 className="text-xl font-bold mb-4 text-center">Track Your Order</h1>

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Order Reference</label>
          <input
            type="text"
            required
            placeholder="e.g. CH-172345678"
            value={orderRef}
            onChange={(e) => setOrderRef(e.target.value)}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track Status'}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

      {order && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-2 border">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                order.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : order.status === 'paid'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {order.status}
            </span>
          </div>

          <p className="text-sm"><strong>Platform:</strong> {order.app_name}</p>
          <p className="text-sm"><strong>Account ID:</strong> {order.account_id}</p>
          <p className="text-sm"><strong>Coins:</strong> {order.coin_amount?.toLocaleString()}</p>
          <p className="text-sm"><strong>Amount Paid:</strong> ₦{order.amount_paid?.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">
            Date: {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
                }

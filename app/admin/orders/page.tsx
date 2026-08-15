'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update status (e.g. mark as completed)
  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      fetchOrders(); // Refresh table
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Order Management</h1>
        <button
          onClick={fetchOrders}
          className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm font-semibold"
        >
          Refresh Orders
        </button>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3">Ref</th>
                <th className="p-3">App</th>
                <th className="p-3">Target ID</th>
                <th className="p-3">Coins</th>
                <th className="p-3">Paid</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">{o.order_ref}</td>
                  <td className="p-3 font-medium">{o.app_name}</td>
                  <td className="p-3 font-bold text-blue-600">{o.account_id}</td>
                  <td className="p-3">{o.coin_amount?.toLocaleString()}</td>
                  <td className="p-3">₦{o.amount_paid?.toLocaleString()}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        o.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {o.status !== 'completed' && (
                      <button
                        onClick={() => updateStatus(o.id, 'completed')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-700"
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

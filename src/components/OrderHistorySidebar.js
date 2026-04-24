import React, { useState, useEffect } from 'react';

const sampleOrderHistory = [
  {
    orderId: 1,
    customerId: 101,
    tableNumber: 5,
    createdAt: "2025-09-21 12:30",
    paymentMethod: "Online",
    items: [
      { orderItemId: 1, itemId: 101, quantity: 2, priceAtOrder: 12.99 },
      { orderItemId: 2, itemId: 102, quantity: 1, priceAtOrder: 8.99 }
    ]
  },
  {
    orderId: 2,
    customerId: 102,
    tableNumber: 2,
    createdAt: "2025-09-23 13:15",
    paymentMethod: "Online",
    items: [
      { orderItemId: 3, itemId: 103, quantity: 3, priceAtOrder: 6.99 }
    ]
  },
  {
    orderId: 3,
    customerId: 103,
    tableNumber: 4,
    createdAt: "2025-10-02 13:20",
    paymentMethod: "Cash",
    items: [
      { orderItemId: 4, itemId: 104, quantity: 1, priceAtOrder: 5.99 },
      { orderItemId: 5, itemId: 108, quantity: 4, priceAtOrder: 5.99 }
    ]
  }
];

const OrderHistorySidebar = () => {
  const [orderHistory] = useState(sampleOrderHistory);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState(sampleOrderHistory);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsOrderId, setDetailsOrderId] = useState(null);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredOrders(orderHistory);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = orderHistory.filter(order => {
      const orderIdMatch = order.orderId.toString().includes(lowerQuery);
      const paymentMatch = order.paymentMethod.toLowerCase().includes(lowerQuery);
      const dateMatch = order.createdAt.toLowerCase().includes(lowerQuery);
      return orderIdMatch || paymentMatch || dateMatch;
    });
    setFilteredOrders(filtered);
  }, [searchQuery, orderHistory]);

  const viewDetails = (orderId) => {
    setDetailsOrderId(orderId);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setDetailsOrderId(null);
  };

  const detailsOrder = orderHistory.find(o => o.orderId === detailsOrderId) || null;
  const detailsItems = detailsOrder ? detailsOrder.items : [];

  return (
    <div className="p-4 bg-white rounded-lg shadow mt-4 max-h-[70vh] overflow-auto">
      <h3 className="text-lg font-semibold mb-2">Order History</h3>
      <input
        type="text"
        placeholder="Search by Order ID, Payment, or Date"
        className="w-full mb-3 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase">Order ID</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase">Customer ID</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase">Total Amount</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase">Table Number</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase">Created At</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase">Payment Method</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">No completed orders found.</td>
              </tr>
            ) : (
              filteredOrders.map(order => {
                const totalAmount = order.items.reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0);
                return (
                  <tr key={order.orderId} className="hover:bg-gray-100 cursor-default">
                    <td className="px-3 py-2">{order.orderId}</td>
                    <td className="px-3 py-2">{order.customerId}</td>
                    <td className="px-3 py-2">₹{totalAmount.toFixed(2)}</td>
                    <td className="px-3 py-2">{order.tableNumber}</td>
                    <td className="px-3 py-2">{order.createdAt}</td>
                    <td className="px-3 py-2">{order.paymentMethod}</td>
                    <td className="px-3 py-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 font-semibold"
                        onClick={() => viewDetails(order.orderId)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showDetailsModal && detailsOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-auto max-h-[80vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Order Details - ID {detailsOrder.orderId}</h3>
              <button
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">Order Item ID</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">Order ID</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">Item ID</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">Quantity</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">Price at Order Time</th>
                  </tr>
                </thead>
                <tbody>
                  {detailsItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-400">No items in this order.</td>
                    </tr>
                  ) : (
                    detailsItems.map((item, idx) => (
                      <tr key={item.orderItemId || idx} className="hover:bg-gray-100">
                        <td className="px-4 py-2">{item.orderItemId || '-'}</td>
                        <td className="px-4 py-2">{detailsOrder.orderId}</td>
                        <td className="px-4 py-2">{item.itemId}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">₹{item.priceAtOrder.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistorySidebar;

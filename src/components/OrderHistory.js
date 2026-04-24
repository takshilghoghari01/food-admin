import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsOrderId, setDetailsOrderId] = useState(null);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const response = await axios.get(
  "/api/admin/orders/status/completed",
  { withCredentials: true }
);
        setOrderHistory(response.data);
        setFilteredOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch completed orders");
        setLoading(false);
      }
    };
    fetchCompletedOrders();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredOrders(orderHistory);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = orderHistory.filter((order) => {
      const orderIdMatch = order.orderId.toString().includes(lowerQuery);
      const paymentMatch = order.paymentMethod
        .toLowerCase()
        .includes(lowerQuery);
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

  const detailsOrder =
    orderHistory.find((o) => o.orderId === detailsOrderId) || null;
  const detailsItems = detailsOrder ? detailsOrder.items : [];

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center">
          <h1 className="text-xl font-semibold">
            Orders Panel - Order History
          </h1>
        </header>
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-gray-500">Loading completed orders...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center">
          <h1 className="text-xl font-semibold">
            Orders Panel - Order History
          </h1>
        </header>
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-red-500">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center">
        <h1 className="text-xl font-semibold">Orders Panel - Order History</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">
        <div>
          <input
            type="text"
            placeholder="Search by Order ID, Payment Method, or Date (YYYY-MM-DD)"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <section>
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Completed Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase">
                      Table Number
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-4 text-gray-400"
                      >
                        No completed orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const subtotal = order.items.reduce(
                        (sum, i) => sum + i.priceAtOrder * i.quantity,
                        0
                      );
                      const totalAmount = subtotal * 1.05;
                      const averageRating = order.overallRating
                        ? order.overallRating.toFixed(1)
                        : "N/A";
                      return (
                        <tr
                          key={order.orderId}
                          className="hover:bg-gray-100 cursor-default"
                        >
                          <td className="px-6 py-3">{order.orderId}</td>
                          <td className="px-6 py-3">
                            {order.customerName || "N/A"}
                          </td>
                          <td className="px-6 py-3">
                            ₹{totalAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-3">{order.tableNumber}</td>
                          <td className="px-6 py-3">{averageRating}</td>
                          <td className="px-6 py-3">
                            {new Date(order.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-3">{order.paymentMethod}</td>
                          <td className="px-6 py-3">
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
          </div>
        </section>

        {showDetailsModal && detailsOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-auto max-h-[80vh]">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Order Details - ID {detailsOrder.orderId}
                </h3>
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
                      <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">
                        Order Item ID
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">
                        Order ID
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">
                        Item ID
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">
                        Price at Order Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailsItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-4 text-gray-400"
                        >
                          No items in this order.
                        </td>
                      </tr>
                    ) : (
                      detailsItems.map((item, idx) => (
                        <tr
                          key={item.orderItemId || idx}
                          className="hover:bg-gray-100"
                        >
                          <td className="px-4 py-2">
                            {item.orderItemId || "-"}
                          </td>
                          <td className="px-4 py-2">{detailsOrder.orderId}</td>
                          <td className="px-4 py-2">
                            {item.itemId?._id || item.itemId || "-"}
                          </td>
                          <td className="px-4 py-2">{item.quantity}</td>
                          <td className="px-4 py-2">
                            ₹{item.priceAtOrder.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;

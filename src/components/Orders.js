import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderConfirmationModal from "./OrderConfirmationModal";

const Orders = () => {
  const [cashOrders, setCashOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [processingOrders, setProcessingOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`/api/admin/orders`, {
  withCredentials: true
})
      const orders = response.data;
      const cash = orders.filter((o) => o.status === "cash-pending");
      const pending = orders.filter((o) => o.status === "pending");
      const processing = orders.filter((o) => o.status === "processing");
      setCashOrders(cash);
      setPendingOrders(pending);
      setProcessingOrders(processing);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const doneCashOrder = async (id) => {
    const originalCash = [...cashOrders];
    const originalPending = [...pendingOrders];
    try {
      await axios.put(
  `/api/admin/orders/${id}/status`,
  {
    status: "processing", // ❌ WRONG
  },
     {
    withCredentials: true, // 🔥 VERY IMPORTANT (sessions)
  });
      setCashOrders(cashOrders.filter((o) => o._id !== id));
      const updatedOrder = {
        ...cashOrders.find((o) => o._id === id),
        status: "pending",
      };
      setPendingOrders([...pendingOrders, updatedOrder]);
      fetchOrders(); // Refetch to ensure consistency
    } catch (err) {
      console.error("Error confirming cash order:", err);
      setCashOrders(originalCash);
      setPendingOrders(originalPending);
      alert("Failed to confirm cash order. Please try again.");
    }
  };

  const startProcessing = async (id) => {
    const originalPending = [...pendingOrders];
    const originalProcessing = [...processingOrders];
    try {
      await axios.put(`/api/admin/orders/${id}/status`, {
        status: "processing",
      },
      {
    withCredentials: true,
  }
    );
      setPendingOrders(pendingOrders.filter((o) => o._id !== id));
      const updatedOrder = {
        ...pendingOrders.find((o) => o._id === id),
        status: "processing",
      };
      setProcessingOrders([...processingOrders, updatedOrder]);
      fetchOrders();
    } catch (err) {
      console.error("Error starting processing:", err);
      // Revert state on error
      setPendingOrders(originalPending);
      setProcessingOrders(originalProcessing);
      alert("Failed to start processing. Please try again.");
    }
  };

const completeOrder = async (id) => {
  const originalProcessing = [...processingOrders];
  try {
    await axios.put(
      `/api/admin/orders/${id}/status`,
      {
        status: "completed", // ✅ FIXED
      },
      {
        withCredentials: true,
      }
    );

    setProcessingOrders(processingOrders.filter((o) => o._id !== id));
    fetchOrders();
  } catch (err) {
    console.error("Error completing order:", err);
    setProcessingOrders(originalProcessing);
    alert("Failed to complete order. Please try again.");
  }
};
  const handleRowClick = (order, e) => {
    if (e.target.closest("button")) return; // Don't trigger on buttons
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const closeDetails = () => {
  setShowDetails(false);
  setSelectedOrder(null);
};

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-lg sm:text-xl font-semibold">Orders Panel</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Test Confirmation Modal
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 space-y-6 sm:space-y-8">
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Cash Orders</h2>
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table Number
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cashOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-400">
                      No cash orders.
                    </td>
                  </tr>
                ) : (
                  cashOrders.map((order) => {
                    const total = order.items.reduce(
                      (sum, item) => sum + item.quantity * item.priceAtOrder,
                      0
                    );
                    return (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={(e) => handleRowClick(order, e)}
                      >
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {order.orderId}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {order.customerName || "Unknown"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {order.tableNumber}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          ₹{total.toFixed(2)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          <button
                            className="bg-yellow-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-yellow-700 text-xs sm:text-sm w-full sm:w-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              doneCashOrder(order._id);
                            }}
                          >
                            Done
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Pending Orders</h2>
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item ID
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table Number
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-400">
                      No pending orders.
                    </td>
                  </tr>
                ) : (
                  pendingOrders.flatMap((order) =>
                    order.items.map((item, index) => (
                      <tr
                        key={`${order._id}-${item.itemId || index}`}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={(e) => handleRowClick(order, e)}
                      >
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {order.orderId}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {item.itemId?._id || item.itemId || "-"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {item.itemName || "Unknown"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {order.customerName || "Unknown"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {order.tableNumber}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          <button
                            className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-blue-700 text-xs sm:text-sm w-full sm:w-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              startProcessing(order._id);
                            }}
                          >
                            Start Processing
                          </button>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Processing Orders
          </h2>
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item ID
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table Number
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processingOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-400">
                      No orders in processing.
                    </td>
                  </tr>
                ) : (
                  processingOrders.flatMap((order) =>
                    order.items.map((item, index) => (
                      <tr
                        key={`${order._id}-${item.itemId || index}`}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={(e) => handleRowClick(order, e)}
                      >
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {order.orderId}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {item.itemId?._id || item.itemId || "-"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {item.itemName || "Unknown"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {order.customerName || "Unknown"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {order.tableNumber}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          <button
                            className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-green-700 text-xs sm:text-sm w-full sm:w-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              completeOrder(order._id);
                            }}
                          >
                            Complete
                          </button>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && closeDetails()}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Order Details - ID: {selectedOrder?.orderId}
              </h3>
              <button
                onClick={closeDetails}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Item ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedOrder?.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        {item.itemId?._id || item.itemId || "-"}
                      </td>
                      <td className="px-4 py-2">{selectedOrder.orderId}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">
                        ₹{item.priceAtOrder.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <OrderConfirmationModal
          order={{
            orderId: "TEST123",
            customerName: "Test Customer",
            tableNumber: 1,
            items: [{ itemName: "Test Item", quantity: 1, priceAtOrder: 10.0 }],
          }}
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            alert("Order confirmed!");
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Orders;

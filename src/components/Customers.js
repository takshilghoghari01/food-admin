import React, { useState, useEffect } from "react";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [historyCustomer, setHistoryCustomer] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "/api/admin/customers"
      );
      setCustomers(response.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "/api/admin/orders"
      );
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchOrders();
  }, []);

  const filteredCustomers = customers.filter((cust) => {
    const val = searchValue.trim().toLowerCase();
    if (!val) return true;
    return (
      cust._id.toString().includes(val) ||
      cust.username.toLowerCase().includes(val) ||
      cust.phone.includes(val)
    );
  });

  const renderCustomersTable = () => {
    if (filteredCustomers.length === 0) {
      return (
        <div className="col-span-5 text-center py-8 text-gray-400">
          No customers found.
        </div>
      );
    }
    return filteredCustomers.map((cust) => (
      <div
        key={cust._id}
        className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow sm:grid sm:grid-cols-5 sm:gap-4 sm:p-6 sm:mb-0 sm:border-0 sm:hover:bg-gray-50"
      >
        <div className="sm:border-r sm:pr-4 mb-2 sm:mb-0">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            ID
          </label>
          <p className="text-sm font-medium text-gray-900 truncate">
            {cust._id}
          </p>
        </div>
        <div className="sm:border-r sm:pr-4 mb-2 sm:mb-0">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Name
          </label>
          <p className="text-sm font-medium text-gray-900">{cust.username}</p>
        </div>
        <div className="sm:border-r sm:pr-4 mb-2 sm:mb-0">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Phone Number
          </label>
          <p className="text-sm text-gray-900">{cust.phone}</p>
        </div>
        <div className="sm:border-r sm:pr-4 mb-2 sm:mb-0">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Rating
          </label>
          <p className="text-sm text-gray-900">
            {cust.averageRating ? cust.averageRating.toFixed(1) : "0.0"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-self-end">
          <button
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
            onClick={() => viewOrders(cust)}
          >
            View Orders
          </button>
          <button
            className="text-red-600 hover:text-red-900 text-sm font-medium"
            onClick={() => confirmDelete(cust._id)}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const viewOrders = (customer) => {
    setHistoryCustomer(customer);
    setShowOrderHistory(true);
  };

  const confirmDelete = (id) => {
    setDeleteCustomerId(id);
    setShowDeleteModal(true);
  };

  const deleteCustomer = async () => {
    try {
      await axios.delete(
        `/api/admin/customers/${deleteCustomerId}`
      );
      setCustomers(customers.filter((c) => c._id !== deleteCustomerId));
      setShowOrderHistory(false);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  const customerOrders = historyCustomer
    ? orders.filter((o) => o.customerId === historyCustomer._id)
    : [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-lg sm:text-xl font-semibold">Customers Panel</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Customers List
          </h2>
        </div>

        <div className="flex justify-between items-center mb-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => fetchCustomers()}
          >
            Refresh Customers
          </button>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
              placeholder="Search by ID, name, or phone..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <svg
              className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span>ID</span>
              <span>Name</span>
              <span>Phone Number</span>
              <span>Rating</span>
              <span className="text-right sm:text-left">Actions</span>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {renderCustomersTable()}
          </div>
        </div>

        {showOrderHistory && (
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {historyCustomer.username}'s Order History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Item ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Price
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Table Number
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customerOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        {order.orderId}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        {order.items.map((item) => item.itemName).join(", ")}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        {order.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        {order.tableNumber}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        {order.overallRating
                          ? order.overallRating.toFixed(1)
                          : "N/A"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <svg
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                Delete Customer
              </h3>
              <p className="text-gray-500 text-center mb-6 text-sm sm:text-base">
                Are you sure you want to delete this customer? This action
                cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition order-2 sm:order-1"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition order-1 sm:order-2"
                  onClick={deleteCustomer}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;

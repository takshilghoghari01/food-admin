import React, { useState, useEffect } from "react";
import axios from "axios";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          "/api/admin/payments"
        );
        setPayments(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to load payments data");
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 bg-gray-50">
        <header className="mb-6">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
            Payments Panel
          </h1>
        </header>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading payments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 bg-gray-50">
        <header className="mb-6">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
            Payments Panel
          </h1>
        </header>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-lg sm:text-xl font-semibold">Payments Panel</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            All Payments
          </h2>
        </div>

        {payments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-center text-gray-400">No payments found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {payments.map((payment) => (
              <div
                key={payment.paymentId || payment._id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Payment ID: {payment.paymentId}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Customer ID: {payment.customerId}
                  </p>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Order ID:
                      </span>
                      <span className="text-sm text-gray-900">
                        {payment.orderId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Table Number:
                      </span>
                      <span className="text-sm text-gray-900">
                        {payment.tableNumber ?? "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Payment Method:
                    </span>
                    <span className="text-sm text-gray-900">
                      {payment.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Total Amount:
                    </span>
                    <span className="text-sm text-gray-900">
                      ₹{payment.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Tax:
                    </span>
                    <span className="text-sm text-gray-900">
                      ₹{payment.tax?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Date:
                    </span>
                    <span className="text-sm text-gray-900">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Payments;

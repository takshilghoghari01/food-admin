import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [customersChange, setCustomersChange] = useState(0);
  const [ordersChange, setOrdersChange] = useState(0);
  const [revenueChange, setRevenueChange] = useState(0);

  const [searchFilter, setSearchFilter] = useState("");
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularItems, setPopularItems] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsResponse = await axios.get(
          "/api/admin/dashboard/stats"
        );
        const {
          totalCustomers,
          totalOrders,
          totalItems,
          totalRevenue,
          customersChange,
          ordersChange,
          revenueChange,
        } = statsResponse.data;
        setTotalCustomers(totalCustomers);
        setTotalOrders(totalOrders);
        setTotalItems(totalItems);
        setTotalRevenue(totalRevenue);
        setCustomersChange(customersChange);
        setOrdersChange(ordersChange);
        setRevenueChange(revenueChange);

        // Fetch recent orders (assuming orders API provides recent ones)
        const ordersResponse = await axios.get(
          "/api/admin/orders?limit=4"
        );
        setRecentOrders(ordersResponse.data.slice(0, 4));

        // Fetch popular items (assuming menu-items API provides popular ones)
        const itemsResponse = await axios.get(
          "/api/admin/menu-items?sort=rating&limit=3"
        );
        setPopularItems(itemsResponse.data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredPopularItems = popularItems.filter((item) =>
    item.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="flex-1 px-4 md:px-11 py-9 overflow-y-auto bg-gradient-to-br from-custom-gray to-custom-blue">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-9 gap-4">
        <input
          type="search"
          placeholder="Search menu or items..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full sm:w-64 px-4 py-2.5 rounded-full border border-gray-300 outline-none text-base"
        />
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7 mb-11">
        <div className="bg-gradient-to-r from-white via-gray-50 to-gray-100 p-6 rounded-xl shadow-lg relative text-center border border-gray-200 transition-shadow duration-300 hover:shadow-xl hover:shadow-green-500/20 hover:border-green-400 hover:cursor-pointer">
          <h2 className="font-semibold text-sm mb-2 text-gray-600 uppercase tracking-wide">
            Total Menu Items
          </h2>
          <p
            className="font-black text-3xl m-0 mb-2 text-slate-900"
            id="totalItems"
          >
            {totalItems.toLocaleString("en-US")}
          </p>
          <span className="absolute top-3 right-4.5 opacity-10 text-4xl pointer-events-none">
            🍽️
          </span>
        </div>
        <div className="bg-gradient-to-r from-white via-gray-50 to-gray-100 p-6 rounded-xl shadow-lg relative text-center border border-gray-200 transition-shadow duration-300 hover:shadow-xl hover:shadow-green-500/20 hover:border-green-400 hover:cursor-pointer">
          <h2 className="font-semibold text-sm mb-2 text-gray-600 uppercase tracking-wide">
            Total Customers
          </h2>
          <p
            className="font-black text-3xl m-0 mb-2 text-slate-900"
            id="totalCustomers"
          >
            {totalCustomers.toLocaleString("en-US")}
          </p>
          <small className="text-green-500 font-semibold text-xs">
            {customersChange >= 0 ? "↑" : "↓"}{" "}
            {Math.abs(customersChange).toFixed(1)}% from last month
          </small>
          <span className="absolute top-3 right-4.5 opacity-10 text-4xl pointer-events-none">
            👥
          </span>
        </div>
        <div className="bg-gradient-to-r from-white via-gray-50 to-gray-100 p-6 rounded-xl shadow-lg relative text-center border border-gray-200 transition-shadow duration-300 hover:shadow-xl hover:shadow-green-500/20 hover:border-green-400 hover:cursor-pointer">
          <h2 className="font-semibold text-sm mb-2 text-gray-600 uppercase tracking-wide">
            Total Orders
          </h2>
          <p
            className="font-black text-3xl m-0 mb-2 text-slate-900"
            id="totalOrders"
          >
            {totalOrders.toLocaleString("en-US")}
          </p>
          <small className="text-green-500 font-semibold text-xs">
            {ordersChange >= 0 ? "↑" : "↓"} {Math.abs(ordersChange).toFixed(1)}%
            from last month
          </small>
          <span className="absolute top-3 right-4.5 opacity-10 text-4xl pointer-events-none">
            🛒
          </span>
        </div>
        <div className="bg-gradient-to-r from-white via-gray-50 to-gray-100 p-6 rounded-xl shadow-lg relative text-center border border-gray-200 transition-shadow duration-300 hover:shadow-xl hover:shadow-green-500/20 hover:border-green-400 hover:cursor-pointer">
          <h2 className="font-semibold text-sm mb-2 text-gray-600 uppercase tracking-wide">
            Total Revenue
          </h2>
          <p
            className="font-black text-3xl m-0 mb-2 text-slate-900"
            id="totalRevenue"
          >
            ₹
            {totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <small className="text-green-500 font-semibold text-xs">
            {revenueChange >= 0 ? "↑" : "↓"}{" "}
            {Math.abs(revenueChange).toFixed(1)}% from last month
          </small>
          <span className="absolute top-3 right-4.5 opacity-10 text-4xl pointer-events-none">
            💰
          </span>
        </div>
      </section>
      <section className="flex flex-col lg:flex-row gap-4 lg:gap-11">
        <div className="bg-white rounded-xl p-6 shadow-md flex-1 min-w-0 border border-gray-200">
          <h3 className="font-black text-xl mb-4.5 text-slate-800">
            Recent Orders
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-200">
                    Order ID
                  </th>
                  <th className="p-3 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-200">
                    Customer
                  </th>
                  <th className="p-3 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-200">
                    Amount
                  </th>
                  <th className="p-3 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-200">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-400">
                      No recent orders
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="p-3 text-left text-sm border-b border-gray-200 text-gray-700 font-semibold">
                        {order.orderId}
                      </td>
                      <td className="p-3 text-left text-sm border-b border-gray-200 text-gray-700 font-semibold">
                        {order.customerName || "Unknown"}
                      </td>
                      <td className="p-3 text-left text-sm border-b border-gray-200 text-gray-700 font-semibold">
                        ₹{order.totalAmount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="p-3 text-left text-sm border-b border-gray-200 text-gray-700 font-semibold">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md flex-1 min-w-0 border border-gray-200">
          <h3 className="font-black text-xl mb-4.5 text-slate-800">
            Popular Items
          </h3>
          <ul className="list-none m-0 p-0">
            {filteredPopularItems.length === 0 ? (
              <li className="text-center py-4 text-gray-400">
                No popular items
              </li>
            ) : (
              filteredPopularItems.map((item) => (
                <li
                  key={item._id}
                  className="flex gap-3.5 mb-4 items-center border-b border-gray-200 pb-4"
                >
                  <img
                    src={item.image || "https://placehold.co/54x54"}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <strong className="font-bold text-lg text-gray-800 block truncate">
                      {item.name}
                    </strong>
                    <p className="m-0 text-sm text-indigo-500 mb-1">
                      Rating: {item.rating || "N/A"}
                    </p>
                    <small className="text-gray-500">
                      ⭐ {item.rating || 0} reviews
                    </small>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

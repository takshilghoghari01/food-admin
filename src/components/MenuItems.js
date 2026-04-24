import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const MenuItems = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("categories");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    discount: "",
    availability: true,
    image: "",
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    image: "",
  });
  const [categoryError, setCategoryError] = useState("");
  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const categoryFileInputRef = useRef(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const [menuItemsResponse, categoriesResponse] = await Promise.all([
          axios.get("/api/admin/menu-items"),
          axios.get("/api/admin/categories"),
        ]);
        setFoodItems(menuItemsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error("Error fetching menu items or categories:", err);
      }
    };

    fetchMenuItems();

    // Fetch every 30 seconds to update ratings dynamically
    const interval = setInterval(fetchMenuItems, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredItems = foodItems.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) || item._id.toString().includes(q)
    );
  });

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase();
    return cat.name.toLowerCase().includes(q) || cat._id.toString().includes(q);
  });

  const formatCategory = (cat) =>
    cat.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const getImageUrl = (image) => {
    if (image && image.startsWith("uploads/")) {
      return `/${image}`;
    }
    return image;
  };

  const renderRatingStars = (r) => {
    if (!r) return "--";
    let stars = [];
    const full = Math.floor(r);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`inline h-4 w-4 ${
            i <= full ? "text-yellow-500" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24 .588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921 -.755 1.688 -1.54 1.118l-2.8 -2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57 -1.838 -.197 -1.539 -1.118l1.07 -3.292a1 1 0 00-.364 -1.118L2.98 8.72c-.783 -.57 -.38 -1.81 .588 -1.81h3.461a1 1 0 00.951 -.69l1.07 -3.292z" />
        </svg>
      );
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  const openModal = (item = null) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        discount: item.discount || "",
        availability:
          item.availability !== undefined ? item.availability : true,
        image: item.image,
      });
    } else {
      setEditId(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        discount: "",
        availability: true,
        image: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newItem = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      discount: parseInt(formData.discount) || 0,
      availability: formData.availability,
      image: formData.image || "https://placehold.co/200x200",
    };
    try {
      if (editId) {
        await axios.put(
          `/api/admin/menu-items/${editId}`,
          newItem
        );
        setFoodItems(
          foodItems.map((i) =>
            i._id === editId ? { ...newItem, _id: editId } : i
          )
        );
      } else {
        const response = await axios.post(
          "/api/admin/menu-items",
          newItem
        );
        setFoodItems([...foodItems, response.data]);
      }
      closeModal();
    } catch (err) {
      console.error("Error saving menu item:", err);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`/api/admin/menu-items/${id}`);
        setFoodItems(foodItems.filter((i) => i._id !== id));
      } catch (err) {
        console.error("Error deleting menu item:", err);
      }
    }
  };

  const [editCategoryId, setEditCategoryId] = useState(null);

  const openCategoryModal = () => {
    setEditCategoryId(null);
    setCategoryFormData({
      name: "",
      image: "",
    });
    setCategoryImageFile(null);
    setCategoryError("");
    setShowCategoryModal(true);
  };

  const openCategoryEditModal = (category) => {
    setEditCategoryId(category._id);
    setCategoryFormData({
      name: category.name,
      image: getImageUrl(category.image),
    });
    setCategoryImageFile(null);
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setEditCategoryId(null);
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`/api/admin/categories/${id}`);
        setCategories(categories.filter((cat) => cat._id !== id));
      } catch (err) {
        console.error("Error deleting category:", err);
      }
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCategoryError("");
    try {
      const formData = new FormData();
      formData.append("name", categoryFormData.name);
      if (categoryImageFile) {
        formData.append("image", categoryImageFile);
      } else if (
        categoryFormData.image &&
        !categoryFormData.image.startsWith("data:")
      ) {
        // If editing and image is a URL, don't append
      } else {
        // Default placeholder, but since it's file upload, perhaps not needed
      }
      if (editCategoryId) {
        await axios.put(
          `/api/admin/categories/${editCategoryId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // Refetch categories
        const categoriesResponse = await axios.get(
          "/api/admin/categories"
        );
        setCategories(categoriesResponse.data);
      } else {
        await axios.post(
          "/api/admin/categories",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // Refetch categories
        const categoriesResponse = await axios.get(
          "/api/admin/categories"
        );
        setCategories(categoriesResponse.data);
      }
      closeCategoryModal();
    } catch (err) {
      console.error("Error saving category:", err);
      setCategoryError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-lg sm:text-xl font-semibold">
          Menu Items Management
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition text-sm sm:text-base"
            onClick={() => openModal()}
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add New Item
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition text-sm sm:text-base"
            onClick={() => openCategoryModal()}
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add New Category
          </button>
        </div>
      </header>

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-y-auto max-h-[90vh]">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {editCategoryId ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
                onClick={closeCategoryModal}
              >
                &times;
              </button>
            </div>
            <form
              className="p-4 sm:p-6 space-y-4"
              onSubmit={handleCategorySubmit}
            >
              {categoryError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {categoryError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={categoryFormData.name}
                  onChange={(e) =>
                    setCategoryFormData({
                      ...categoryFormData,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image Preview
                </label>
                <img
                  src={categoryFormData.image || "https://placehold.co/200x200"}
                  alt="Preview"
                  className="w-32 h-32 sm:w-48 sm:h-48 rounded-lg object-cover border border-gray-300 mb-2 mx-auto sm:mx-0"
                />
                <button
                  type="button"
                  className="mb-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 w-full sm:w-auto"
                  onClick={() => categoryFileInputRef.current.click()}
                >
                  Select Image
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={categoryFileInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setCategoryImageFile(file);
                      const reader = new FileReader();
                      reader.onload = (ev) =>
                        setCategoryFormData({
                          ...categoryFormData,
                          image: ev.target.result,
                        });
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 order-2 sm:order-1"
                  onClick={closeCategoryModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 order-1 sm:order-2"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex flex-wrap px-4 py-2 border-b border-gray-200 gap-2">
            <button
              className={`px-3 sm:px-4 py-2 rounded-md font-semibold text-sm sm:text-base ${
                activeTab === "categories"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("categories")}
            >
              Categories
            </button>
            <button
              className={`px-3 sm:px-4 py-2 rounded-md font-semibold text-sm sm:text-base ${
                activeTab === "items"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("items")}
            >
              Items
            </button>
          </div>

          {activeTab === "categories" ? (
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCategories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {cat._id}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <img
                          src={
                            getImageUrl(cat.image) ||
                            "https://placehold.co/64x64"
                          }
                          alt={cat.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCategory(cat.name)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => openCategoryEditModal(cat)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => deleteCategory(cat._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {item._id}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {formatCategory(item.category)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ₹{item.price.toFixed(2)}
                        </div>
                        {item.discount > 0 && (
                          <div className="text-sm text-green-600">
                            ₹
                            {(
                              item.price -
                              (item.price * item.discount) / 100
                            ).toFixed(2)}{" "}
                            <span className="text-xs">
                              ({item.discount}% off)
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {renderRatingStars(item.rating)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {item.discount > 0 ? (
                          <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                            {item.discount}%
                          </span>
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                            item.availability
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <svg
                            className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 ${
                              item.availability
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {item.availability ? (
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                                clipRule="evenodd"
                              />
                            ) : (
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2a1 1 0 11-2 0zm0 4a1 1 0 112 0 1 1 0 01-2 0z"
                                clipRule="evenodd"
                              />
                            )}
                          </svg>
                          {item.availability ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => openModal(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => deleteItem(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {editId ? "Edit Food Item" : "Add New Food Item"}
              </h3>
              <button
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <form className="p-4 sm:p-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {formatCategory(cat.name)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center space-x-4 mt-2 sm:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {formData.availability ? "Available" : "Unavailable"}
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availability}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          availability: !formData.availability,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-not-checked:bg-red-500 relative transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full border border-gray-300 peer-checked:left-6 peer-checked:border-green-500 peer-not-checked:border-red-500 transition-all"></div>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Image Preview
                </label>
                <img
                  src={formData.image || "https://placehold.co/200x200"}
                  alt="Preview"
                  className="w-32 h-32 sm:w-48 sm:h-48 rounded-lg object-cover border border-gray-300 mb-2 mx-auto sm:mx-0"
                />
                <button
                  type="button"
                  className="mb-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 w-full sm:w-auto"
                  onClick={() => fileInputRef.current.click()}
                >
                  Select Image
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) =>
                        setFormData({ ...formData, image: ev.target.result });
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 order-2 sm:order-1"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 order-1 sm:order-2"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItems;

import React, { useState, useEffect } from "react";
import api, { getErrorMessage } from "../api";

function StockOut() {
  const [spareParts, setSpareParts] = useState([]);
  const [stockOutList, setStockOutList] = useState([]);

  const [formData, setFormData] = useState({
    stockOutQuantity: "",
    stockOutUnitPrice: "",
    stockOutTotalPrice: "",
    stockOutDate: "",
    sparePart: ""
  });

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSpareParts();
    getStockOut();
  }, []);

  // Fetch spare parts
  const getSpareParts = async () => {
    const res = await api.get("/sparepart");
    setSpareParts(res.data);
  };

  // Fetch stock out list
  const getStockOut = async () => {
    const res = await api.get("/stockout");
    setStockOutList(res.data);
  };

  // Handle input change
  const handleChange = (e) => {
    let updatedData = {
      ...formData,
      [e.target.name]: e.target.value
    };

    // Auto calculate total price
    if (updatedData.stockOutQuantity && updatedData.stockOutUnitPrice) {
      updatedData.stockOutTotalPrice =
        updatedData.stockOutQuantity * updatedData.stockOutUnitPrice;
    }

    setFormData(updatedData);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        // UPDATE
        await api.put(
          `/stockout/${editId}`,
          formData
        );
        alert("Updated successfully!");
        setEditId(null);
      } else {
        // INSERT
        await api.post(
          "/stockout/add",
          formData
        );
        alert("Saved successfully!");
      }

      // reset form
      setFormData({
        stockOutQuantity: "",
        stockOutUnitPrice: "",
        stockOutTotalPrice: "",
        stockOutDate: "",
        sparePart: ""
      });

      getStockOut();

    } catch (err) {
      console.error(err);
      alert("Error saving stock out data: " + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Edit record
  const handleEdit = (item) => {
    setFormData({
      stockOutQuantity: item.stockOutQuantity,
      stockOutUnitPrice: item.stockOutUnitPrice,
      stockOutTotalPrice: item.stockOutTotalPrice,
      stockOutDate: item.stockOutDate?.split("T")[0],
      sparePart: item.sparePart?._id
    });

    setEditId(item._id);
  };

  // Delete record
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await api.delete(`/stockout/${id}`);
        alert("Deleted successfully!");
        getStockOut();
      } catch (err) {
        console.error(err);
        alert("Error deleting record: " + getErrorMessage(err));
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Form Section */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-red-600 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-white">
              {editId ? "Edit Stock Out Entry" : "New Stock Out Entry"}
            </h2>
            <p className="mt-1 text-sm text-red-100">Record outgoing stock for spare parts</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="sparePart" className="block text-sm font-medium text-gray-700">
                  Select Spare Part
                </label>
                <select
                  id="sparePart"
                  name="sparePart"
                  required
                  value={formData.sparePart}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                >
                  <option value="">-- Select Spare Part --</option>
                  {spareParts.map((sp) => (
                    <option key={sp._id} value={sp._id}>
                      {sp.name} - {sp.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="stockOutDate" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="stockOutDate"
                  name="stockOutDate"
                  required
                  value={formData.stockOutDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="stockOutQuantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  id="stockOutQuantity"
                  name="stockOutQuantity"
                  required
                  min="1"
                  value={formData.stockOutQuantity}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label htmlFor="stockOutUnitPrice" className="block text-sm font-medium text-gray-700">
                  Unit Price ($)
                </label>
                <input
                  type="number"
                  id="stockOutUnitPrice"
                  name="stockOutUnitPrice"
                  required
                  min="0"
                  step="0.01"
                  value={formData.stockOutUnitPrice}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Enter unit price"
                />
              </div>
            </div>

            <div>
              <label htmlFor="stockOutTotalPrice" className="block text-sm font-medium text-gray-700">
                Total Price ($)
              </label>
              <input
                type="number"
                id="stockOutTotalPrice"
                name="stockOutTotalPrice"
                value={formData.stockOutTotalPrice}
                readOnly
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
                placeholder="Auto-calculated"
              />
            </div>

            <div className="flex justify-end space-x-3">
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setFormData({
                      stockOutQuantity: "",
                      stockOutUnitPrice: "",
                      stockOutTotalPrice: "",
                      stockOutDate: "",
                      sparePart: ""
                    });
                  }}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : (editId ? "Update Entry" : "Save Entry")}
              </button>
            </div>
          </form>
        </div>

        {/* Records Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Stock Out Records</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spare Part
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockOutList.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.sparePart?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.stockOutQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.stockOutUnitPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.stockOutTotalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.stockOutDate?.split("T")[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockOut;

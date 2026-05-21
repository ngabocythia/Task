import React, { useState, useEffect } from "react";
import api, { getErrorMessage } from "../api";

function StockIn() {
  const [spareParts, setSpareParts] = useState([]);
  const [formData, setFormData] = useState({
    stockInQuantity: "",
    stockInDate: "",
    sparePart: ""
  });
  const [loading, setLoading] = useState(false);

  // Fetch spare parts for dropdown
  useEffect(() => {
    getSpareParts();
  }, []);

  const getSpareParts = async () => {
    try {
      const res = await api.get("/sparepart");
      setSpareParts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/stockin/add", formData);
      alert("Stock In saved successfully!");

      // reset form
      setFormData({
        stockInQuantity: "",
        stockInDate: "",
        sparePart: ""
      });

    } catch (err) {
      console.error(err);
      alert("Error saving stock in data: " + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-green-600 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-white">Stock In Entry</h2>
          <p className="mt-1 text-sm text-green-100">Record incoming stock for spare parts</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="">-- Select Spare Part --</option>
              {spareParts.map((sp) => (
                <option key={sp._id} value={sp._id}>
                  {sp.name} - {sp.category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="stockInQuantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                id="stockInQuantity"
                name="stockInQuantity"
                required
                min="1"
                value={formData.stockInQuantity}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <label htmlFor="stockInDate" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="stockInDate"
                name="stockInDate"
                required
                value={formData.stockInDate}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Record Stock In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StockIn;

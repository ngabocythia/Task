import { useState, useEffect } from "react";
import api, { getErrorMessage } from "../api";

function SparePart() {
  const [spareParts, setSpareParts] = useState([]);
  const [data, setData] = useState({
    name: "",
    category: "",
    quantity: "",
    unitPrice: ""
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = async () => {
    try {
      const res = await api.get("/sparepart");
      setSpareParts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setData({...data, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalPrice = data.quantity * data.unitPrice;

      if (editId) {
        // UPDATE
        await api.put(`/sparepart/${editId}`, {
          ...data,
          totalPrice
        });
        alert("Spare part updated successfully!");
        setEditId(null);
      } else {
        // CREATE
        await api.post("/sparepart/add", {
          ...data,
          totalPrice
        });
        alert("Spare part saved successfully!");
      }

      setData({
        name: "",
        category: "",
        quantity: "",
        unitPrice: ""
      });
      fetchSpareParts();

    } catch (err) {
      alert("Error saving spare part: " + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    });
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this spare part?")) {
      try {
        await api.delete(`/sparepart/${id}`);
        alert("Spare part deleted successfully!");
        fetchSpareParts();
      } catch (err) {
        alert("Error deleting spare part: " + getErrorMessage(err));
      }
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setData({
      name: "",
      category: "",
      quantity: "",
      unitPrice: ""
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Form Section */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-white">
              {editId ? "Edit Spare Part" : "Add New Spare Part"}
            </h2>
            <p className="mt-1 text-sm text-blue-100">
              {editId ? "Update the spare part details" : "Enter the details of the spare part to add to inventory"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Spare Part Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={data.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter spare part name"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  required
                  value={data.category}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter category"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Initial Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  required
                  min="0"
                  value={data.quantity}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">
                  Unit Price ($)
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  id="unitPrice"
                  required
                  min="0"
                  step="0.01"
                  value={data.unitPrice}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter unit price"
                />
              </div>
            </div>

            {data.quantity && data.unitPrice && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  Total Value: <span className="font-semibold text-gray-900">${(data.quantity * data.unitPrice).toFixed(2)}</span>
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              {editId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : (editId ? "Update Spare Part" : "Save Spare Part")}
              </button>
            </div>
          </form>
        </div>

        {/* Spare Parts List */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Spare Parts Inventory</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {spareParts.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.unitPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.totalPrice?.toFixed(2)}
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

export default SparePart;

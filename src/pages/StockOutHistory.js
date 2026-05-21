import React, { useState, useEffect } from "react";
import api from "../api";

function StockOutHistory() {
  const [stockOutHistory, setStockOutHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetchStockOutHistory();
  }, []);

  const fetchStockOutHistory = async () => {
    try {
      const res = await api.get("/stockout");
      setStockOutHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = stockOutHistory.filter(item => {
    const matchesSearch = item.sparePart?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sparePart?.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || item.stockOutDate?.split("T")[0] === filterDate;
    return matchesSearch && matchesDate;
  });

  const totalValue = filteredHistory.reduce((sum, item) => sum + item.stockOutTotalPrice, 0);
  const totalQuantity = filteredHistory.reduce((sum, item) => sum + item.stockOutQuantity, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Stock Out History</h1>
        <p className="mt-2 text-gray-600">Complete history of all stock out transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Total Transactions</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">{filteredHistory.length}</p>
            </div>
            <div className="bg-orange-600 rounded-full p-3">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Total Quantity Out</p>
              <p className="text-3xl font-bold text-red-900 mt-2">{totalQuantity} units</p>
            </div>
            <div className="bg-red-600 rounded-full p-3">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Value</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">${totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-purple-600 rounded-full p-3">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search by Spare Part or Category
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="Search..."
            />
          </div>
          <div>
            <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Date
            </label>
            <input
              type="date"
              id="dateFilter"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
        </div>
        {(searchTerm || filterDate) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterDate("");
              }}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-orange-600 border-b border-orange-200">
          <h3 className="text-lg font-semibold text-white">Stock Out Transactions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spare Part
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    {stockOutHistory.length === 0 ? "No stock out transactions yet" : "No transactions match your filters"}
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.sparePart?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sparePart?.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {item.stockOutQuantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.stockOutUnitPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="font-semibold text-gray-900">
                        ${item.stockOutTotalPrice}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.stockOutDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StockOutHistory;

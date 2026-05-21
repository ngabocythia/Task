import React, { useState, useEffect } from "react";
import api from "../api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalSpareParts: 0,
    totalStockIn: 0,
    totalStockOut: 0,
    totalValue: 0,
    recentTransactions: [],
    lowStockItems: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [sparePartsRes, stockInRes, stockOutRes, reportsRes] = await Promise.all([
        api.get("/sparepart"),
        api.get("/stockin"),
        api.get("/stockout"),
        api.get("/reports/daily-status")
      ]);

      const spareParts = sparePartsRes.data;
      const stockIn = stockInRes.data;
      const stockOut = stockOutRes.data;
      const reports = reportsRes.data;

      // Calculate totals
      const totalStockInQty = stockIn.reduce((sum, item) => sum + item.stockInQuantity, 0);
      const totalStockOutQty = stockOut.reduce((sum, item) => sum + item.stockOutQuantity, 0);
      const totalValue = spareParts.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

      // Find low stock items
      const lowStockItems = reports
        .filter(item => item.remaining <= 10 && item.remaining > 0)
        .slice(0, 5);

      // Get recent transactions
      const allTransactions = [
        ...stockIn.map(item => ({
          type: "Stock In",
          name: item.sparePart?.name || "Unknown",
          quantity: item.stockInQuantity,
          date: item.stockInDate,
          color: "green"
        })),
        ...stockOut.map(item => ({
          type: "Stock Out",
          name: item.sparePart?.name || "Unknown",
          quantity: item.stockOutQuantity,
          date: item.stockOutDate,
          color: "red"
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

      setStats({
        totalSpareParts: spareParts.length,
        totalStockIn: totalStockInQty,
        totalStockOut: totalStockOutQty,
        totalValue: totalValue,
        recentTransactions: allTransactions,
        lowStockItems: lowStockItems
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">Real-time inventory and stock management summary</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Spare Parts */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Spare Parts</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalSpareParts}</p>
            </div>
            <div className="bg-blue-600 rounded-full p-3">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Stock In */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Stock In</p>
              <p className="text-3xl font-bold text-green-900 mt-2">+{stats.totalStockIn}</p>
            </div>
            <div className="bg-green-600 rounded-full p-3">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Stock Out */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Total Stock Out</p>
              <p className="text-3xl font-bold text-red-900 mt-2">-{stats.totalStockOut}</p>
            </div>
            <div className="bg-red-600 rounded-full p-3">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Inventory Value */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Inventory Value</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">${stats.totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-purple-600 rounded-full p-3">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Recent Transactions and Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 border-b border-indigo-200">
            <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          </div>
          <div className="p-6">
            {stats.recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No transactions yet</p>
            ) : (
              <div className="space-y-4">
                {stats.recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${transaction.color === 'green' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.name}</p>
                        <p className="text-xs text-gray-500">{transaction.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.color === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.color === 'green' ? '+' : '-'}{transaction.quantity}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-700 border-b border-orange-200">
            <h3 className="text-lg font-semibold text-white">Low Stock Alert</h3>
          </div>
          <div className="p-6">
            {stats.lowStockItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">All items have healthy stock levels</p>
            ) : (
              <div className="space-y-3">
                {stats.lowStockItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition">
                    <div>
                      <p className="font-medium text-gray-900">{item.spareName}</p>
                      <p className="text-xs text-gray-600">
                        In: {item.totalIn} | Out: {item.totalOut}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800">
                        {item.remaining} left
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

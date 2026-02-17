"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import { hybridDB } from '@/lib/hybrid-db-example';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

/**
 * HYBRID DATABASE EXAMPLE
 *
 * This component demonstrates using BOTH:
 * 1. IndexedDB (Dexie) - Real-time operational data
 * 2. SQLite (SQL.js) - Complex analytics queries
 */
export function HybridReportExample() {
  // ==================== IndexedDB (Dexie) - Real-time ====================
  // These update automatically when data changes (useLiveQuery magic!)

  const pendingCount = useLiveQuery(
    () => db.transactions.where('synced').equals(false).count(),
    []
  );

  const recentTransactions = useLiveQuery(
    () => db.transactions.orderBy('created_at').reverse().limit(5).toArray(),
    []
  );

  const lowStockProducts = useLiveQuery(
    () => db.products.where('stock').below(10).toArray(),
    []
  );

  // ==================== SQLite (SQL.js) - Analytics ====================
  // These are loaded on-demand when user clicks "Generate Report"

  const [isLoadingSQLite, setIsLoadingSQLite] = useState(false);
  const [salesReport, setSalesReport] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [productPerformance, setProductPerformance] = useState<any[]>([]);

  const loadAnalytics = async () => {
    setIsLoadingSQLite(true);

    try {
      console.log('Loading SQL.js (1.5MB) - only loads once...');

      // Lazy load SQL.js and run complex queries
      const [sales, customers, products] = await Promise.all([
        hybridDB.getDailySalesReport('2026-01-01', '2026-12-31'),
        hybridDB.getTopCustomersReport(10),
        hybridDB.getProductPerformanceReport()
      ]);

      setSalesReport(sales);
      setTopCustomers(customers);
      setProductPerformance(products);

      console.log('✅ Analytics loaded');
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoadingSQLite(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ==================== SECTION 1: Real-time Data (IndexedDB) ==================== */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📊 Real-time Dashboard</h2>
        <p className="text-sm text-gray-600 mb-4">
          Powered by <strong>IndexedDB (Dexie)</strong> - Updates automatically, works offline
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pending Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Pending Sync
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingCount ?? 0}</div>
              <p className="text-xs text-gray-500 mt-1">Transactions waiting to sync</p>
            </CardContent>
          </Card>

          {/* Low Stock */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="h-4 w-4" />
                Low Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{lowStockProducts?.length ?? 0}</div>
              <p className="text-xs text-gray-500 mt-1">Products below 10 units</p>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{recentTransactions?.length ?? 0}</div>
              <p className="text-xs text-gray-500 mt-1">Last 5 transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions List */}
        {recentTransactions && recentTransactions.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentTransactions.map(txn => (
                  <div key={txn.uuid} className="flex justify-between items-center text-sm border-b pb-2">
                    <div>
                      <div className="font-medium">{txn.customer_name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(txn.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₱{txn.total.toFixed(2)}</div>
                      <div className={`text-xs ${txn.synced ? 'text-green-600' : 'text-amber-600'}`}>
                        {txn.synced ? '✓ Synced' : '⏳ Pending'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ==================== SECTION 2: Complex Analytics (SQLite) ==================== */}
      <div className="border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">📈 Advanced Analytics</h2>
        <p className="text-sm text-gray-600 mb-4">
          Powered by <strong>SQLite (SQL.js)</strong> - Complex queries with JOINs, aggregations
        </p>

        <Button
          onClick={loadAnalytics}
          disabled={isLoadingSQLite}
          className="mb-4"
        >
          {isLoadingSQLite ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading SQL.js (1.5MB)...
            </>
          ) : (
            'Generate Advanced Reports'
          )}
        </Button>

        {/* Sales Report */}
        {salesReport.length > 0 && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm">Daily Sales Report</CardTitle>
              <p className="text-xs text-gray-500">Complex SQL with GROUP BY and aggregations</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-right py-2">Orders</th>
                      <th className="text-right py-2">Revenue</th>
                      <th className="text-right py-2">Avg Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesReport.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2">{row.date}</td>
                        <td className="text-right">{row.order_count}</td>
                        <td className="text-right font-medium">₱{row.revenue?.toFixed(2)}</td>
                        <td className="text-right">₱{row.avg_order?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Customers */}
        {topCustomers.length > 0 && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Top Customers
              </CardTitle>
              <p className="text-xs text-gray-500">SQL with GROUP BY and HAVING clauses</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topCustomers.map((customer, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b pb-2">
                    <div>
                      <div className="font-medium">{customer.customer_name}</div>
                      <div className="text-xs text-gray-500">
                        {customer.order_count} orders • Avg: ₱{customer.avg_order?.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">₱{customer.total_spent?.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{customer.last_order}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Performance */}
        {productPerformance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="h-4 w-4" />
                Top Products
              </CardTitle>
              <p className="text-xs text-gray-500">Complex JOIN between transactions and items</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Product</th>
                      <th className="text-right py-2">Sold</th>
                      <th className="text-right py-2">Qty</th>
                      <th className="text-right py-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productPerformance.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2">{row.product_name}</td>
                        <td className="text-right">{row.times_sold}x</td>
                        <td className="text-right">{row.total_quantity}</td>
                        <td className="text-right font-medium">₱{row.total_revenue?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Explanation */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-bold mb-2">💡 How This Works:</h3>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>
              <strong>IndexedDB (Dexie)</strong>: Real-time data updates automatically.
              Bundle size: 45KB. Always loaded.
            </li>
            <li>
              <strong>SQLite (SQL.js)</strong>: Complex analytics loaded on-demand.
              Bundle size: 1.5MB. Only loads when you click "Generate Report".
            </li>
            <li>
              <strong>Best of both worlds</strong>: Fast POS operations + powerful analytics!
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState, useEffect } from 'react'
import SalesChart from '../components/charts/SalesCharts.jsx'
import api from '../api/api'
import { useSelector } from 'react-redux'
import { selectSellerProducts } from '../slices/productSlice'
import { Package, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react'

const SellerDashboard = () => {
  const sellerProducts = useSelector(selectSellerProducts)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalSold: 0,
    totalRevenue: 0,
    monthlyData: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const calculateStats = () => {
      try {
        // Calculate totals from products
        let totalProducts = sellerProducts.length
        let totalStock = 0
        let totalSold = 0
        let totalRevenue = 0

        sellerProducts.forEach(product => {
          totalStock += product.stock || 0
          totalSold += product.sold || 0
          totalRevenue += (product.price * (product.sold || 0))
        })

        // Mock monthly sales data (in production, fetch from API)
        const monthlyData = [
          { month: 'Jan', sales: 4000, products: 24 },
          { month: 'Feb', sales: 3000, products: 18 },
          { month: 'Mar', sales: 2000, products: 15 },
          { month: 'Apr', sales: 2780, products: 28 },
          { month: 'May', sales: 1890, products: 12 },
          { month: 'Jun', sales: 2390, products: 22 },
          { month: 'Jul', sales: 3490, products: 35 },
          { month: 'Aug', sales: 4200, products: 42 },
          { month: 'Sep', sales: 2100, products: 19 },
          { month: 'Oct', sales: 2600, products: 25 },
          { month: 'Nov', sales: 3800, products: 38 },
          { month: 'Dec', sales: 5000, products: 50 }
        ]

        setStats({
          totalProducts,
          totalStock,
          totalSold,
          totalRevenue,
          monthlyData
        })
        setLoading(false)
      } catch (error) {
        console.error('Error calculating stats:', error)
        setLoading(false)
      }
    }

    calculateStats()
  }, [sellerProducts])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold text-foreground mb-8">Seller Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products Card */}
        <div className="bg-accent rounded-lg p-6 shadow-md border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/70 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.totalProducts}</p>
            </div>
            <div className="bg-blue-500/20 p-4 rounded-lg">
              <Package className="text-blue-500" size={28} />
            </div>
          </div>
        </div>

        {/* Total Stock Card */}
        <div className="bg-accent rounded-lg p-6 shadow-md border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/70 text-sm font-medium">Total Stock</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.totalStock}</p>
            </div>
            <div className="bg-green-500/20 p-4 rounded-lg">
              <ShoppingCart className="text-green-500" size={28} />
            </div>
          </div>
        </div>

        {/* Total Sold Card */}
        <div className="bg-accent rounded-lg p-6 shadow-md border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/70 text-sm font-medium">Total Sold</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.totalSold}</p>
            </div>
            <div className="bg-purple-500/20 p-4 rounded-lg">
              <TrendingUp className="text-purple-500" size={28} />
            </div>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-accent rounded-lg p-6 shadow-md border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/70 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-foreground mt-2">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-500/20 p-4 rounded-lg">
              <DollarSign className="text-yellow-500" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-accent rounded-lg p-6 shadow-md border border-border">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Monthly Sales Trends</h2>
          <p className="text-foreground/70 text-sm mt-1">Sales performance over the last 12 months</p>
        </div>
        <SalesChart data={stats.monthlyData} />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Highest Month */}
        <div className="bg-accent rounded-lg p-6 shadow-md border border-border">
          <p className="text-foreground/70 text-sm font-medium mb-2">Highest Sales Month</p>
          <p className="text-2xl font-bold text-green-500">
            {stats.monthlyData.length > 0
              ? stats.monthlyData.reduce((max, curr) => curr.sales > max.sales ? curr : max).month
              : 'N/A'}
          </p>
          <p className="text-foreground/70 text-xs mt-2">
            ${stats.monthlyData.length > 0
              ? stats.monthlyData.reduce((max, curr) => curr.sales > max.sales ? curr : max).sales.toLocaleString()
              : '0'}
          </p>
        </div>

        {/* Lowest Month */}
        <div className="bg-accent rounded-lg p-6 shadow-md border border-border">
          <p className="text-foreground/70 text-sm font-medium mb-2">Lowest Sales Month</p>
          <p className="text-2xl font-bold text-red-500">
            {stats.monthlyData.length > 0
              ? stats.monthlyData.reduce((min, curr) => curr.sales < min.sales ? curr : min).month
              : 'N/A'}
          </p>
          <p className="text-foreground/70 text-xs mt-2">
            ${stats.monthlyData.length > 0
              ? stats.monthlyData.reduce((min, curr) => curr.sales < min.sales ? curr : min).sales.toLocaleString()
              : '0'}
          </p>
        </div>

        {/* Average Monthly */}
        <div className="bg-accent rounded-lg p-6 shadow-md border border-border">
          <p className="text-foreground/70 text-sm font-medium mb-2">Average Monthly Sales</p>
          <p className="text-2xl font-bold text-blue-500">
            ${stats.monthlyData.length > 0
              ? Math.round(stats.monthlyData.reduce((sum, curr) => sum + curr.sales, 0) / stats.monthlyData.length).toLocaleString()
              : '0'}
          </p>
          <p className="text-foreground/70 text-xs mt-2">Based on 12 months</p>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard
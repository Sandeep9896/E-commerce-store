import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesChart = ({ data = [] }) => {
  // Default data if none provided
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', sales: 4000, products: 24 },
    { month: 'Feb', sales: 3000, products: 18 },
    { month: 'Mar', sales: 2000, products: 15 },
    { month: 'Apr', sales: 2780, products: 28 },
    { month: 'May', sales: 1890, products: 12 },
    { month: 'Jun', sales: 2390, products: 22 },
    { month: 'Jul', sales: 3490, products: 35 },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Line Chart - Sales Trend */}
      <div className="w-full bg-background/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Sales Trend</h3>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
                name="Sales ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart - Products Sold */}
      <div className="w-full bg-background/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Products Sold</h3>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Legend />
              <Bar 
                dataKey="products" 
                fill="#8b5cf6" 
                name="Products Sold"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;

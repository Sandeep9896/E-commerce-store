import React, { use, useEffect } from "react";
import { Card } from "../components/ui/card";
import api from "../api/api";
import { Check, Package, Clock, MapPin, CreditCard, ArrowRight, ShoppingBag, CheckCircle, XCircle, Truck, Search } from "lucide-react";



const RecentOrderPage = () => {
    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState("");

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const response = await api.post('/users/fetch-orders', {
                    allOrders: true
                });
                console.log("Fetched recent orders:", response.data.orders);
                setOrders(response.data.orders);
                if (response.data.orders.length > 0) {
                    setSelectedOrder(response.data.orders[0]);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentOrders();
    }, []);

    // Filter orders based on search
    const filteredOrders = orders.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get status badge styles
    const getStatusStyles = (status) => {
        switch(status) {
            case "Delivered":
                return "bg-success/10 text-success border border-success/20";
            case "Shipped":
                return "bg-info/10 text-info border border-info/20";
            case "Pending":
                return "bg-warning/10 text-warning border border-warning/20";
            case "Cancelled":
                return "bg-error/10 text-error border border-error/20";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch(status) {
            case "Delivered":
                return <CheckCircle className="w-5 h-5" />;
            case "Shipped":
                return <Truck className="w-5 h-5" />;
            case "Cancelled":
                return <XCircle className="w-5 h-5" />;
            default:
                return <Clock className="w-5 h-5" />;
        }
    };

    if (loading) {
        return (
            <div className="bg-background min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Loading Orders</h3>
                    <p className="text-muted-foreground">Please wait...</p>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-gradient-to-b from-background to-muted/20 min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">No Orders Yet</h2>
                    <p className="text-muted-foreground text-lg mb-6 max-w-md">You haven't placed any orders yet. Start shopping to see your orders here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-background to-muted/20 min-h-screen">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center">
                        <Package className="mr-3 w-10 h-10" />
                        Order History
                    </h1>
                    <p className="text-white/90 text-lg">
                        You have {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Orders List */}
                    <div className="lg:col-span-1">
                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by Order ID or Status"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-brand-primary transition-colors"
                                />
                            </div>
                        </div>

                        {/* Orders List */}
                        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                            {filteredOrders.map((order, index) => (
                                <div
                                    key={order._id}
                                    onClick={() => setSelectedOrder(order)}
                                    className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                                        selectedOrder?._id === order._id
                                            ? "border-brand-primary bg-brand-primary/5 shadow-lg"
                                            : "border-border bg-background hover:border-brand-primary/50 hover:shadow-lg"
                                    }`}
                                    style={{
                                        animationDelay: `${index * 50}ms`
                                    }}
                                >
                                    {/* Order ID */}
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-bold text-foreground break-all">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </h3>
                                        {selectedOrder?._id === order._id && (
                                            <div className="flex-shrink-0">
                                                <CheckCircle className="w-5 h-5 text-brand-primary" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                        <Clock className="w-4 h-4" />
                                        <span>{new Date(order.createdAt).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}</span>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold mb-3 ${getStatusStyles(order.orderStatus)}`}>
                                        {getStatusIcon(order.orderStatus)}
                                        <span>{order.orderStatus}</span>
                                    </div>

                                    {/* Total Amount */}
                                    <div className="pt-3 border-t border-border">
                                        <p className="text-sm text-muted-foreground">Total</p>
                                        <p className="text-xl font-bold text-brand-primary">
                                            ${order.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="lg:col-span-2">
                        {selectedOrder ? (
                            <div className="bg-background rounded-2xl border border-border shadow-lg overflow-hidden sticky top-8">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 px-6 py-4 border-b border-border">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                                            <ShoppingBag className="w-6 h-6" />
                                            Order Details
                                        </h2>
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyles(selectedOrder.orderStatus)}`}>
                                            {getStatusIcon(selectedOrder.orderStatus)}
                                            <span>{selectedOrder.orderStatus}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                                    {/* Order Info */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between pb-3 border-b border-border">
                                            <span className="text-muted-foreground">Order ID</span>
                                            <span className="font-bold text-foreground">#{selectedOrder._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                        <div className="flex items-center justify-between pb-3 border-b border-border">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="w-4 h-4" />
                                                Order Date
                                            </div>
                                            <span className="font-semibold text-foreground">
                                                {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { 
                                                    month: 'long', 
                                                    day: 'numeric', 
                                                    year: 'numeric' 
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <CreditCard className="w-4 h-4" />
                                                Payment Method
                                            </div>
                                            <span className="font-semibold text-foreground">Razorpay</span>
                                        </div>
                                    </div>

                                    {/* Products */}
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                            <Package className="w-5 h-5" />
                                            Items ({selectedOrder.products.length})
                                        </h3>
                                        <div className="space-y-4">
                                            {selectedOrder.products.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="group flex gap-4 p-4 bg-muted/30 rounded-xl border border-border hover:border-brand-primary/50 hover:shadow-lg transition-all duration-300"
                                                >
                                                    {/* Image */}
                                                    <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-background border border-border">
                                                        <img
                                                            src={item.product.images[0]?.url}
                                                            alt={item.product.productName}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>

                                                    {/* Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-foreground mb-1 truncate group-hover:text-brand-primary transition-colors">
                                                            {item.product.productName}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            Quantity: <span className="font-bold text-foreground">{item.quantity}</span>
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-muted-foreground">Unit Price</span>
                                                            <span className="font-semibold text-foreground">${item.product.price.toFixed(2)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="flex flex-col items-end justify-between">
                                                        <span className="text-xs text-muted-foreground">Subtotal</span>
                                                        <span className="text-lg font-bold text-brand-primary">
                                                            ${(item.product.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-xl p-4 border border-brand-primary/20">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-foreground">Total Amount</span>
                                            <span className="text-3xl font-bold text-brand-primary">
                                                ${selectedOrder.totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-background rounded-2xl border border-border shadow-lg p-12 flex flex-col items-center justify-center h-96">
                                <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-xl font-bold text-foreground mb-2">Select an Order</h3>
                                <p className="text-muted-foreground text-center">Choose an order from the list to view its details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecentOrderPage;

import React, { use, useEffect } from "react";
import { Card } from "../components/ui/card";
import api from "../api/api";
import { Check } from "lucide-react";



const RecentOrderPage = () => {
    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const [orders, setOrders] = React.useState([]);

    useEffect(() => {
        // Fetch recent orders from backend API when component mounts
        // For now, we will use static data
        const fetchRecentOrders = async () => {
            const response = await api.post('/users/fetch-orders', {
                allOrders: true
            });
            console.log("Fetched recent orders:", response.data.orders);
            setOrders(response.data.orders);
        };
        fetchRecentOrders();
    }, []);



    return <>
        <h1 className="text-2xl font-bold  mb-4">Recent Orders</h1>

        <div className="container flex flex-col-reverse sm:flex-row    mx-auto w-full p-4">
            {/* Recent orders content goes here */}
            <div className="sm:w-1/2 mr-4 overflow-y-auto h-[80vh] pr-2 max-h-[50vh]">
                {orders.map((order) => (
                    <div onClick={() => setSelectedOrder(order)} key={order.id} className="mb-6 p-4 border  rounded-lg bg-accent/50">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
                            <div>
                                <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
                                <p className="text-sm text-muted-foreground">Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold">Total: ${order.totalAmount.toFixed(2)}</p>
                            </div>
                            {selectedOrder && selectedOrder._id === order._id ?
                            <p><Check className="w-4 h-4 text-primary ml-10 mt-2 bg-green-500 rounded-full" /></p> : null}
                        </div>
                        
                    </div>
                ))}
            </div>
            {/* show content of selected orders with images  */}
            <div className="container mx-auto max-w-2xl max-h-[50vh] overflow-y-auto p-4">
                {selectedOrder ?
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Order Items
                        </h3>

                        <div className="space-y-4">
                            {selectedOrder?.products.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between gap-4 border-b last:border-b-0 pb-4 last:pb-0"
                                >
                                    {/* Image */}
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item?.product.images[0]?.url}
                                            alt={item?.product.productName}
                                            className="w-16 h-16 rounded-md object-cover border"
                                        />

                                        {/* Details */}
                                        <div>
                                            <h4 className="font-medium text-foreground">
                                                {item?.product.productName}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Quantity: {item?.quantity}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Price</p>
                                        <p className="font-semibold text-primary">
                                            ${(item?.product.price * item?.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                    : <h1 className="text-muted-foreground text-2xl font-semibold text-center">Select an order to view details</h1>}

            </div>

        </div>


    </>
}

export default RecentOrderPage;
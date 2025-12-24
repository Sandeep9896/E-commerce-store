import api from "../api/api";

const handleRazorpayPayment = async (amount, onsuccess,user) => {

  // create order from backend
  const res = await api.post("/users/create-order", { amount});

  const order = await res.data;

  const options = {
    key: "rzp_test_REfBuIhVuWnurt", // Razorpay Key ID
    amount: order.amount,
    currency: "INR",
    name: "My Ecommerce",
    description: "Order Payment",
    order_id: order.id,
    handler: function (response) {
      // alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
      // You can redirect to success page here
      if (typeof onsuccess === "function") {
        onsuccess(response.razorpay_order_id);
      }
    },
    prefill: {
      name: user?.name || "Customer",
      email: user?.email || "customer@example.com",
      contact: user?.phone || "9999999999",
    },
    theme: {
      color: "#6366f1",
    },
  };

  const razor = new window.Razorpay(options);
  razor.open();
};

export default handleRazorpayPayment;
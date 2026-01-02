import { useState } from "react";
import api from "../../api/api";

function FeaturedButton({ productId, isFeatured, featuredRequest }) {
  const [loading, setLoading] = useState(false);

  const handleFeatureRequest = async () => {
    setLoading(true);
    await api.post(`/seller/products/${productId}/feature-request`);
    setLoading(false);
    alert("Feature request sent!");
  };

  return (
    <button
      disabled={loading || isFeatured || featuredRequest}
      onClick={handleFeatureRequest}
      className={`p-2 rounded-lg ${
        isFeatured ? "bg-success" : "bg-info"
      } text-white`}
    >
      {isFeatured
        ? "Featured"
        : featuredRequest
        ? "Pending Approval"
        : "Request to Feature"}
    </button>
  );
}

export default FeaturedButton;

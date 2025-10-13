import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import api from "../api/api";
import  useLogin from "../hooks/useLogin";
 
// Custom hook: valid place to use hooks

const UserLogin = () => {
  const onSubmit = useLogin("user");
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">User Login</h2>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Input type="email" name="email" placeholder="Email" required />
        <Input type="password" name="password" placeholder="Password" required />
        <Button>Login</Button>
      </form>
    </div>
  );
};

const AdminLogin = () => {
  const onSubmit = useLogin("admin");
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Input type="text" name="adminId" placeholder="Admin ID" required />
        <Input type="password" name="password" placeholder="Password" required />
        <Button>Login</Button>
      </form>
    </div>
  );
};

const SellerLogin = () => {
  const onSubmit = useLogin("seller");
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Seller Login</h2>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Input type="text" name="sellerId" placeholder="Seller ID" required />
        <Input type="password" name="password" placeholder="Password" required />
        <Button>Login</Button>
      </form>
    </div>
  );
};

export { UserLogin, AdminLogin, SellerLogin };
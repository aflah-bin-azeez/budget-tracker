import { useState } from "react";
import API from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/auth/signup", form);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-8">
        
        <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>

        <form onSubmit={submit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 
                       focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 
                       focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 
                       transition"
          >
            Sign Up
          </button>
        </form>

        <Link
          to="/"
          className="block text-center mt-4 text-blue-600 hover:underline"
        >
          Already have an account? Login
        </Link>

      </div>
    </div>
  );
}

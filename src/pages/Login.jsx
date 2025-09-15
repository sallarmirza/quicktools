import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export function Login({ onClose }) {
  const navigate = useNavigate();
  const [input, setInput] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const {setUser}=useContext(UserContext);
  
  async function handleLogin(e) {
    e.preventDefault();
    setError(""); // reset error
    try {
      const res = await axios.post("http://localhost:8000/auth/login", input);
      console.log("Login successful:", res.data);

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data)

      
      onClose?.();
      navigate("/dashboard"); // change to your protected page
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Login failed");
    }
  }

  function handleSignUp() {
    navigate("/signup");
  }

  return (
    <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={input.username}
          onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={input.password}
          onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition duration-200"
        >
          Login
        </button>
      </form>

      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

      <p className="text-center text-gray-600 mt-4">
        Don't have an account?{" "}
        <button
          onClick={handleSignUp}
          className="text-blue-600 font-semibold hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

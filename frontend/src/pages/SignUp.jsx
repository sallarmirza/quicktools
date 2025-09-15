import { useState } from "react";

export function SignUp({ onClose }) {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  async function handleSignUp(e) {
  e.preventDefault();
  if (input.password !== input.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        password: input.password,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("User created: " + data.user);
    } else {
      alert("Error: " + data.detail);
    }
  } catch (err) {
    console.error(err);
  }
}


  return (
    <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign Up</h2>

      <form onSubmit={handleSignUp} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Username"
          onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition duration-200"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

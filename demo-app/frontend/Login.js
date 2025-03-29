import React, { useState } from "react";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5050/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Error logging in");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
      /><br /><br />

      <input
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
      /><br /><br />
      
      <button type="submit">Login</button>
      <br /><br />
      
      <p>{message}</p>
    </form>
  );
}

export default Login;
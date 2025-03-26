import React, { useState } from "react";

function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5050/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Error registering");
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
      <button type="submit">Register</button>
      <p>{message}</p>
    </form>
  );
}

export default Register;
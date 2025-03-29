import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [page, setPage] = useState("login");

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>{page === "login" ? "Login" : "Register"}</h1>
      {page === "login" ? <Login /> : <Register />}
      <button onClick={() => setPage(page === "login" ? "register" : "login")}>
        {page === "login" ? "👉 Go to register" : "👈 Back to login"}
      </button>
    </div>
  );
}

export default App;
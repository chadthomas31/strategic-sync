// pages/client_login.tsx
import React, { useState } from "react";

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Logging in with ${email}`);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Client Login</h1>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "auto" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ margin: "10px 0", padding: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ margin: "10px 0", padding: "10px" }}
        />
        <button type="submit" style={{ padding: "10px", backgroundColor: "black", color: "white", cursor: "pointer" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default ClientLogin;

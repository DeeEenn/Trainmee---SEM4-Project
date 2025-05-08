import React, { useState } from "react";
import { authService } from '../services/api';

const AuthForm = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = mode === "login" 
      ? { email, password }
      : { name, surname, email, password };

    try {
      const response = mode === "login"
        ? await authService.login(formData)
        : await authService.register(formData);
      
      localStorage.setItem("token", response.data.token);
      onAuthSuccess();
    } catch (error) {
      setError(error.response?.data?.message || "Něco se pokazilo");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {mode === "login" ? "Přihlášení" : "Registrace"}
      </h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <>
            <input
              className="w-full mb-3 p-2 border rounded"
              placeholder="Jméno"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="w-full mb-3 p-2 border rounded"
              placeholder="Příjmení"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </>
        )}
        <input
          className="w-full mb-3 p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          type="password"
          placeholder="Heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          type="submit"
        >
          {mode === "login" ? "Přihlásit" : "Registrovat"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        {mode === "login" ? (
          <>
            Nemáte účet?{" "}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setMode("register")}
            >
              Registrovat
            </button>
          </>
        ) : (
          <>
            Máte účet?{" "}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setMode("login")}
            >
              Přihlásit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
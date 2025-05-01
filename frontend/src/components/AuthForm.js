import React, { useState } from "react";

const AuthForm = ({ onAuthSuccess }) => {
    const [mode, setMode] = useState("login"); // "login" or "register"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(""); // only for register
    const [surname, setSurname] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint =
            mode === "login" ? "/api/auth/login" : "/api/auth/register";

        const payload =
            mode === "login"
                ? { email, password }
                : { name, surname, email, password };

        const res = await fetch(`http://localhost:8080${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem("token", data.token);
            onAuthSuccess();
        } else {
            setError("Chyba přihlášení nebo registrace.");
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
                    {mode === "login" ? "Přihlásit se" : "Registrovat se"}
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
                            Zaregistrujte se
                        </button>
                    </>
                ) : (
                    <>
                        Máte účet?{" "}
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() => setMode("login")}
                        >
                            Přihlaste se
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthForm;

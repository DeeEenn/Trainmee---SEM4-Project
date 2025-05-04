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
        setError("");
        const endpoint =
            mode === "login" ? "/api/auth/login" : "/api/auth/register";

        const payload =
            mode === "login"
                ? { email, password }
                : { name, surname, email, password };

        try {
            const res = await fetch(`http://localhost:8080${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                if (mode === "login" && data.token) {
                    sessionStorage.setItem("token", data.token);
                    onAuthSuccess();
                } else if (mode === "register") {
                    setMode("login");
                    setError("Registrace úspěšná. Nyní se můžete přihlásit.");
                }
            } else {
                setError(data.message || "Chyba při přihlášení nebo registraci");
            }
        } catch (err) {
            setError("Chyba při komunikaci se serverem");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">
                {mode === "login" ? "Login" : "Register"}
            </h2>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                {mode === "register" && (
                    <>
                        <input
                            className="w-full mb-3 p-2 border rounded"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            className="w-full mb-3 p-2 border rounded"
                            placeholder="Surname"
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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    type="submit"
                >
                    {mode === "login" ? "Login" : "Register"}
                </button>
            </form>

            <div className="mt-4 text-center text-sm">
                {mode === "login" ? (
                    <>
                        You don't have an account?{" "}
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() => setMode("register")}
                        >
                            Register
                        </button>
                    </>
                ) : (
                    <>
                        Do you have an account?{" "}
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() => setMode("login")}
                        >
                            Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthForm;

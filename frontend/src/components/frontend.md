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
                    localStorage.setItem("token", data.token);
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

const Footer = () => {
    return (
        <footer className=" text-black shadow-lg py-4">
            <div className="container border-1 mx-auto px-4">
                <p className="text-center text-sm font-montserrat">
                    &copy; {new Date().getFullYear()} DAVID NIČ. FIM UHK Studentský zápočtový projekt TNPW2/PRO2
                </p>    
            </div>
        </footer>
    )
}

export default Footer;

import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setUserData(data);
                } else {
                    setError("Nepodařilo se načíst data o uživateli");
                }
            } catch (err) {
                setError("Chyba při komunikaci se serverem");
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Můj profil</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {userData ? (
                <div className="space-y-4">
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Jméno:</span>
                        <span>{userData.name}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Příjmení:</span>
                        <span>{userData.surname}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Email:</span>
                        <span>{userData.email}</span>
                    </div>
                </div>
            ) : (
                <p>Načítání dat...</p>
            )}
        </div>
    );
};

export default ProfilePage;

const Footer = () => {
    return (
        <footer className=" text-black shadow-lg py-4">
            <div className="container border-1 mx-auto px-4">
                <p className="text-center text-sm font-montserrat">
                    &copy; {new Date().getFullYear()} DAVID NIČ. FIM UHK Studentský zápočtový projekt TNPW2/PRO2
                </p>    
            </div>
        </footer>
    )
}

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = ({ onLogout }) => {
    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-gray-800">
                                Trainmee
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                to="/training"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Trainings
                            </Link>
                            <Link
                                to="/progress"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Progress
                            </Link>
                            <Link
                                to="/goals"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Goals
                            </Link>
                            <Link
                                to="/profile"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                My Profile
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={onLogout}
                            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage"; // vytvoř si tuto komponentu
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    return (
            <div className="min-h-screen bg-gray-100">
                {isAuthenticated ? (
                    <div className="flex flex-col h-screen">
                        <Navbar onLogout={handleLogout} />
                        <div className="flex-1">
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <h1 className="text-3xl font-montserrat mb-6">
                                                    Welcome to your training app 💪
                                                </h1>
                                                <p className="text-lg mb-4">
                                                    Are you ready to start working on your self? 🥳
                                                </p>
                                                <p className="text-lg mb-4">
                                                    Use our app to track your progress and goals 💫
                                                </p>
                                                <p className="text-lg mb-4">
                                                    With us you'll be built different soon enough 🦍
                                                </p>
                                            </div>
                                        </div>
                                    }
                                />
                                <Route path="/profile" element={<ProfilePage />} />
                                {/* další route jako /training, /goals atd. */}
                            </Routes>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-screen">
                        <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />
                    </div>
                )}
                <Footer />
            </div>
    )
}

export default App;





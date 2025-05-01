import React, { useState } from "react";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            {isAuthenticated ? (
                <div>
                    <Navbar />
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-6">
                        Vítej v tréninkovém deníku 💪
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Odhlásit se
                    </button>
                </div>
                </div>
            ) : (
                <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />
            )}
        </div>

    );
}

export default App;

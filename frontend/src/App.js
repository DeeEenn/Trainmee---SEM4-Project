import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage"; // vytvoř si tuto komponentu
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TrainingPage from "./pages/TrainingPage";
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
                                <Route path="/training" element={<TrainingPage />} />
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

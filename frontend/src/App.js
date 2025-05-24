import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TrainingPage from "./pages/TrainingPage";
import ProgressPage from "./pages/ProgresPage";
import TrainerPage from "./pages/TrainerPage";
import TrainerDetail from "./components/trainer/TrainerDetail";
import TrainerDashboard from "./components/trainer/TrainerDashboard";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        setUserRole(null);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {isAuthenticated ? (
                <>
                    <Navbar onLogout={handleLogout} />
                    <main className="flex-grow">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    userRole === "TRAINER" ? (
                                        <TrainerDashboard />
                                    ) : (
                                        <div className="min-h-screen py-24">
                                            <div className="max-w-4xl mx-auto px-6">
                                                <div className="text-center mb-20">
                                                    <h1 className="text-5xl font-light text-gray-900 mb-6">
                                                        Traynmee
                                                    </h1>
                                                    <p className="text-lg text-gray-600 font-light">
                                                        Track your progress. Achieve your goals.
                                                    </p>
                                                </div>

                                                <div className="space-y-12">
                                                    <div className="border-l-4 border-gray-900 pl-6">
                                                        <h2 className="text-2xl font-light text-gray-900 mb-3">Track Progress</h2>
                                                        <p className="text-gray-600">
                                                            Monitor your fitness journey with precision and clarity.
                                                        </p>
                                                    </div>

                                                    <div className="border-l-4 border-gray-900 pl-6">
                                                        <h2 className="text-2xl font-light text-gray-900 mb-3">Manage Workouts</h2>
                                                        <p className="text-gray-600">
                                                            Organize your training sessions with ease and efficiency.
                                                        </p>
                                                    </div>

                                                    <div className="border-l-4 border-gray-900 pl-6">
                                                        <h2 className="text-2xl font-light text-gray-900 mb-3">Analyze Results</h2>
                                                        <p className="text-gray-600">
                                                            Understand your progress through clear, actionable insights.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-20 text-center">
                                                    <p className="text-gray-600 font-light">
                                                        Start your journey today
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/training" element={<TrainingPage />} />
                            <Route path="/progress" element={<ProgressPage />} />
                            {userRole === "TRAINER" ? (
                                <Route path="/dashboard" element={<TrainerDashboard />} />
                            ) : (
                                <>
                                    <Route path="/trainers" element={<TrainerPage />} />
                                    <Route path="/trainers/:id" element={<TrainerDetail />} />
                                </>
                            )}
                        </Routes>
                    </main>
                </>
            ) : (
                <div className="flex-grow flex items-center justify-center p-4">
                    <AuthForm onAuthSuccess={(role) => {
                        setIsAuthenticated(true);
                        setUserRole(role);
                    }} />
                </div>
            )}
            <Footer />
        </div>
    );
}

export default App;

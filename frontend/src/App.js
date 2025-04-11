import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Training from './pages/Training';
import Progress from './pages/Progress';
import Login from './components/Login';
import Register from './components/Register';
import TrainingDetail from './components/training/TrainingDetail';
import EditTraining from './components/training/EditTraining';
import ExerciseCategories from './components/exercises/ExerciseCategories';
import Goals from './components/goals/Goals';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/training" element={<Training />} />
        <Route path="/training/:id" element={<TrainingDetail />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/exercises" element={<ExerciseCategories />} />
        <Route path="/training/:id/edit" element={<EditTraining />} />
        <Route path="/goals" element={<Goals />} />
      </Routes>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import ProgressChart from '../components/ProgressChart';
import AddProgressForm from '../components/AddProgressForm';
import TrainingStats from '../components/TrainingStats';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';

const ProgressPage = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await userService.getProfile();
                setUserId(response.data.id);
            } catch (error) {
                console.error('Chyba při načítání profilu:', error);
                navigate('/');
            }
        };

        if (!localStorage.getItem('token')) {
            navigate('/');
            return;
        }

        fetchUserProfile();
    }, [navigate]);

    if (!userId) {
        return <div>Načítání...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Sledování pokroku</h1>
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <ProgressChart userId={userId} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <AddProgressForm 
                            userId={userId} 
                            onProgressAdded={() => setRefreshTrigger(prev => prev + 1)} 
                        />
                    </div>
                    <div>
                        <TrainingStats userId={userId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressPage;
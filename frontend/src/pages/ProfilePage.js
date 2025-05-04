import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const res = await fetch('http://localhost:8080/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setUserData(data);
                } else if (res.status === 401) {
                    sessionStorage.removeItem('token');
                    navigate('/');
                } else {
                    setError("Nepodařilo se načíst data o uživateli");
                }
            } catch (err) {
                setError("Chyba při komunikaci se serverem");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
                <p>Načítání dat...</p>
            </div>
        );
    }

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
                <p>Žádná data k zobrazení</p>
            )}
        </div>
    );
};

export default ProfilePage;

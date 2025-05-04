import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: ''
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const headers = getAuthHeader();
            if (!headers) {
                setError('You are not logged in');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:8080/api/users/profile', {
                headers: headers
            });

            if (response.status === 401) {
                setError('Invalid token, please log in again');
                localStorage.removeItem('token');
                setLoading(false);
                return;
            }

            if (response.status === 403) {
                setError('You are not authorized to perform this action');
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setUserData(data);
            setFormData({
                name: data.name,
                surname: data.surname,
                email: data.email
            });
            setError(null);
        } catch (err) {
            setError(`Error fetching user data: ${err.message}`);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const headers = getAuthHeader();
            if (!headers) {
                setError('You are not logged in');
                return;
            }

            const response = await fetch('http://localhost:8080/api/users/profile', {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(formData)
            });

            if (response.status === 401) {
                setError('Invalid token, please log in again');
                localStorage.removeItem('token');
                return;
            }

            if (response.status === 403) {
                setError('You are not authorized to perform this action');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const data = await response.json();
            setUserData(data);
            setIsEditing(false);
            setSuccess('Profile updated successfully');
            setTimeout(() => setSuccess(''), 3000);
            setError(null);
        } catch (err) {
            setError(`Error updating profile: ${err.message}`);
            console.error('Error:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <div className="text-center text-red-600">
                    {error || 'Failed to load profile data'}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-montserrat">My Profile</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                            Surname
                        </label>
                        <input
                            type="text"
                            id="surname"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            disabled
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                        />
                        <p className="mt-1 text-sm text-gray-500">Cannot change email</p>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                    name: userData.name,
                                    surname: userData.surname,
                                    email: userData.email
                                });
                            }}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Name:</span>
                        <span>{userData.name}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Surname:</span>
                        <span>{userData.surname}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Email:</span>
                        <span>{userData.email}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;

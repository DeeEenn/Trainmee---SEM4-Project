import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    height: '',
    weight: '',
    bodyFatPercentage: ''
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await userService.getProfile();
      setUserData(response.data);
      setFormData({
        name: response.data.name || '',
        surname: response.data.surname || '',
        email: response.data.email || '',
        height: response.data.height || '',
        weight: response.data.weight || '',
        bodyFatPercentage: response.data.bodyFatPercentage || ''
      });
    } catch (error) {
      setError('Nepodařilo se načíst profil');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.updateProfile(formData);
      setUserData(response.data);
      setIsEditing(false);
      setSuccessMessage('Profil byl úspěšně aktualizován');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Nepodařilo se aktualizovat profil');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!userData) {
    return <div>Načítání...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Profil uživatele</h1>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Jméno</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Příjmení</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Výška (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Váha (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Procento tuku (%)</label>
              <input
                type="number"
                name="bodyFatPercentage"
                value={formData.bodyFatPercentage}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Uložit
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Zrušit
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Jméno</p>
              <p>{userData.name}</p>
            </div>
            <div>
              <p className="font-semibold">Příjmení</p>
              <p>{userData.surname}</p>
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p>{userData.email}</p>
            </div>
            <div>
              <p className="font-semibold">Výška</p>
              <p>{userData.height} cm</p>
            </div>
            <div>
              <p className="font-semibold">Váha</p>
              <p>{userData.weight} kg</p>
            </div>
            <div>
              <p className="font-semibold">Procento tuku</p>
              <p>{userData.bodyFatPercentage}%</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upravit profil
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
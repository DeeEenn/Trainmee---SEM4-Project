import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';

const ProfilePage = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await userService.uploadProfilePicture(file);
      setProfilePicture(response.data);
      setSuccessMessage('Profile picture uploaded successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  } 

  const loadUserProfile = async () => {
    try {
      const response = await userService.getProfile();
      setUserData(response.data);
      setProfilePicture(response.data.profilePictureUrl);
      setFormData({
        name: response.data.name || '',
        surname: response.data.surname || '',
        email: response.data.email || '',
        height: response.data.height || '',
        weight: response.data.weight || '',
        bodyFatPercentage: response.data.bodyFatPercentage || ''
      });
    } catch (error) {
      setError('Failed to load profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.updateProfile(formData);
      setUserData(response.data);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to update profile');
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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Profile
          </h1>
          <p className="text-gray-600 font-light">
            Manage your personal information
          </p>
        </div>

        {error && (
          <div className="mb-8 border-l-4 border-red-500 pl-4 py-2">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-8 border-l-4 border-green-500 pl-4 py-2">
            <p className="text-green-600">{successMessage}</p>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={profilePicture || '/default-avatar.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </label>
              <input
                type="file"
                id="profile-picture"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>
            {uploading && (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm text-gray-600 mb-2">First Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Last Name</label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Body Fat (%)</label>
                <input
                  type="number"
                  name="bodyFatPercentage"
                  value={formData.bodyFatPercentage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm text-gray-600 mb-2">First Name</h3>
                <p className="text-lg text-gray-900">{userData.name}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Last Name</h3>
                <p className="text-lg text-gray-900">{userData.surname}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Email</h3>
                <p className="text-lg text-gray-900">{userData.email}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Height</h3>
                <p className="text-lg text-gray-900">{userData.height} cm</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Weight</h3>
                <p className="text-lg text-gray-900">{userData.weight} kg</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Body Fat</h3>
                <p className="text-lg text-gray-900">{userData.bodyFatPercentage}%</p>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
import { useState, useEffect } from 'react';
import { useAuthorProfile } from '../../hooks/useAuthorProfile';

const Profile = () => {
  const { fetchProfile, updateProfile, updatePhoto, loading } = useAuthorProfile();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    business_name: '',
    bio: '',
    website: '',
    email: ''
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProfile();
      setProfile(data);
      setFormData({
        business_name: data?.business_name || '',
        bio: data?.bio || '',
        website: data?.website || '',
        email: data?.email || ''
      });
      if (data?.photo) {
        setPhotoPreview(`${import.meta.env.VITE_API_URL}${data.photo}`);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setMessage('Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoPreview(URL.createObjectURL(file));

    try {
      const photoUrl = await updatePhoto(file);
      setMessage('Photo updated successfully');
      setTimeout(() => setMessage(''), 3000);
      setPhotoPreview(`${import.meta.env.VITE_API_URL}${photoUrl}`);
    } catch (error) {
      setMessage('Failed to upload photo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
      loadProfile();
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Photo
              </div>
            )}
          </div>
          <div>
            <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
              Upload Photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
            <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max 5MB.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded px-3 py-2"
              placeholder="Tell readers about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

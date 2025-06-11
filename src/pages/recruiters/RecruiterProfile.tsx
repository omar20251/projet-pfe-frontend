import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Building, Globe, Phone, MapPin, Edit, Save, X, User } from 'lucide-react';
import recruiterService, { RecruiterProfile as RecruiterProfileType, UpdateRecruiterRequest, Domain } from '../../services/recruiterService';

const RecruiterProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recruiterProfile, setRecruiterProfile] = useState<RecruiterProfileType | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [formData, setFormData] = useState<UpdateRecruiterRequest>({
    first_name: user?.prenom || '',
    last_name: user?.nom || '',
    email: user?.email || '',
    entreprise_name: '',
    website: '',
    phone: '',
    address: '',
    entreprise_description: '',
    unique_identifier: '',
    domaine: ''
  });

  useEffect(() => {
    const fetchRecruiterData = async () => {
      if (!user || user.role !== 'recruiter') {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [profile, domainsList] = await Promise.all([
          recruiterService.getCurrentRecruiterProfile(),
          recruiterService.getDomains()
        ]);

        setRecruiterProfile(profile);
        setDomains(domainsList);

        // Update form data with fetched profile
        if (profile) {
          setFormData({
            first_name: profile.user?.first_name || '',
            last_name: profile.user?.last_name || '',
            email: profile.user?.email || '',
            entreprise_name: profile.entreprise_name || '',
            website: profile.website || '',
            phone: profile.phone || '',
            address: profile.address || '',
            entreprise_description: profile.entreprise_description || '',
            unique_identifier: profile.unique_identifier || '',
            domaine: profile.domaine || ''
          });
        }
      } catch (error) {
        console.error('Error fetching recruiter profile:', error);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecruiterData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!recruiterProfile) return;

    try {
      setIsSaving(true);
      setError(null);

      const response = await recruiterService.updateOwnProfile(formData);
      setRecruiterProfile(response.recruiter);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (recruiterProfile) {
      setFormData({
        first_name: recruiterProfile.user?.first_name || '',
        last_name: recruiterProfile.user?.last_name || '',
        email: recruiterProfile.user?.email || '',
        entreprise_name: recruiterProfile.entreprise_name || '',
        website: recruiterProfile.website || '',
        phone: recruiterProfile.phone || '',
        address: recruiterProfile.address || '',
        entreprise_description: recruiterProfile.entreprise_description || '',
        unique_identifier: recruiterProfile.unique_identifier || '',
        domaine: recruiterProfile.domaine || ''
      });
    }
    setIsEditing(false);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'recruiter') {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500">This page is only accessible to recruiters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiter Profile</h1>
          <p className="text-gray-500 mt-1">Manage your company information and profile details</p>
        </div>
        <div className="mt-4 md:mt-0">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none disabled:opacity-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{recruiterProfile?.user?.first_name || 'Not provided'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{recruiterProfile?.user?.last_name || 'Not provided'}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{recruiterProfile?.user?.email || 'Not provided'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building className="h-5 w-5 mr-2" />
          Company Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            {isEditing ? (
              <input
                type="text"
                name="entreprise_name"
                value={formData.entreprise_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{recruiterProfile?.entreprise_name || 'Not provided'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            {isEditing ? (
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">
                {recruiterProfile?.website ? (
                  <a href={recruiterProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {recruiterProfile.website}
                  </a>
                ) : (
                  'Not provided'
                )}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{recruiterProfile?.phone || 'Not provided'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{recruiterProfile?.address || 'Not provided'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unique Identifier</label>
            {isEditing ? (
              <input
                type="text"
                name="unique_identifier"
                value={formData.unique_identifier}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{recruiterProfile?.unique_identifier || 'Not provided'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
            {isEditing ? (
              <select
                name="domaine"
                value={formData.domaine}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a domain</option>
                {domains.map((domain) => (
                  <option key={domain.id} value={domain.name}>
                    {domain.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900">{recruiterProfile?.domaine || 'Not provided'}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
            {isEditing ? (
              <textarea
                name="entreprise_description"
                value={formData.entreprise_description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your company..."
              />
            ) : (
              <p className="text-gray-900">{recruiterProfile?.entreprise_description || 'Not provided'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;

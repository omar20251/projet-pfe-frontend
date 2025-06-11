import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, Award, CheckCircle, Book, Edit, Briefcase } from 'lucide-react';
import candidateService from '../../services/candidateService';
import jobService from '../../services/jobService';

const CandidateProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    first_name: user?.prenom || '',
    last_name: user?.nom || '',
    email: user?.email || '',
    civility: 'M' as 'M' | 'Mme' | 'Mlle',
    Governorate: '',
    birth_date: '',
    education: '',
    about: '',
    skills: [] as string[]
  });

  useEffect(() => {
    const fetchCandidateData = async () => {
      if (!user || user.role !== 'candidate') {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [profile, userApplications] = await Promise.all([
          candidateService.getCurrentCandidateProfile(),
          jobService.getCandidateApplications()
        ]);

        setCandidateProfile(profile);
        setApplications(userApplications);

        // Update form data with fetched profile
        if (profile && profile.user) {
          setFormData({
            first_name: profile.user.first_name || '',
            last_name: profile.user.last_name || '',
            email: profile.user.email || '',
            civility: profile.civility || 'M',
            Governorate: profile.Governorate || '',
            birth_date: profile.birth_date || '',
            education: '',
            about: '',
            skills: []
          });
        }
      } catch (err) {
        console.error('Error fetching candidate data:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidateData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => ({ ...prev, skills }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidateProfile) return;

    try {
      setIsSaving(true);
      setError(null);

      await candidateService.updateCandidate(candidateProfile.id.toString(), formData);

      // Refresh profile data
      const updatedProfile = await candidateService.getCurrentCandidateProfile();
      setCandidateProfile(updatedProfile);

      setIsEditing(false);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
      </div>
    );
  }

  if (!candidateProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
              disabled={isSaving}
            >
              <Edit className="h-4 w-4 mr-1" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="civility" className="block text-sm font-medium text-gray-700 mb-1">
                  Civility
                </label>
                <select
                  id="civility"
                  name="civility"
                  value={formData.civility}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="M">Mr.</option>
                  <option value="Mme">Mrs.</option>
                  <option value="Mlle">Miss</option>
                </select>
              </div>

              <div>
                <label htmlFor="Governorate" className="block text-sm font-medium text-gray-700 mb-1">
                  Governorate
                </label>
                <select
                  id="Governorate"
                  name="Governorate"
                  value={formData.Governorate}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Select Governorate</option>
                  <option value="Ariana">Ariana</option>
                  <option value="Béja">Béja</option>
                  <option value="Ben Arous">Ben Arous</option>
                  <option value="Bizerte">Bizerte</option>
                  <option value="Gabès">Gabès</option>
                  <option value="Gafsa">Gafsa</option>
                  <option value="Jendouba">Jendouba</option>
                  <option value="Kairouan">Kairouan</option>
                  <option value="Kasserine">Kasserine</option>
                  <option value="Kébili">Kébili</option>
                  <option value="Le Kef">Le Kef</option>
                  <option value="Mahdia">Mahdia</option>
                  <option value="La Manouba">La Manouba</option>
                  <option value="Médnine">Médnine</option>
                  <option value="Monastir">Monastir</option>
                  <option value="Nabeul">Nabeul</option>
                  <option value="Sfax">Sfax</option>
                  <option value="Sidi Bouzid">Sidi Bouzid</option>
                  <option value="Siliana">Siliana</option>
                  <option value="Sousse">Sousse</option>
                  <option value="Tataouine">Tataouine</option>
                  <option value="Tozeur">Tozeur</option>
                  <option value="Tunis">Tunis</option>
                  <option value="Zaghouan">Zaghouan</option>
                </select>
              </div>

              <div>
                <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="birth_date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                  Education
                </label>
                <input
                  type="text"
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
                  About
                </label>
                <textarea
                  id="about"
                  name="about"
                  rows={4}
                  value={formData.about}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills.join(', ')}
                  onChange={handleSkillChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="mt-1 text-gray-900">{formData.first_name} {formData.last_name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-gray-900">{formData.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Civility</p>
                <p className="mt-1 text-gray-900">{formData.civility}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Governorate</p>
                <p className="mt-1 text-gray-900">{formData.Governorate || 'Not specified'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p className="mt-1 text-gray-900">
                  {formData.birth_date
                    ? new Date(formData.birth_date).toLocaleDateString()
                    : 'Not specified'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Education</p>
                <p className="mt-1 text-gray-900">{formData.education}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">About</p>
                <p className="mt-1 text-gray-900">{formData.about}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Skills</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skills.map(skill => (
                    <span 
                      key={skill} 
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
        </div>
        
        {false ? ( // TODO: Implement quiz results API
          <div className="divide-y divide-gray-200">
            {testSubmissions.map((submission) => (
              <div key={submission.id} className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {submission.testTitle || 'Test Assessment'}
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Completed on {new Date(submission.endTime || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 sm:mt-0">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Score: {submission.percentage}%
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${submission.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {/* View result details */}}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="rounded-full h-12 w-12 bg-blue-100 flex items-center justify-center mx-auto">
              <Book className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No test results yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't completed any assessments yet.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {/* Navigate to jobs */}}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Find Jobs with Assessments
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Applications</h2>
        </div>
        
        {applications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {applications.map((application: any) => (
              <div key={application.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{application.title || 'Job Application'}</h3>
                    <p className="mt-1 text-sm text-gray-500">{application.entreprise_name || 'Company'}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Award className="h-4 w-4 mr-1" />
                      <span>Applied on {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'Unknown date'}</span>
                    </div>
                  </div>

                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    application.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : application.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {application.status === 'accepted' && <CheckCircle className="h-4 w-4 mr-1" />}
                    {application.status === 'pending' && <Clock className="h-4 w-4 mr-1" />}
                    {application.status === 'accepted' ? 'Accepted' :
                     application.status === 'rejected' ? 'Rejected' : 'Pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="rounded-full h-12 w-12 bg-blue-100 flex items-center justify-center mx-auto">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't applied to any jobs yet.
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.location.href = '/jobs'}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Browse Jobs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;
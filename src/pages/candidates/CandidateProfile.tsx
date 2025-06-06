import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, Award, CheckCircle, Book, Edit } from 'lucide-react';
import { mockTestSubmissions } from '../../mocks/testMocks';

const CandidateProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
    governorat: user?.governorat || '',
    dateNaissance: user?.dateNaissance 
      ? new Date(user.dateNaissance).toISOString().split('T')[0] 
      : '',
    education: 'Bachelor in Computer Science, University of Technology',
    about: 'Passionate software developer with a strong background in web technologies and application development.',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'HTML/CSS', 'Git', 'Python']
  });

  // Mock test submissions for this candidate
  const testSubmissions = mockTestSubmissions.filter(submission => submission.candidateId === user?.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => ({ ...prev, skills }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user profile via API
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
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
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="governorat" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="governorat"
                  name="governorat"
                  value={formData.governorat}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateNaissance"
                  name="dateNaissance"
                  value={formData.dateNaissance}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                <p className="mt-1 text-gray-900">{formData.prenom} {formData.nom}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-gray-900">{formData.email}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="mt-1 text-gray-900">{formData.governorat || 'Not specified'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p className="mt-1 text-gray-900">
                  {formData.dateNaissance 
                    ? new Date(formData.dateNaissance).toLocaleDateString() 
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
        
        {testSubmissions.length > 0 ? (
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
        
        <div className="divide-y divide-gray-200">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Senior Frontend Developer</h3>
                <p className="mt-1 text-sm text-gray-500">TechCorp Inc.</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Award className="h-4 w-4 mr-1" />
                  <span>Applied on May 15, 2023</span>
                </div>
              </div>
              
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                Application Complete
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <div className="w-1/4 text-sm font-medium text-gray-500">Assessment Status:</div>
                <div className="text-sm text-gray-900">2/2 Completed</div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4 text-sm font-medium text-gray-500">Average Score:</div>
                <div className="text-sm text-gray-900">82%</div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Full Stack Developer</h3>
                <p className="mt-1 text-sm text-gray-500">InnovateSoft</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Award className="h-4 w-4 mr-1" />
                  <span>Applied on June 3, 2023</span>
                </div>
              </div>
              
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                <Clock className="h-4 w-4 mr-1" />
                In Progress
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <div className="w-1/4 text-sm font-medium text-gray-500">Assessment Status:</div>
                <div className="text-sm text-gray-900">1/3 Completed</div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4 text-sm font-medium text-gray-500">Next Test:</div>
                <div className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer">Backend Development Quiz</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
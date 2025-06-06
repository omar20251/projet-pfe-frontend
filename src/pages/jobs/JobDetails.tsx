import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Briefcase, Award, CheckCircle } from 'lucide-react';
import { mockJobOffers } from '../../mocks/jobMocks';
import { JobOffer } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobOffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, this would be an API call
    const foundJob = mockJobOffers.find(job => job.id === id);
    setJob(foundJob || null);
    setIsLoading(false);
    
    // Check if user has applied (mock)
    setHasApplied(Math.random() > 0.7);
  }, [id]);

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    
    // Mock apply logic
    setHasApplied(true);
    
    // If job has tests, redirect to first test
    if (job?.tests && job.tests.length > 0) {
      navigate(`/tests/${job.tests[0].id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">Job not found</h2>
        <p className="text-gray-500 mb-4">The job you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/jobs')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Browse All Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.titre}</h1>
          <div className="mt-2 flex items-center text-lg text-gray-700">
            {job.entreprise}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {hasApplied ? (
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-md font-medium flex items-center justify-center"
              disabled
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Applied
            </button>
          ) : (
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </button>
          )}
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
            Save Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <p className="text-gray-700 mb-6 whitespace-pre-line">{job.description}</p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
            <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
              <li>Bachelor's degree or equivalent practical experience</li>
              <li>{job.experience} of professional experience</li>
              <li>Proficient in {job.langue} (written and verbal)</li>
              <li>Strong problem-solving abilities and analytical skills</li>
              <li>Experience with {job.competences.join(', ')}</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Competitive salary and performance bonuses</li>
              <li>Health insurance and retirement plans</li>
              <li>Flexible working hours and remote work options</li>
              <li>Professional development opportunities</li>
              <li>Friendly and collaborative work environment</li>
            </ul>
          </div>
          
          {job.tests && job.tests.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Assessment Tests</h2>
              <p className="text-gray-500 mb-4">
                This position requires completing the following tests as part of the application process:
              </p>
              
              <div className="space-y-4">
                {job.tests.map((test, index) => (
                  <div key={test.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{test.titre}</h3>
                        <p className="text-sm text-gray-500 mt-1">{test.description || `Test ${index + 1} for this position`}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{test.dureeMinutes} minutes</span>
                          <span className="mx-2">•</span>
                          <span>{test.questions.length} questions</span>
                        </div>
                      </div>
                      {hasApplied && (
                        <button
                          onClick={() => navigate(`/tests/${test.id}`)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          Take Test
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900">{job.lieu}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Job Type</p>
                  <p className="text-gray-900">{job.typeContrat}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Award className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Experience</p>
                  <p className="text-gray-900">{job.experience}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Posted On</p>
                  <p className="text-gray-900">{new Date(job.datePublication).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Expires On</p>
                  <p className="text-gray-900">{new Date(job.dateExpiration).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills & Competencies</h2>
            
            <div className="flex flex-wrap gap-2">
              {job.competences.map(skill => (
                <span 
                  key={skill} 
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h2>
            
            <p className="text-gray-700 mb-4">
              {job.entreprise} is a leading company in its industry, committed to innovation and excellence.
            </p>
            
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Visit Company Profile
            </a>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Ready to apply for this job?</h2>
            <p className="text-gray-600 mt-1">
              Complete the assessments to showcase your skills to the employer.
            </p>
          </div>
          
          {hasApplied ? (
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-md font-medium flex items-center justify-center"
              disabled
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Applied
            </button>
          ) : (
            <button
              onClick={handleApply}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
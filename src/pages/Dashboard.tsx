import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, Users, PieChart, BarChart } from 'lucide-react';
import { useState, useEffect } from 'react';
import jobService from '../services/jobService';
import { JobOffer } from '../types';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect based on role
  if (isAuthenticated && user?.role === 'recruiter') {
    navigate('/recruiter');
    return null;
  }

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await jobService.getValidJobs();
        setFeaturedJobs(jobs.slice(0, 3)); // Get first 3 jobs
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setFeaturedJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-blue-700 text-white rounded-lg p-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find your perfect job match with TalentQuiz</h1>
          <p className="text-blue-100 text-lg mb-6">
            Showcase your skills through quizzes and get discovered by top companies
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/jobs')}
              className="bg-white text-blue-700 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              Browse Jobs
            </button>
            {!isAuthenticated && (
              <button 
                onClick={() => navigate('/register')}
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium border border-blue-500 hover:bg-blue-800 transition-colors"
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-blue-50 text-blue-700">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Job Matching</h3>
              <p className="mt-1 text-sm text-gray-500">
                Our algorithm matches your skills with the perfect job opportunities
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-teal-50 text-teal-700">
              <PieChart className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Skill Assessment</h3>
              <p className="mt-1 text-sm text-gray-500">
                Take quizzes to showcase your abilities to potential employers
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-orange-50 text-orange-700">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Direct Hiring</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get hired based on your actual skills, not just your resume
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Featured Job Opportunities</h2>
          <button
            onClick={() => navigate('/jobs')} 
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View all jobs
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{job.titre}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">{job.lieu}</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">{job.typeContrat}</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">{job.experience}</span>
                </div>
                <button
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="w-full px-4 py-2 text-sm font-medium rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works for Candidates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create Profile</h3>
              <p className="text-gray-500 text-sm">Sign up and build your professional profile</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Take Tests</h3>
              <p className="text-gray-500 text-sm">Complete skill assessments to showcase your abilities</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Get Hired</h3>
              <p className="text-gray-500 text-sm">Match with employers and receive job offers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
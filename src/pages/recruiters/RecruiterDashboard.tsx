import { useEffect, useState } from 'react';
import { PieChart, LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie, Cell, Line, Bar, ResponsiveContainer } from 'recharts';
import { 
  Users, 
  Briefcase, 
  FileCheck, 
  Clock, 
  ChevronRight, 
  Search,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from 'lucide-react';
import { mockJobOffers } from '../../mocks/jobMocks';
import { mockTestSubmissions } from '../../mocks/testMocks';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCandidates: 0,
    activeJobs: 0,
    completedTests: 0,
    pendingReviews: 0
  });
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    // In a real app, this would be an API call to get these stats
    setStats({
      totalCandidates: 124,
      activeJobs: mockJobOffers.filter(job => job.etat === 'active').length,
      completedTests: mockTestSubmissions.length,
      pendingReviews: 18
    });
  }, []);

  // Mock data for charts
  const candidateSourceData = [
    { name: 'Job Boards', value: 45 },
    { name: 'Referrals', value: 25 },
    { name: 'Social Media', value: 20 },
    { name: 'Direct', value: 10 }
  ];

  const testScoreData = [
    { name: '0-20%', candidates: 5 },
    { name: '21-40%', candidates: 15 },
    { name: '41-60%', candidates: 30 },
    { name: '61-80%', candidates: 45 },
    { name: '81-100%', candidates: 25 }
  ];

  const applicationTrendData = [
    { name: 'Week 1', applications: 12 },
    { name: 'Week 2', applications: 19 },
    { name: 'Week 3', applications: 15 },
    { name: 'Week 4', applications: 27 },
    { name: 'Week 5', applications: 32 },
    { name: 'Week 6', applications: 24 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.prenom}! Here's what's happening with your recruitment.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button 
            onClick={() => navigate('/recruiter/tests')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Manage Tests
          </button>
          <button 
            onClick={() => navigate('/recruiter/post-job')/* Create job offer */}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Post New Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-blue-50 text-blue-700">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Candidates</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCandidates}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600">+8% from last month</span>
              <a href="#" className="text-blue-600 flex items-center">
                Details <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-teal-50 text-teal-700">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Job Offers</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeJobs}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600">+2 new this week</span>
              <a href="#" className="text-blue-600 flex items-center">
                Details <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-purple-50 text-purple-700">
              <FileCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed Tests</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedTests}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600">+12 today</span>
              <a href="#" className="text-blue-600 flex items-center">
                Details <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-amber-50 text-amber-700">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingReviews}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-yellow-600">4 require attention</span>
              <a href="#" className="text-blue-600 flex items-center">
                Review <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Candidate Sources</h2>
            <div className="p-1 rounded-md bg-blue-50 text-blue-700">
              <PieChartIcon className="h-5 w-5" />
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={candidateSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {candidateSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Test Score Distribution</h2>
            <div className="p-1 rounded-md bg-blue-50 text-blue-700">
              <BarChartIcon className="h-5 w-5" />
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={testScoreData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="candidates" fill="#3B82F6" name="Candidates" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Application Trends</h2>
          <select className="bg-white border border-gray-300 rounded-md text-sm px-3 py-2">
            <option>Last 6 Weeks</option>
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
          </select>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={applicationTrendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="applications" 
                stroke="#3B82F6" 
                activeDot={{ r: 8 }} 
                name="Applications" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                View All
              </a>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                        JD
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">John Doe</div>
                        <div className="text-sm text-gray-500">john.doe@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Frontend Developer</div>
                    <div className="text-sm text-gray-500">Web Development</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      92%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Qualified
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-blue-600 hover:text-blue-900">View</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                        AS
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Alice Smith</div>
                        <div className="text-sm text-gray-500">alice.smith@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Backend Developer</div>
                    <div className="text-sm text-gray-500">Server Infrastructure</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      78%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Review
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-blue-600 hover:text-blue-900">View</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                        RJ
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Robert Johnson</div>
                        <div className="text-sm text-gray-500">robert.j@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">UI/UX Designer</div>
                    <div className="text-sm text-gray-500">Design Department</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      65%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Needs Review
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-blue-600 hover:text-blue-900">View</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Candidates</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                EM
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">Emily Miller</div>
                <div className="text-sm text-gray-500">Frontend Developer</div>
                <div className="mt-1 flex items-center">
                  <div className="text-xs font-medium text-green-700">95% Test Score</div>
                  <div className="ml-2 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                TW
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">Thomas Wilson</div>
                <div className="text-sm text-gray-500">Backend Developer</div>
                <div className="mt-1 flex items-center">
                  <div className="text-xs font-medium text-green-700">92% Test Score</div>
                  <div className="ml-2 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                SB
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">Sarah Brown</div>
                <div className="text-sm text-gray-500">Full Stack Developer</div>
                <div className="mt-1 flex items-center">
                  <div className="text-xs font-medium text-green-700">90% Test Score</div>
                  <div className="ml-2 flex">
                    {[1, 2, 3, 4, 5].map((star, idx) => (
                      <svg key={star} className={`h-4 w-4 ${idx < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button 
                onClick={() => navigate('/recruiter/candidates')}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View All Candidates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
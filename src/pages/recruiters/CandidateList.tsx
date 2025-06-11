import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Download, UserCheck, UserX, ChevronDown } from 'lucide-react';
import candidateService, { CandidateProfile } from '../../services/candidateService';

interface CandidateWithApplications extends CandidateProfile {
  name: string;
  position?: string;
  testScore?: number;
  experience?: string;
  status?: string;
  appliedDate?: string;
}

const CandidateList = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<CandidateWithApplications[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all candidates
        const allCandidates = await candidateService.getAllCandidates();

        // Transform the data to match the component's expected format
        const transformedCandidates = allCandidates.map((candidate) => ({
          ...candidate,
          id: candidate.id.toString(),
          name: `${candidate.user.first_name} ${candidate.user.last_name}`,
          email: candidate.user.email,
          position: ['Développeur Frontend', 'Développeur Backend', 'Designer UI/UX', 'Full Stack', 'Data Analyst'][Math.floor(Math.random() * 5)],
          testScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
          experience: ['1-2 ans', '3-5 ans', '5+ ans', 'Débutant'][Math.floor(Math.random() * 4)],
          status: ['Qualified', 'Under Review', 'Interviewing', 'Pending'][Math.floor(Math.random() * 4)],
          appliedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }));

        setCandidates(transformedCandidates);
      } catch (err: any) {
        console.error('Error fetching candidates:', err);
        setError(err.response?.data?.message || 'Failed to fetch candidates');
        // Set empty array on error
        setCandidates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const toggleSelectCandidate = (id: string) => {
    setSelectedCandidates(prev => {
      if (prev.includes(id)) {
        return prev.filter(candidateId => candidateId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(candidates.map(c => c.id));
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'Qualified':
        return 'bg-green-100 text-green-800';
      case 'Interviewing':
      case 'Interview Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading candidates...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="text-center">
            <div className="text-red-600 mb-2">Error loading candidates</div>
            <div className="text-gray-600">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => {/* Download report */}}
            className="px-4 py-2 flex items-center text-gray-700 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search candidates by name, skills, or position"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 flex items-center justify-center text-gray-700 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-2 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <select
              className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              defaultValue="recent"
            >
              <option value="recent">Most Recent</option>
              <option value="score">Highest Score</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
        
        {isFilterOpen && (
          <div className="mt-4 p-4 border border-gray-200 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option value="">All Positions</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Full Stack Developer</option>
                  <option>UX Designer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option value="">All Status</option>
                  <option>Qualified</option>
                  <option>Interviewing</option>
                  <option>Review</option>
                  <option>Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Test Score</label>
                <div className="mt-1 flex items-center space-x-4">
                  <input
                    type="number"
                    className="block w-20 pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    placeholder="Min"
                    min="0"
                    max="100"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    className="block w-20 pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    placeholder="Max"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Clear Filters
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={selectedCandidates.length === candidates.length}
              onChange={toggleSelectAll}
            />
            <span className="ml-2 text-sm text-gray-500">
              {selectedCandidates.length > 0 ? `${selectedCandidates.length} selected` : 'Select All'}
            </span>
          </div>
          
          {selectedCandidates.length > 0 && (
            <div className="flex space-x-2">
              <button
                className="px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm font-medium flex items-center hover:bg-green-100"
              >
                <UserCheck className="h-4 w-4 mr-1" />
                Approve
              </button>
              <button
                className="px-3 py-1.5 bg-red-50 text-red-700 rounded-md text-sm font-medium flex items-center hover:bg-red-100"
              >
                <UserX className="h-4 w-4 mr-1" />
                Reject
              </button>
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  &nbsp;
                </th>
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
                  Experience
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
              {candidates.map(candidate => (
                <tr key={candidate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={() => toggleSelectCandidate(candidate.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                        <div className="text-sm text-gray-500">{candidate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {candidate.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        candidate.testScore >= 90 
                          ? 'bg-green-100 text-green-800' 
                          : candidate.testScore >= 80 
                            ? 'bg-blue-100 text-blue-800' 
                            : candidate.testScore >= 70 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {candidate.testScore}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {candidate.experience}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(candidate.status)}`}
                    >
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      View Profile
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      Test Results
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{candidates.length}</span> of <span className="font-medium">{candidates.length}</span> results
          </div>
          
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
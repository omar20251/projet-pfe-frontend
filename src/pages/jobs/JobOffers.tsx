import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Briefcase, Clock } from 'lucide-react';
import { JobOffer } from '../../types';
import jobService from '../../services/jobService';

const JobOffers = () => {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterContract, setFilterContract] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const jobsData = await jobService.getAllJobs();

        // Transform backend data to frontend format
        const transformedJobs: JobOffer[] = jobsData.map((job: any) => ({
          id: job.id.toString(),
          titre: job.title,
          entreprise: job.entreprise_name,
          description: job.description,
          lieu: job.place,
          postes_vacants: job.open_postes,
          experience: job.experience,
          niveau_etude: job.education_level,
          langue: job.language,
          competences: job.skills ? job.skills.split(',').map((s: string) => s.trim()) : [],
          salaire: job.salary,
          typeContrat: job.contract_type,
          datePublication: new Date(job.publication_date),
          dateExpiration: new Date(job.expiration_date),
          etat: job.statut === 'valide' ? 'active' : 'closed',
        }));

        setJobs(transformedJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load job offers. Please try again later.');
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.entreprise.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = filterLocation ? job.lieu === filterLocation : true;
    const matchesContract = filterContract ? job.typeContrat === filterContract : true;
    const matchesExperience = filterExperience ? job.experience === filterExperience : true;
    
    return matchesSearch && matchesLocation && matchesContract && matchesExperience;
  });

  const uniqueLocations = Array.from(new Set(jobs.map(job => job.lieu)));
  const uniqueContracts = Array.from(new Set(jobs.map(job => job.typeContrat)));
  const uniqueExperiences = Array.from(new Set(jobs.map(job => job.experience)));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading job offers...</span>
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

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search jobs by title, company, or keyword"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filterContract}
              onChange={(e) => setFilterContract(e.target.value)}
            >
              <option value="">All Contract Types</option>
              {uniqueContracts.map(contract => (
                <option key={contract} value={contract}>{contract}</option>
              ))}
            </select>
            
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
            >
              <option value="">All Experience Levels</option>
              {uniqueExperiences.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">{filteredJobs.length} Jobs Found</h2>
          <div className="flex items-center text-sm text-gray-500">
            <Filter className="h-4 w-4 mr-1" />
            <span>Sort by: </span>
            <select
              className="ml-2 bg-transparent border-none focus:ring-0 text-sm font-medium"
              defaultValue="recent"
            >
              <option value="recent">Most Recent</option>
              <option value="relevant">Most Relevant</option>
              <option value="salary">Highest Salary</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div 
                key={job.id} 
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className="sm:flex sm:justify-between sm:items-start">
                  <div className="sm:flex sm:items-start">
                    <div className="h-12 w-12 flex-shrink-0 bg-blue-100 rounded-md flex items-center justify-center">
                      <span className="text-blue-800 font-semibold text-lg">
                        {job.entreprise.charAt(0)}
                      </span>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{job.titre}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>{job.entreprise}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.lieu}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {job.typeContrat}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.experience}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">{job.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col sm:items-end space-y-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    view job details
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {job.salaire ? `${job.salaire.toLocaleString()} / year` : 'Negotiable'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Posted {new Date(job.datePublication).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No jobs match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobOffers;
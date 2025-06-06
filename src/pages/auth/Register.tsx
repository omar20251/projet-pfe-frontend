import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';
import { Role } from '../../types';

const Register = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate' as Role,
    governorat: '',
    dateNaissance: '',
    entreprise_name: '',
    website: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      // Create user object based on role
      const userData = {
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        role: formData.role,
      };
      
      // Add role-specific fields
      if (formData.role === 'candidate') {
        Object.assign(userData, {
          governorat: formData.governorat,
          dateNaissance: formData.dateNaissance ? new Date(formData.dateNaissance) : undefined,
        });
      } else if (formData.role === 'recruiter') {
        Object.assign(userData, {
          entreprise_name: formData.entreprise_name,
          website: formData.website,
        });
      }
      
      const success = await register(userData, formData.password);
      if (success) {
        navigate('/');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="candidate">Candidate</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.prenom}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.nom}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            {/* Role-specific fields */}
            {formData.role === 'candidate' && (
              <>
                <div>
                  <label htmlFor="governorat" className="block text-sm font-medium text-gray-700">
                    Location/Region
                  </label>
                  <input
                    id="governorat"
                    name="governorat"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.governorat}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    id="dateNaissance"
                    name="dateNaissance"
                    type="date"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            
            {formData.role === 'recruiter' && (
              <>
                <div>
                  <label htmlFor="entreprise_name" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    id="entreprise_name"
                    name="entreprise_name"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.entreprise_name}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Company Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
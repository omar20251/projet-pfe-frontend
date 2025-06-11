import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import jobService from '../../services/jobService';
import recruiterService from '../../services/recruiterService';
import './PostJobForm.css';

// Define TypeScript interfaces
interface JobFormData {
  jobTitle: string;
  category: string;
  duration: string;
  description: string;
  requirements: string[];
  benefits: string;
  salary: string;
  location: string;
  experienceLevel: string;
  skills: string[];
  level: string;
}

const PostJobForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [recruiterProfile, setRecruiterProfile] = useState<any>(null);
  const [formData, setFormData] = useState<JobFormData>({
    jobTitle: '',
    category: '',
    duration: '',
    description: '',
    requirements: [''],
    benefits: '',
    salary: '',
    location: '',
    experienceLevel: 'Mid-level',
    skills: [''],
    level: ''
  });

  useEffect(() => {
    const fetchRecruiterProfile = async () => {
      try {
        const profile = await recruiterService.getCurrentRecruiterProfile();
        setRecruiterProfile(profile);
      } catch (error) {
        console.error('Error fetching recruiter profile:', error);
      }
    };

    if (user?.role === 'recruiter') {
      fetchRecruiterProfile();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field: keyof JobFormData, index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[field] as string[]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayField = (field: keyof JobFormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recruiterProfile) {
      alert('Recruiter profile not found. Please try again.');
      return;
    }

    try {
      setIsLoading(true);

      // Transform form data to match backend API
      const jobData = {
        title: formData.jobTitle,
        entreprise_name: recruiterProfile.entreprise_name,
        place: formData.location,
        open_postes: '1', // Default to 1 if not specified
        experience: formData.experienceLevel,
        education_level: formData.level || 'Bachelor',
        language: 'French', // Default language
        description: formData.description,
        requirements: formData.requirements.filter(req => req.trim()).join(', '),
        salary: parseFloat(formData.salary) || 0,
        publication_date: new Date().toISOString().split('T')[0],
        expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        skills: formData.skills.filter(skill => skill.trim()).join(', '),
        contract_type: formData.duration || 'Full-time',
        recruiter_id: recruiterProfile.id
      };

      const response = await jobService.createJob(jobData);
      console.log('Job created successfully:', response);

      alert('Job offer created successfully!');
      navigate('/recruiter');
    } catch (error: any) {
      console.error('Error creating job:', error);
      alert('Error creating job offer: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Job Offer</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Job Title */}
        <div className="form-group">
          <label>Job Title*</label>
          <input
            type="text"
            name="jobTitle"
            placeholder="e.g., Senior Frontend Developer"
            value={formData.jobTitle}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category*</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Frontend">Frontend Development</option>
            <option value="Backend">Backend Development</option>
            <option value="Fullstack">Fullstack Development</option>
          </select>
        </div>
        {/* Education Level */}
        <div className="form-group">
          <label>Education Level*</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
          >
            <option value="">Select Education Level</option>
            <option value="High School">High School</option>
            <option value="Bachelor">Bachelor's Degree</option>
            <option value="Master">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Location*</label>
          <input
            type="text"
            name="location"
            placeholder="e.g., Tunis, Tunisia"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* Experience Level */}
        <div className="form-group">
          <label>Experience Level*</label>
          <select
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            required
          >
            <option value="">Select Experience Level</option>
            <option value="Entry Level">Entry Level (0-1 years)</option>
            <option value="Mid-level">Mid-level (2-5 years)</option>
            <option value="Senior">Senior (5+ years)</option>
          </select>
        </div>

        {/* Salary */}
        <div className="form-group">
          <label>Salary (TND)*</label>
          <input
            type="number"
            name="salary"
            placeholder="e.g., 2000"
            value={formData.salary}
            onChange={handleChange}
            required
          />
        </div>

        {/* Contract Type */}
        <div className="form-group">
          <label>Contract Type*</label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          >
            <option value="">Select Contract Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Job Description*</label>
          <textarea
            name="description"
            placeholder="Describe the job responsibilities and requirements..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>


        {/* Requirements (dynamic fields) */}
        <div className="form-group">
          <label>Requirements*</label>
          {formData.requirements.map((req, index) => (
            <div key={index} className="array-field">
              <input
                type="text"
                value={req}
                onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                placeholder={`Requirement ${index + 1}`}
                required
              />
              {index === formData.requirements.length - 1 && (
                <button
                  type="button"
                  onClick={() => addArrayField('requirements')}
                  className="add-field-btn"
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Skills (dynamic fields) */}
        <div className="form-group">
          <label>Required Skills*</label>
          {formData.skills.map((skill, index) => (
            <div key={index} className="array-field">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                placeholder={`Skill ${index + 1} (e.g., React, Node.js)`}
                required
              />
              {index === formData.skills.length - 1 && (
                <button
                  type="button"
                  onClick={() => addArrayField('skills')}
                  className="add-field-btn"
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button 
            type="button"
            className="btn-delete"
            onClick={() => {/* Delete logic */}}
          >
            Delete Offer
          </button>
          
          <button 
            type="button"
            className="btn-modify"
            onClick={() => {/* Modify logic */}}
          >
            Modify Offer
          </button>
          
          <button 
            type="button"
            className="btn-view-all"
            onClick={() => navigate('/job-offers')}
          >
            View All offers
          </button>
          
          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Publish Offer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobForm;
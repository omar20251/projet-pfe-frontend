import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    console.log('Job Posted:', formData);
    navigate('/recruiter-dashboard');
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
        {/* level */}
        <div className="form-group">
          <label>level</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="begginer">begginer</option>
            <option value="intermidiate">intermidiate</option>
            <option value="advanced">advanced</option>
          </select>
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

        {/* Other fields... */}

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
          
          <button type="submit" className="btn-submit">
            Publish offer
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobForm;
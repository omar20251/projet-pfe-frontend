import api from './api';
import { JobOffer } from '../types';

export interface CreateJobRequest {
  title: string;
  entreprise_name: string;
  place: string;
  open_postes: string;
  experience: string;
  education_level: string;
  language: string;
  description: string;
  requirements: string;
  salary: number;
  publication_date: string;
  expiration_date: string;
  skills: string;
  contract_type: string;
  recruiter_id: number;
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {}

class JobService {
  // Get all job offers
  async getAllJobs(): Promise<JobOffer[]> {
    const response = await api.get('/ListeOffre');
    return response.data;
  }

  // Get valid job offers
  async getValidJobs(): Promise<JobOffer[]> {
    const response = await api.get('/ListeoffreValide');
    return response.data;
  }

  // Get invalid job offers
  async getInvalidJobs(): Promise<JobOffer[]> {
    const response = await api.get('/ListeoffreNonValide');
    return response.data;
  }

  // Get pending job offers
  async getPendingJobs(): Promise<JobOffer[]> {
    const response = await api.get('/ListeOffreEnAttente');
    return response.data;
  }

  // Get job offer by ID
  async getJobById(id: string): Promise<JobOffer> {
    const response = await api.get(`/offre/${id}`);
    return response.data;
  }

  // Create new job offer
  async createJob(jobData: CreateJobRequest): Promise<any> {
    const response = await api.post('/register/offre', jobData);
    return response.data;
  }

  // Update job offer
  async updateJob(id: string, jobData: UpdateJobRequest): Promise<any> {
    const response = await api.put(`/update/offre/${id}`, jobData);
    return response.data;
  }

  // Delete job offer
  async deleteJob(id: string): Promise<any> {
    const response = await api.put(`/delete/offre/${id}`);
    return response.data;
  }

  // Apply to job offer
  async applyToJob(jobData: { offre_id: number }): Promise<any> {
    const response = await api.post('/candidature/postuler', jobData);
    return response.data;
  }

  // Get candidate applications
  async getCandidateApplications(): Promise<any[]> {
    const response = await api.get('/candidature/mes-postulations');
    return response.data;
  }
}

export default new JobService();

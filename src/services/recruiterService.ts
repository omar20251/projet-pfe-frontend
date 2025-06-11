import api from './api';

export interface RecruiterProfile {
  id: number;
  entreprise_name: string;
  website: string;
  phone: string;
  address: string;
  logo?: string;
  entreprise_description: string;
  unique_identifier: string;
  domaine: string;
  user_id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: number;
    statut: string;
  };
}

export interface UpdateRecruiterRequest {
  entreprise_name?: string;
  website?: string;
  phone?: string;
  address?: string;
  logo?: string;
  entreprise_description?: string;
  unique_identifier?: string;
  domaine?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface Domain {
  id: number;
  name: string;
}

class RecruiterService {
  // Get current recruiter profile
  async getCurrentRecruiterProfile(): Promise<RecruiterProfile> {
    const response = await api.get('/consulter/profil/recruiter');
    return response.data;
  }

  // Get all domains
  async getDomains(): Promise<Domain[]> {
    const response = await api.get('/domains');
    return response.data.data; // API returns {data: [...]}
  }

  // Get recruiter by ID
  async getRecruiterById(id: string): Promise<RecruiterProfile> {
    const response = await api.get(`/recruiter/${id}`);
    return response.data;
  }

  // Update recruiter
  async updateRecruiter(id: string, recruiterData: UpdateRecruiterRequest): Promise<any> {
    const response = await api.put(`/update/recruiter/${id}`, recruiterData);
    return response.data;
  }

  // Update own recruiter profile
  async updateOwnProfile(recruiterData: UpdateRecruiterRequest): Promise<any> {
    const response = await api.put('/update/profil/recruiter', recruiterData);
    return response.data;
  }

  // Delete recruiter by ID (admin function)
  async deleteRecruiter(id: string): Promise<any> {
    const response = await api.put(`/delete/recruiter/${id}`);
    return response.data;
  }

  // Delete own profile
  async deleteOwnProfile(): Promise<any> {
    const response = await api.put('/delete/recruiter');
    return response.data;
  }
}

export default new RecruiterService();

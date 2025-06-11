import api from './api';

export interface CandidateProfile {
  id: number;
  civility: 'M' | 'Mme' | 'Mlle';
  birth_date: string;
  Governorate: string;
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

export interface UpdateCandidateRequest {
  civility?: 'M' | 'Mme' | 'Mlle';
  birth_date?: string;
  Governorate?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

class CandidateService {
  // Get all candidates
  async getAllCandidates(): Promise<CandidateProfile[]> {
    const response = await api.get('/ListeCandidate');
    return response.data;
  }

  // Get valid candidates
  async getValidCandidates(): Promise<CandidateProfile[]> {
    const response = await api.get('/ListeCandidateValide');
    return response.data;
  }

  // Get invalid candidates
  async getInvalidCandidates(): Promise<CandidateProfile[]> {
    const response = await api.get('/ListeCandidateNonValide');
    return response.data;
  }

  // Get pending candidates
  async getPendingCandidates(): Promise<CandidateProfile[]> {
    const response = await api.get('/ListeCandidateEnattente');
    return response.data;
  }

  // Get candidate by ID
  async getCandidateById(id: string): Promise<CandidateProfile> {
    const response = await api.get(`/candidate/${id}`);
    return response.data;
  }

  // Get current candidate profile
  async getCurrentCandidateProfile(): Promise<CandidateProfile> {
    const response = await api.get('/consulter/profil/candidate');
    return response.data;
  }

  // Update candidate
  async updateCandidate(id: string, candidateData: UpdateCandidateRequest): Promise<any> {
    const response = await api.put(`/update/candidate/${id}`, candidateData);
    return response.data;
  }

  // Delete candidate
  async deleteCandidate(id: string): Promise<any> {
    const response = await api.put(`/delete/candidate/${id}`);
    return response.data;
  }

  // Update application status
  async updateApplicationStatus(candidateId: string, offreId: string, status: string): Promise<any> {
    const response = await api.put(`/candidat/${candidateId}/offre/${offreId}/status`, { status });
    return response.data;
  }
}

export default new CandidateService();

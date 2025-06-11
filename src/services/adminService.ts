import api from './api';

export interface AdminStats {
  totalUsers: number;
  totalCandidates: number;
  totalRecruiters: number;
  totalJobs: number;
  pendingJobs: number;
  validJobs: number;
  invalidJobs: number;
}

class AdminService {
  // Get admin dashboard statistics
  async getDashboardStats(): Promise<AdminStats> {
    // This would need to be implemented in the backend
    // For now, we'll fetch individual endpoints and aggregate
    const [candidates, recruiters, jobs] = await Promise.all([
      api.get('/ListeCandidate'),
      api.get('/ListeRecruiter'), // This endpoint might need to be created
      api.get('/ListeOffre')
    ]);

    const validJobs = jobs.data.filter((job: any) => job.statut === 'valide');
    const pendingJobs = jobs.data.filter((job: any) => job.statut === 'en attente de validation');
    const invalidJobs = jobs.data.filter((job: any) => job.statut === 'non valide');

    return {
      totalUsers: candidates.data.length + recruiters.data.length,
      totalCandidates: candidates.data.length,
      totalRecruiters: recruiters.data.length,
      totalJobs: jobs.data.length,
      pendingJobs: pendingJobs.length,
      validJobs: validJobs.length,
      invalidJobs: invalidJobs.length
    };
  }

  // Validate job offer
  async validateJob(jobId: string): Promise<any> {
    const response = await api.put(`/validate/offre/${jobId}`);
    return response.data;
  }

  // Reject job offer
  async rejectJob(jobId: string): Promise<any> {
    const response = await api.put(`/reject/offre/${jobId}`);
    return response.data;
  }

  // Validate candidate
  async validateCandidate(candidateId: string): Promise<any> {
    const response = await api.put(`/validate/candidate/${candidateId}`);
    return response.data;
  }

  // Reject candidate
  async rejectCandidate(candidateId: string): Promise<any> {
    const response = await api.put(`/reject/candidate/${candidateId}`);
    return response.data;
  }

  // Validate recruiter
  async validateRecruiter(recruiterId: string): Promise<any> {
    const response = await api.put(`/validate/recruiter/${recruiterId}`);
    return response.data;
  }

  // Reject recruiter
  async rejectRecruiter(recruiterId: string): Promise<any> {
    const response = await api.put(`/reject/recruiter/${recruiterId}`);
    return response.data;
  }
}

export default new AdminService();

export type Role = 'candidate' | 'recruiter' | 'admin';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  dateNaissance?: Date;
  governorat?: string;
  entreprise_name?: string;
  website?: string;
  logo?: string;
  description?: string;
}

export interface JobOffer {
  id: string;
  titre: string;
  entreprise: string;
  description: string;
  lieu: string;
  postes_vacants: string;
  experience: string;
  niveau_etude: string;
  langue: string;
  competences: string[];
  salaire: number;
  typeContrat: string;
  datePublication: Date;
  dateExpiration: Date;
  etat: 'active' | 'closed' | 'draft';
  tests?: Test[];
}

export interface Test {
  id: string;
  titre: string;
  dureeMinutes: number;
  categorie: string;
  description?: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[];
  correctAnswers?: string[] | string;
  points: number;
}

export interface TestSubmission {
  id: string;
  testId: string;
  candidateId: string;
  startTime: Date;
  endTime?: Date;
  answers: {
    questionId: string;
    answer: string | string[];
  }[];
  score?: number;
  maxScore?: number;
  percentage?: number;
}

export interface Feedback {
  id: string;
  message: string;
  userId: string;
  targetId?: string;
  date: Date;
  type: 'system' | 'recruiter' | 'candidate';
}

export interface Complaint {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: Date;
  status: 'pending' | 'processing' | 'resolved';
}
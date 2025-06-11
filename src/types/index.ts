export type Role = 'candidate' | 'recruiter' | 'admin';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  statut?: string;
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
  requirements?: string;
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
  statut?: string;
  recruiter_id?: string; // Changed from number to string for consistency (usually matches User.id)
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
  options?: string[];               // pour les questions à choix
  correctAnswers?: string | string[]; // réponse(s) correcte(s)
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
    answer: string | string[]; // Based on question type
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

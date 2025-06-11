import api from './api';

export interface QuizRequest {
  id: number;
  candidate_id: number;
  skill: string;
  level: string;
  status: 'created' | 'completed' | 'failed';
  message: string;
  requested_at: string;
  completed_at?: string;
  score?: number;
}

export interface Question {
  id: number;
  quiz_request_id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
}

export interface Answer {
  id: number;
  question_id: number;
  candidate_id: number;
  user_answer: string;
  is_correct: boolean;
}

export interface GenerateQuizRequest {
  skill: string;
  level: string;
  message?: string;
}

export interface SubmitAnswersRequest {
  answers: {
    question_id: number;
    user_answer: string;
  }[];
}

class QuizService {
  // Generate quiz
  async generateQuiz(quizData: GenerateQuizRequest): Promise<any> {
    const response = await api.post('/api/generate-quiz', quizData);
    return response.data;
  }

  // Get quiz questions
  async getQuizQuestions(quizRequestId: string): Promise<Question[]> {
    const response = await api.get(`/quiz/${quizRequestId}/questions`);
    return response.data;
  }

  // Submit quiz answers
  async submitAnswers(quizRequestId: string, answers: SubmitAnswersRequest): Promise<any> {
    const response = await api.post(`/quiz/${quizRequestId}/submit`, answers);
    return response.data;
  }

  // Get candidate quiz history
  async getCandidateQuizHistory(candidateId: string): Promise<QuizRequest[]> {
    const response = await api.get(`/quiz/candidate/${candidateId}/history`);
    return response.data;
  }
}

export default new QuizService();

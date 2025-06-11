import api from './api';

export interface Feedback {
  id: number;
  message: string;
  'candidate-id': number;
  created_at: string;
  updated_at: string;
}

export interface CreateFeedbackRequest {
  message: string;
}

export interface UpdateFeedbackRequest {
  message: string;
}

class FeedbackService {
  // Add feedback
  async addFeedback(feedbackData: CreateFeedbackRequest): Promise<any> {
    const response = await api.post('/addfeedback', feedbackData);
    return response.data;
  }

  // Get feedback
  async getFeedback(): Promise<Feedback[]> {
    const response = await api.get('/showfeedback');
    return response.data;
  }

  // Update feedback
  async updateFeedback(feedbackData: UpdateFeedbackRequest): Promise<any> {
    const response = await api.put('/updatefeedback', feedbackData);
    return response.data;
  }

  // Delete feedback
  async deleteFeedback(): Promise<any> {
    const response = await api.put('/deletefeedback');
    return response.data;
  }
}

export default new FeedbackService();

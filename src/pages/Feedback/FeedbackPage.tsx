import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import feedbackService, { Feedback } from '../../services/feedbackService';
import './FeedbackPage.css';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!isAuthenticated || user?.role !== 'candidate') {
        setIsLoading(false);
        return;
      }

      try {
        const feedbackData = await feedbackService.getFeedback();
        setFeedbacks(feedbackData);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        setError('Failed to load feedbacks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, [isAuthenticated, user]);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      if (editingId) {
        // Update existing feedback
        await feedbackService.updateFeedback({ message: inputText });
        setFeedbacks(feedbacks.map(f =>
          f.id === editingId ? { ...f, message: inputText } : f
        ));
      } else {
        // Add new feedback
        const response = await feedbackService.addFeedback({ message: inputText });
        // Refresh feedbacks to get the latest data
        const updatedFeedbacks = await feedbackService.getFeedback();
        setFeedbacks(updatedFeedbacks);
      }

      setInputText('');
      setEditingId(null);
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (feedback: Feedback) => {
    setInputText(feedback.message);
    setEditingId(feedback.id);
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await feedbackService.deleteFeedback();
      // Refresh feedbacks
      const updatedFeedbacks = await feedbackService.getFeedback();
      setFeedbacks(updatedFeedbacks);
    } catch (err: any) {
      console.error('Error deleting feedback:', err);
      setError(err.response?.data?.message || 'Failed to delete feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="feedback-page">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Please log in to access feedback</h2>
          <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (user?.role !== 'candidate') {
    return (
      <div className="feedback-page">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Feedback is only available for candidates</h2>
          <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="feedback-page">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading feedbacks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-page">
      <header className="feedback-header">
        <h1>Candidate Feedback</h1>
        <Link to="/jobs" className="back-link">← Back to Jobs</Link>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      <div className="feedback-editor">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Share your experience with this job..."
          disabled={isSubmitting}
        />
        <button
          onClick={handleSubmit}
          className="submit-btn"
          disabled={isSubmitting || !inputText.trim()}
        >
          {isSubmitting
            ? 'Submitting...'
            : editingId
              ? 'Update Feedback'
              : 'Submit Feedback'
          }
        </button>
      </div>

      <div className="feedback-list">
        {feedbacks.length > 0 ? (
          feedbacks.map(feedback => (
            <div key={feedback.id} className="feedback-card">
              <p className="feedback-text">{feedback.message}</p>
              <div className="feedback-meta">
                <span className="feedback-date">
                  {new Date(feedback.created_at).toLocaleDateString()}
                </span>
                <div className="feedback-actions">
                  <button
                    onClick={() => handleEdit(feedback)}
                    className="edit-btn"
                    disabled={isSubmitting}
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="delete-btn"
                    disabled={isSubmitting}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No feedback submitted yet. Share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
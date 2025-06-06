import { useState } from 'react';
import { Link } from 'react-router-dom';
import './FeedbackPage.css';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, text: 'The test was well-structured', date: '2023-06-01' },
    { id: 2, text: 'Clear job requirements', date: '2023-05-28' }
  ]);
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = () => {
    if (inputText.trim()) {
      if (editingId) {
        // Update existing
        setFeedbacks(feedbacks.map(f => 
          f.id === editingId ? { ...f, text: inputText } : f
        ));
      } else {
        // Add new
        setFeedbacks([
          ...feedbacks,
          {
            id: Date.now(),
            text: inputText,
            date: new Date().toISOString().split('T')[0]
          }
        ]);
      }
      setInputText('');
      setEditingId(null);
    }
  };

  return (
    <div className="feedback-page">
      <header className="feedback-header">
        <h1>Candidate Feedback</h1>
        <Link to="/jobs" className="back-link">← Back to Jobs</Link>
      </header>

      <div className="feedback-editor">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Share your experience with this job..."
        />
        <button onClick={handleSubmit} className="submit-btn">
          {editingId ? 'Update Feedback' : 'Submit Feedback'}
        </button>
      </div>

      <div className="feedback-list">
        {feedbacks.map(feedback => (
          <div key={feedback.id} className="feedback-card">
            <p className="feedback-text">{feedback.text}</p>
            <div className="feedback-meta">
              <span className="feedback-date">{feedback.date}</span>
              <div className="feedback-actions">
                <button 
                  onClick={() => {
                    setInputText(feedback.text);
                    setEditingId(feedback.id);
                  }}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button 
                  onClick={() => setFeedbacks(feedbacks.filter(f => f.id !== feedback.id))}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackPage;
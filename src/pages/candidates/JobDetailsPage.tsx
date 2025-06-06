// 1. Add import at the top with other imports
import FeedbackWidget from '../../components/candidate/FeedbackWidget';

// 2. Inside your existing JobDetailsPage component:
const JobDetailsPage = () => {
  // ... your existing state and logic ...

  return (
    <div className="job-details-page">
      {/* ... all your existing JSX ... */}
      
      {/* Add this right before the closing </div> */}
      <FeedbackWidget />
    </div>
  );
};

export default JobDetailsPage;
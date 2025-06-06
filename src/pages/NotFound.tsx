import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-medium text-gray-700 mb-6">Page not found</h2>
      <p className="text-gray-500 mb-8 max-w-md text-center">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Check, 
  X, 
  AlertCircle, 
  Award, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  ArrowLeft
} from 'lucide-react';
// import { mockTests } from '../../mocks/testMocks'; // Removed mock data
import { Test, TestSubmission } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const TestResults = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [test, setTest] = useState<Test | null>(null);
  const [submission, setSubmission] = useState<TestSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    // In a real app, this would be an API call
    setIsLoading(true);
    
    // TODO: Implement real API call to get test data
    // const foundTest = mockTests.find(t => t.id === id);
    // setTest(foundTest || null);
    setTest(null); // Placeholder until API is implemented
    
    // Get submission data from location state or mock data
    const submissionFromState = location.state?.submission as TestSubmission;
    if (submissionFromState) {
      setSubmission(submissionFromState);
    } else {
      // In a real app, we would fetch this from the API
      // For now, create a mock submission
      const mockSubmission: TestSubmission = {
        id: '123',
        testId: id || '',
        candidateId: user?.id || '',
        testTitle: foundTest?.titre || 'Test',
        startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        endTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        answers: foundTest?.questions.map(q => ({
          questionId: q.id,
          answer: q.type === 'single' ? q.options?.[0] || '' : 
                  q.type === 'multiple' ? [q.options?.[0] || ''] : 'Sample answer'
        })) || [],
        score: 85,
        maxScore: 100,
        percentage: 85
      };
      setSubmission(mockSubmission);
    }
    
    setIsLoading(false);
  }, [id, location.state]);

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const getQuestionResult = (questionId: string) => {
    if (!test || !submission) return null;
    
    const question = test.questions.find(q => q.id === questionId);
    if (!question) return null;
    
    const answer = submission.answers.find(a => a.questionId === questionId);
    if (!answer) return { isCorrect: false, userAnswer: null, correctAnswer: question.correctAnswers };
    
    let isCorrect = false;
    
    if (question.type === 'single') {
      isCorrect = answer.answer === question.correctAnswers;
    } else if (question.type === 'multiple') {
      const correctAnswers = question.correctAnswers as string[];
      if (Array.isArray(answer.answer)) {
        isCorrect = correctAnswers.length === answer.answer.length && 
                  correctAnswers.every(a => answer.answer.includes(a));
      }
    } else if (question.type === 'text') {
      // For text questions, we'd typically have a human review
      // For demo purposes, we'll do a simple check
      if (typeof answer.answer === 'string' && typeof question.correctAnswers === 'string') {
        isCorrect = answer.answer.toLowerCase() === question.correctAnswers.toLowerCase();
      }
    }
    
    return {
      isCorrect,
      userAnswer: answer.answer,
      correctAnswer: question.correctAnswers
    };
  };

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 70) return 'satisfactory';
    if (percentage >= 60) return 'needs improvement';
    return 'poor';
  };

  const performanceLevelMessages = {
    excellent: 'Outstanding performance! You demonstrated comprehensive knowledge of the subject matter.',
    good: 'Good job! You have a solid understanding of most concepts tested.',
    satisfactory: 'You have a reasonable grasp of the fundamentals, but there\'s room for improvement.',
    'needs improvement': 'You demonstrated basic knowledge but need to strengthen your understanding of key concepts.',
    poor: 'You need significant improvement in your understanding of the subject matter.'
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!test || !submission) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">Results not found</h2>
        <p className="text-gray-500 mb-4">We couldn\'t find the test results you\'re looking for.</p>
        <button
          onClick={() => navigate('/jobs')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  const testDuration = submission.endTime && submission.startTime
    ? Math.round((new Date(submission.endTime).getTime() - new Date(submission.startTime).getTime()) / 60000)
    : test.dureeMinutes;

  const performanceLevel = getPerformanceLevel(submission.percentage);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full text-gray-600 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-50 p-6">
          <h2 className="text-xl font-medium text-gray-900">{test.titre}</h2>
          <p className="mt-1 text-gray-600">{submission.testTitle || test.description}</p>
          
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">
                Score: <span className="font-medium">{submission.score}/{submission.maxScore} ({submission.percentage}%)</span>
              </span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">
                Duration: <span className="font-medium">{testDuration} minutes</span>
              </span>
            </div>
            
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">
                Completed: <span className="font-medium">{submission.endTime ? new Date(submission.endTime).toLocaleString() : 'Unknown'}</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Performance Summary</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                submission.percentage >= 80 
                  ? 'bg-green-100 text-green-800' 
                  : submission.percentage >= 60 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {submission.percentage}%
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className={`h-2.5 rounded-full ${
                  submission.percentage >= 80 
                    ? 'bg-green-600' 
                    : submission.percentage >= 60 
                      ? 'bg-yellow-500' 
                      : 'bg-red-600'
                }`}
                style={{ width: `${submission.percentage}%` }}
              ></div>
            </div>
            
            <div className="mt-4 p-4 rounded-md bg-blue-50 border border-blue-100">
              <p className="text-sm text-gray-800">
                {performanceLevelMessages[performanceLevel as keyof typeof performanceLevelMessages]}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Question Analysis</h3>
            
            <div className="space-y-4">
              {test.questions.map((question, index) => {
                const result = getQuestionResult(question.id);
                const isExpanded = expandedQuestions.has(question.id);
                
                return (
                  <div 
                    key={question.id} 
                    className="border border-gray-200 rounded-md overflow-hidden"
                  >
                    <div 
                      className={`p-4 flex justify-between items-start cursor-pointer ${
                        result?.isCorrect ? 'bg-green-50' : 'bg-red-50'
                      }`}
                      onClick={() => toggleQuestion(question.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-1 rounded-full ${
                          result?.isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}>
                          {result?.isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Question {index + 1}</h4>
                          <p className="text-sm text-gray-700 line-clamp-1">{question.text}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">
                          {result?.isCorrect ? `${question.points}/${question.points}` : `0/${question.points}`}
                        </span>
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="p-4 border-t border-gray-200 bg-white">
                        <p className="text-sm text-gray-900 mb-4">{question.text}</p>
                        
                        {question.type === 'single' && question.options && (
                          <div className="space-y-2">
                            {question.options.map(option => (
                              <div 
                                key={option} 
                                className={`p-3 rounded-md text-sm ${
                                  option === question.correctAnswers 
                                    ? 'bg-green-100 text-green-800' 
                                    : option === result?.userAnswer 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-gray-50 text-gray-700'
                                }`}
                              >
                                <div className="flex items-center">
                                  {option === result?.userAnswer && option !== question.correctAnswers && (
                                    <X className="h-4 w-4 mr-2 text-red-600" />
                                  )}
                                  {option === question.correctAnswers && (
                                    <Check className="h-4 w-4 mr-2 text-green-600" />
                                  )}
                                  {option}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'multiple' && question.options && (
                          <div className="space-y-2">
                            {question.options.map(option => {
                              const correctAnswers = question.correctAnswers as string[];
                              const userAnswers = result?.userAnswer as string[] || [];
                              const isCorrectOption = correctAnswers.includes(option);
                              const isSelectedOption = userAnswers.includes(option);
                              
                              let bgClass = 'bg-gray-50 text-gray-700';
                              if (isCorrectOption && isSelectedOption) {
                                bgClass = 'bg-green-100 text-green-800';
                              } else if (isCorrectOption && !isSelectedOption) {
                                bgClass = 'bg-yellow-100 text-yellow-800';
                              } else if (!isCorrectOption && isSelectedOption) {
                                bgClass = 'bg-red-100 text-red-800';
                              }
                              
                              return (
                                <div key={option} className={`p-3 rounded-md text-sm ${bgClass}`}>
                                  <div className="flex items-center">
                                    {isCorrectOption && (
                                      <Check className="h-4 w-4 mr-2 text-green-600" />
                                    )}
                                    {!isCorrectOption && isSelectedOption && (
                                      <X className="h-4 w-4 mr-2 text-red-600" />
                                    )}
                                    {option}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {question.type === 'text' && (
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Your Answer:</p>
                              <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-800">
                                {result?.userAnswer as string || 'No answer provided'}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Correct Answer:</p>
                              <div className="p-3 bg-green-50 rounded-md text-sm text-green-800">
                                {question.correctAnswers as string}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {!result?.isCorrect && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-md">
                            <div className="flex items-start">
                              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-blue-800">Explanation</p>
                                <p className="text-sm text-blue-700 mt-1">
                                  {question.explanation || 'The correct answer is shown above. Review the related materials to better understand this concept.'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Want to improve your skills?</h2>
            <p className="text-gray-600 mt-1">
              Check out our recommended resources to strengthen your knowledge in areas where you scored lower.
            </p>
          </div>
          
          <button
            onClick={() => {/* Navigate to resources */}}
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            Explore Resources
            <ChevronRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults